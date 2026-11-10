import { randomUUID } from "crypto";
import { withFormDb } from "@/lib/form-db";
import type { MessageInput } from "@/lib/message-schema";

export type StoredMessage = MessageInput & {
  id: string;
  createdAt: string;
  status: string;
  email?: string;
};

export async function saveMessage(input: MessageInput, id = randomUUID()) {
  const createdAt = new Date().toISOString();
  await withFormDb((client) =>
    client.query(
      `INSERT INTO messages (id, created_at, status, full_name, phone, email, topic, body)
       VALUES ($1, $2, 'new', $3, $4, $5, $6, $7)`,
      [id, createdAt, input.fullName, input.phone, input.email || null, input.topic, input.body],
    ),
  );
  return id;
}

export async function listMessages(): Promise<StoredMessage[]> {
  const result = await withFormDb((client) =>
    client.query<{
      id: string;
      created_at: Date;
      status: string;
      full_name: string;
      phone: string;
      email: string | null;
      topic: string;
      body: string;
    }>(`SELECT id, created_at, status, full_name, phone, email, topic, body FROM messages ORDER BY created_at DESC`),
  );
  return result.rows.map((row) => ({
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    status: row.status,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email ?? "",
    topic: row.topic as StoredMessage["topic"],
    body: row.body,
  }));
}
