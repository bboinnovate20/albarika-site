import { randomUUID } from "crypto";
import { Client } from "pg";
import { connectDsql } from "@/lib/dsql";
import type { ResultCard, ResultExam, ResultPurchase } from "@/lib/naija-result";

async function connect() {
  return connectDsql();
}

let ready: Promise<void> | null = null;

async function ensurePurchases(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS checker_purchases (
      id TEXT PRIMARY KEY,
      reference TEXT NOT NULL,
      description TEXT NOT NULL,
      exam TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      amount TEXT NOT NULL,
      purchased_at TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      cards TEXT NOT NULL
    )
  `);
}

async function withPurchases<T>(run: (client: Client) => Promise<T>) {
  ready ??= (async () => {
    const client = await connect();
    try {
      await ensurePurchases(client);
    } finally {
      await client.end();
    }
  })().catch((error) => {
    ready = null;
    throw error;
  });
  await ready;
  const client = await connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

export type StoredCheckerPurchase = {
  id: string;
  reference: string;
  description: string;
  exam: ResultExam;
  quantity: number;
  amount: string;
  date: string;
  cards: ResultCard[];
};

function cardsOf(value: string): ResultCard[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const card = item as Record<string, unknown>;
      const pin = String(card.pin ?? "");
      const serial = String(card.serial_no ?? "");
      return pin && serial ? [{ pin, serial_no: serial }] : [];
    });
  } catch {
    return [];
  }
}

export async function saveCheckerPurchase(purchase: ResultPurchase) {
  const id = randomUUID();
  await withPurchases((client) =>
    client.query(
      `INSERT INTO checker_purchases (id, reference, description, exam, quantity, amount, purchased_at, created_at, cards)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        id,
        purchase.reference,
        purchase.card_name,
        purchase.exam,
        purchase.quantity,
        purchase.amount,
        purchase.transaction_date,
        new Date().toISOString(),
        JSON.stringify(purchase.cards),
      ],
    ),
  );
  return id;
}

export async function listCheckerPurchases(): Promise<StoredCheckerPurchase[]> {
  const result = await withPurchases((client) =>
    client.query<{
      id: string;
      reference: string;
      description: string;
      exam: string;
      quantity: number;
      amount: string;
      purchased_at: string;
      cards: string;
    }>(
      `SELECT id, reference, description, exam, quantity, amount, purchased_at, cards
       FROM checker_purchases
       ORDER BY created_at DESC`,
    ),
  );
  return result.rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    description: row.description,
    exam: row.exam as ResultExam,
    quantity: row.quantity,
    amount: row.amount,
    date: row.purchased_at,
    cards: cardsOf(row.cards),
  }));
}
