import { DsqlSigner } from "@aws-sdk/dsql-signer";
import pg from "pg";

const host = process.env.DSQL_ENDPOINT;
const region = process.env.AWS_REGION ?? "us-east-1";
if (!host) {
  console.error("Missing DSQL_ENDPOINT");
  process.exit(1);
}

const signer = new DsqlSigner({ hostname: host, region });
const token = await signer.getDbConnectAdminAuthToken();
const client = new pg.Client({
  host,
  port: 5432,
  user: "admin",
  password: token,
  database: "postgres",
  ssl: { rejectUnauthorized: true },
});

await client.connect();
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
const count = await client.query("SELECT COUNT(*)::int AS count FROM messages");
await client.end();
console.log(`messages table ready, rows=${count.rows[0].count}`);
