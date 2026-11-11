import { randomUUID } from "crypto";
import { Client } from "pg";
import { courses as fallbackCourses, type Course, type CourseOption } from "@/lib/landing";
import { connectDsql } from "@/lib/dsql";

async function connect() {
  return connectDsql();
}

let ready: Promise<void> | null = null;

async function ensureCourses(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    )
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS course_fees (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      months INTEGER NOT NULL,
      fee_naira INTEGER NOT NULL,
      sort_order INTEGER NOT NULL
    )
  `);
  const count = await client.query<{ count: number }>("SELECT COUNT(*)::int AS count FROM courses");
  if (count.rows[0]?.count) return;
  for (const [index, course] of fallbackCourses.entries()) {
    await client.query(
      `INSERT INTO courses (id, slug, title, summary, sort_order) VALUES ($1, $2, $3, $4, $5)`,
      [course.id, course.slug, course.title, course.summary, index + 1],
    );
    for (const [feeIndex, option] of course.options.entries()) {
      await client.query(
        `INSERT INTO course_fees (id, course_id, months, fee_naira, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [`${course.id}-${option.months}`, course.id, option.months, option.feeNaira, feeIndex],
      );
    }
  }
}

async function withCourses<T>(run: (client: Client) => Promise<T>) {
  ready ??= (async () => {
    const client = await connect();
    try {
      await ensureCourses(client);
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

type FeeRow = { id: string; course_id: string; months: number; fee_naira: number };
type CourseRow = { id: string; slug: string; title: string; summary: string; sort_order: number };

function group(rows: CourseRow[], fees: FeeRow[]): Course[] {
  return rows.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    position: course.sort_order,
    options: fees
      .filter((fee) => fee.course_id === course.id)
      .map((fee) => ({ id: fee.id, months: fee.months, feeNaira: fee.fee_naira })),
  }));
}

export type CourseInput = {
  title: string;
  summary: string;
  position: number;
  options: CourseOption[];
};

export async function listCourses() {
  return withCourses(async (client) => {
    const coursesResult = await client.query<CourseRow>(
      `SELECT id, slug, title, summary, sort_order FROM courses ORDER BY sort_order ASC, title ASC`,
    );
    const fees = await client.query<FeeRow>(
      `SELECT id, course_id, months, fee_naira FROM course_fees ORDER BY sort_order ASC, months ASC`,
    );
    return group(coursesResult.rows, fees.rows);
  });
}

export async function publicCourses() {
  try {
    const rows = await listCourses();
    return rows.length ? rows : fallbackCourses;
  } catch (error) {
    console.error("course list failed", error instanceof Error ? error.name : "unknown");
    return fallbackCourses;
  }
}

export async function getCourse(id: string) {
  const rows = await listCourses();
  return rows.find((course) => course.id === id) ?? null;
}

export async function getCourseBySlug(slug: string) {
  const rows = await publicCourses();
  return rows.find((course) => course.slug === slug);
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return base || "course";
}

async function uniqueSlug(client: Client, title: string, currentId?: string) {
  const base = slugify(title);
  const taken = await client.query<{ id: string; slug: string }>(`SELECT id, slug FROM courses`);
  const used = new Set(taken.rows.filter((row) => row.id !== currentId).map((row) => row.slug));
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

async function deleteFees(client: Client, courseId: string) {
  const fees = await client.query<{ id: string }>(`SELECT id FROM course_fees WHERE course_id = $1`, [courseId]);
  for (const fee of fees.rows) {
    await client.query(`DELETE FROM course_fees WHERE id = $1`, [fee.id]);
  }
}

async function replaceFees(client: Client, courseId: string, options: CourseOption[]) {
  await deleteFees(client, courseId);
  for (const [index, option] of options.entries()) {
    await client.query(
      `INSERT INTO course_fees (id, course_id, months, fee_naira, sort_order) VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), courseId, option.months, option.feeNaira, index],
    );
  }
}

export async function createCourse(input: CourseInput) {
  return withCourses(async (client) => {
    const id = randomUUID();
    const slug = await uniqueSlug(client, input.title);
    await client.query(
      `INSERT INTO courses (id, slug, title, summary, sort_order) VALUES ($1, $2, $3, $4, $5)`,
      [id, slug, input.title, input.summary, input.position],
    );
    await replaceFees(client, id, input.options);
    return id;
  });
}

export async function updateCourse(id: string, input: CourseInput) {
  return withCourses(async (client) => {
    const existing = await client.query(`SELECT id FROM courses WHERE id = $1`, [id]);
    if (!existing.rowCount) return false;
    await client.query(`UPDATE courses SET title = $2, summary = $3, sort_order = $4 WHERE id = $1`, [
      id,
      input.title,
      input.summary,
      input.position,
    ]);
    await replaceFees(client, id, input.options);
    return true;
  });
}

export async function deleteCourse(id: string) {
  return withCourses(async (client) => {
    await deleteFees(client, id);
    const result = await client.query(`DELETE FROM courses WHERE id = $1`, [id]);
    return Boolean(result.rowCount);
  });
}
