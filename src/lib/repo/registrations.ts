import { randomUUID } from "crypto";
import { Client } from "pg";
import { connectDsql } from "@/lib/dsql";
import { storeStudentPhoto } from "@/lib/slip-store";
import { publicCourses } from "@/lib/repo/courses";
import type { RegistrationInput, RegistrationStatus, RegistrationUpdate } from "@/lib/registration-schema";
import { formatStudentId, studentInitial } from "@/lib/student-id";

async function connect() {
  return connectDsql();
}

let ready: Promise<void> | null = null;

async function ensureRegistrations(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      gender TEXT,
      course_id TEXT NOT NULL,
      course_title TEXT NOT NULL,
      months INTEGER NOT NULL,
      fee_naira INTEGER NOT NULL,
      guardian_name TEXT,
      guardian_phone TEXT,
      note TEXT,
      desk_note TEXT,
      student_code TEXT,
      photo_key TEXT
    )
  `);
  await client.query(`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS photo_key TEXT`);
  await client
    .query(`CREATE UNIQUE INDEX ASYNC IF NOT EXISTS registrations_student_code_key ON registrations (student_code)`)
    .catch((error: unknown) => {
      console.error("student code index skipped", error instanceof Error ? error.name : "unknown");
    });
}

async function withRegistrations<T>(run: (client: Client) => Promise<T>) {
  ready ??= (async () => {
    const client = await connect();
    try {
      await ensureRegistrations(client);
    } finally {
      await client.end();
    }
  })();
  try {
    await ready;
  } catch (error) {
    ready = null;
    throw error;
  }
  const client = await connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

type RegistrationRow = {
  id: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  full_name: string;
  phone: string;
  email: string | null;
  gender: string | null;
  course_id: string;
  course_title: string;
  months: number;
  fee_naira: number;
  guardian_name: string | null;
  guardian_phone: string | null;
  note: string | null;
  desk_note: string | null;
  student_code: string | null;
  photo_key: string | null;
};

export type StoredRegistration = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RegistrationStatus;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  courseId: string;
  courseTitle: string;
  months: number;
  feeNaira: number;
  guardianName: string;
  guardianPhone: string;
  note: string;
  deskNote: string;
  studentCode: string;
  photoKey: string;
};

function mapRow(row: RegistrationRow): StoredRegistration {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    status: row.status as RegistrationStatus,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email ?? "",
    gender: row.gender ?? "",
    courseId: row.course_id,
    courseTitle: row.course_title,
    months: row.months,
    feeNaira: row.fee_naira,
    guardianName: row.guardian_name ?? "",
    guardianPhone: row.guardian_phone ?? "",
    note: row.note ?? "",
    deskNote: row.desk_note ?? "",
    studentCode: row.student_code ?? "",
    photoKey: row.photo_key ?? "",
  };
}

const columns = `id, created_at, updated_at, status, full_name, phone, email, gender, course_id, course_title, months, fee_naira, guardian_name, guardian_phone, note, desk_note, student_code, photo_key`;

async function courseChoice(courseId: string, months: number) {
  const courses = await publicCourses();
  const course = courses.find((item) => item.id === courseId);
  const option = course?.options.find((item) => item.months === months);
  if (!course || !option) return null;
  return { course, option };
}

function blank(value: string | undefined) {
  const text = value?.trim() ?? "";
  return text || null;
}

export async function createRegistration(input: RegistrationInput, photoBase64 = "") {
  const choice = await courseChoice(input.courseId, input.months);
  if (!choice) throw new Error("Unknown course");
  const id = randomUUID();
  let photoKey = "";
  if (photoBase64) {
    try {
      photoKey = await storeStudentPhoto(id, photoBase64);
    } catch (error) {
      if (error instanceof Error && error.message === "photograph") throw error;
      console.error("student photo failed", error instanceof Error ? error.name : "unknown");
    }
  }
  const now = new Date().toISOString();
  await withRegistrations((client) =>
    client.query(
      `INSERT INTO registrations (${columns})
       VALUES ($1, $2, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, '', NULL, $14)`,
      [
        id,
        now,
        input.fullName,
        input.phone,
        blank(input.email),
        blank(input.gender),
        choice.course.id,
        choice.course.title,
        choice.option.months,
        choice.option.feeNaira,
        blank(input.guardianName),
        blank(input.guardianPhone),
        blank(input.note),
        photoKey,
      ],
    ),
  );
  return id;
}

export async function saveRegistrationPhoto(id: string, photoBase64: string) {
  const photoKey = await storeStudentPhoto(id, photoBase64);
  const saved = await withRegistrations(async (client) => {
    const result = await client.query(`UPDATE registrations SET photo_key = $2, updated_at = $3 WHERE id = $1`, [id, photoKey, new Date().toISOString()]);
    return Boolean(result.rowCount);
  });
  return saved ? photoKey : "";
}

export async function listRegistrations() {
  const result = await withRegistrations((client) =>
    client.query<RegistrationRow>(`SELECT ${columns} FROM registrations ORDER BY created_at DESC`),
  );
  const rank: Record<string, number> = { pending: 0, waitlist: 1, accepted: 2, declined: 3 };
  return result.rows.map(mapRow).sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || b.createdAt.localeCompare(a.createdAt));
}

export async function getRegistrationByCode(code: string) {
  const needle = code.trim();
  if (!needle) return null;
  const result = await withRegistrations((client) =>
    client.query<RegistrationRow>(
      `SELECT ${columns} FROM registrations WHERE lower(student_code) = lower($1) ORDER BY created_at DESC`,
      [needle],
    ),
  );
  const rows = result.rows.map(mapRow);
  return rows.find((row) => row.status === "accepted") ?? null;
}

export async function getRegistration(id: string) {
  const result = await withRegistrations((client) =>
    client.query<RegistrationRow>(`SELECT ${columns} FROM registrations WHERE id = $1`, [id]),
  );
  const row = result.rows[0];
  return row ? mapRow(row) : null;
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23505";
}

async function allocateStudentCode(client: Client, fullName: string, year = new Date().getFullYear()) {
  const yy = String(year % 100).padStart(2, "0");
  const result = await client.query<{ student_code: string | null }>(
    `SELECT student_code FROM registrations WHERE student_code LIKE $1`,
    [`ALB-%${yy}`],
  );
  let max = 0;
  for (const row of result.rows) {
    const match = /^ALB-(\d{4})[A-Z]\d{2}$/.exec(row.student_code ?? "");
    if (match) max = Math.max(max, Number(match[1]));
  }
  if (max >= 9999) throw new Error("student codes full");
  return formatStudentId(max + 1, studentInitial(fullName), year);
}

export async function updateRegistration(id: string, input: RegistrationUpdate) {
  const choice = await courseChoice(input.courseId, input.months);
  if (!choice) throw new Error("Unknown course");
  return withRegistrations(async (client) => {
    const current = await client.query<{ student_code: string | null }>(`SELECT student_code FROM registrations WHERE id = $1`, [id]);
    if (!current.rowCount) return null;
    let studentCode = (input.studentCode ?? "").trim().toUpperCase();
    const existing = (current.rows[0]?.student_code ?? "").trim().toUpperCase();
    let allocated = false;
    if (!studentCode) studentCode = existing;
    if (!studentCode && input.status === "accepted") {
      studentCode = await allocateStudentCode(client, input.fullName);
      allocated = true;
    }

    const save = (code: string) =>
      client.query(
        `UPDATE registrations
         SET updated_at = $2, status = $3, full_name = $4, phone = $5, email = $6, gender = $7,
             course_id = $8, course_title = $9, months = $10, fee_naira = $11,
             guardian_name = $12, guardian_phone = $13, note = $14, desk_note = $15, student_code = $16
         WHERE id = $1`,
        [
          id,
          new Date().toISOString(),
          input.status,
          input.fullName,
          input.phone,
          blank(input.email),
          blank(input.gender),
          choice.course.id,
          choice.course.title,
          choice.option.months,
          choice.option.feeNaira,
          blank(input.guardianName),
          blank(input.guardianPhone),
          blank(input.note),
          blank(input.deskNote),
          code || null,
        ],
      );

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const result = await save(studentCode);
        return result.rowCount ? studentCode : null;
      } catch (error) {
        if (!isUniqueViolation(error) || !allocated || attempt === 2) {
          if (isUniqueViolation(error)) throw new Error("duplicate");
          throw error;
        }
        studentCode = await allocateStudentCode(client, input.fullName);
      }
    }
    throw new Error("duplicate");
  });
}
