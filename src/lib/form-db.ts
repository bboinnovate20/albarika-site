import { Client } from "pg";
import { connectDsql } from "@/lib/dsql";

async function connect() {
  return connectDsql();
}

let ready: Promise<void> | null = null;

export function ensureMessagesTable() {
  ready ??= (async () => {
    const client = await connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          topic TEXT NOT NULL,
          body TEXT NOT NULL
        )
      `);
    } finally {
      await client.end();
    }
  })().catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}

export async function withFormDb<T>(run: (client: Client) => Promise<T>) {
  await ensureMessagesTable();
  const client = await connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}
