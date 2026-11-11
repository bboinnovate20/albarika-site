import { randomUUID } from "crypto";
import { Client } from "pg";
import { connectDsql } from "@/lib/dsql";
import { readSlipFile, storeSlip } from "@/lib/slip-store";
import type { VerificationKind, VerificationPerson } from "@/lib/verification-catalog";
import type { VerificationResult } from "@/lib/verify-platform";

let ready: Promise<void> | null = null;

async function ensure(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      service TEXT NOT NULL,
      slip TEXT NOT NULL,
      description TEXT NOT NULL,
      amount TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT NOT NULL,
      person TEXT NOT NULL,
      pdf_base64 TEXT NOT NULL,
      slip_key TEXT,
      created_at TIMESTAMPTZ NOT NULL
    )
  `);
  await client.query(`ALTER TABLE verification_requests ADD COLUMN IF NOT EXISTS slip_key TEXT`);
}

async function withTable<T>(run: (client: Client) => Promise<T>) {
  ready ??= (async () => {
    const client = await connectDsql();
    try {
      await ensure(client);
    } finally {
      await client.end();
    }
  })().catch((error) => {
    ready = null;
    throw error;
  });
  await ready;
  const client = await connectDsql();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

export type StoredVerification = {
  id: string;
  kind: VerificationKind;
  service: string;
  slip: string;
  description: string;
  amount: string;
  status: string;
  message: string;
  date: string;
  person: VerificationPerson;
};

function personOf(value: string): VerificationPerson {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).flatMap(([key, item]) =>
        typeof item === "string" && item.trim() ? [[key, item.trim()]] : [],
      ),
    );
  } catch {
    return {};
  }
}

function rowOf(row: Record<string, unknown>): StoredVerification {
  return {
    id: String(row.id),
    kind: row.kind === "bvn" ? "bvn" : "nin",
    service: String(row.service),
    slip: String(row.slip),
    description: String(row.description),
    amount: String(row.amount ?? ""),
    status: String(row.status),
    message: String(row.message ?? ""),
    date: new Date(String(row.created_at)).toISOString(),
    person: personOf(String(row.person ?? "{}")),
  };
}

export async function saveVerification(result: VerificationResult) {
  const id = randomUUID();
  let slipKey = "";
  if (result.pdfBase64) {
    try {
      slipKey = await storeSlip(id, result.pdfBase64);
    } catch (error) {
      console.error("slip upload failed", error instanceof Error ? error.name : "unknown");
    }
  }
  await withTable((client) =>
    client.query(
      `INSERT INTO verification_requests
        (id, kind, service, slip, description, amount, status, message, person, pdf_base64, slip_key, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed', $7, $8, $9, $10, NOW())`,
      [id, result.kind, result.service, result.slip, result.description, result.amount, result.message, JSON.stringify(result.person), result.pdfBase64, slipKey],
    ),
  );
  return id;
}

export async function listVerifications(): Promise<StoredVerification[]> {
  const result = await withTable((client) =>
    client.query(
      `SELECT id, kind, service, slip, description, amount, status, message, person, created_at
       FROM verification_requests
       ORDER BY created_at DESC`,
    ),
  );
  return result.rows.map((row) => rowOf(row));
}

export async function getVerificationPdf(id: string) {
  const result = await withTable((client) =>
    client.query(`SELECT id, pdf_base64, slip_key, description FROM verification_requests WHERE id = $1`, [id]),
  );
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) return null;
  const slipKey = String(row.slip_key ?? "");
  let pdfBase64 = String(row.pdf_base64 ?? "");
  if (slipKey) {
    try {
      const stored = await readSlipFile(slipKey);
      if (stored) pdfBase64 = stored;
    } catch (error) {
      console.error("slip read failed", error instanceof Error ? error.name : "unknown");
    }
  }
  return {
    id: String(row.id),
    description: String(row.description),
    pdfBase64,
  };
}
