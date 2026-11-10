import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { Client } from "pg";

const region = process.env.AWS_REGION ?? "us-east-1";

function endpoint() {
  const host = process.env.DSQL_ENDPOINT;
  if (!host) throw new Error("Missing DSQL_ENDPOINT");
  return host;
}

async function connect() {
  const host = endpoint();
  const signer = new DsqlSigner({ hostname: host, region });
  const token = await signer.getDbConnectAdminAuthToken();
  const client = new Client({
    host,
    port: 5432,
    user: "admin",
    password: token,
    database: "postgres",
    ssl: { rejectUnauthorized: true },
  });
  await client.connect();
  return client;
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
  })();
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
