import { execFile } from "node:child_process";
import { lookup } from "dns/promises";
import { Client } from "pg";
import { checkServerIdentity } from "tls";
import { DsqlSigner } from "@aws-sdk/dsql-signer";

const region = process.env.AWS_REGION ?? "us-east-1";

type LoginCredentials = { accessKeyId: string; secretAccessKey: string; sessionToken?: string };

let cachedLogin: { credentials: LoginCredentials; expiresAt: number } | null = null;

export function loginCredentials() {
  if (cachedLogin && cachedLogin.expiresAt - Date.now() > 60_000) return Promise.resolve(cachedLogin.credentials);
  return new Promise<LoginCredentials>((resolve, reject) => {
    execFile("aws", ["configure", "export-credentials", "--format", "process"], { timeout: 20000 }, (error, stdout, stderr) => {
      if (error) {
        const detail = `${stderr || ""}`.split("\n").map((line) => line.trim()).find(Boolean) ?? "AWS login is not available";
        const safe = /AKIA|secret|token/i.test(detail) ? "AWS login is not available" : detail.slice(0, 180);
        reject(new Error(safe));
        return;
      }
      let parsed: { AccessKeyId?: string; SecretAccessKey?: string; SessionToken?: string; Expiration?: string };
      try {
        parsed = JSON.parse(stdout);
      } catch {
        reject(new Error("AWS login is not available"));
        return;
      }
      if (!parsed.AccessKeyId || !parsed.SecretAccessKey) {
        reject(new Error("AWS login is not available"));
        return;
      }
      const credentials = {
        accessKeyId: parsed.AccessKeyId,
        secretAccessKey: parsed.SecretAccessKey,
        sessionToken: parsed.SessionToken,
      };
      const expiresAt = parsed.Expiration ? Date.parse(parsed.Expiration) : Date.now() + 10 * 60_000;
      cachedLogin = { credentials, expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + 10 * 60_000 };
      resolve(credentials);
    });
  });
}

function envCredentials() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
  if (!accessKeyId || !secretAccessKey) return undefined;
  const sessionToken = process.env.AWS_SESSION_TOKEN?.trim();
  return { accessKeyId, secretAccessKey, sessionToken: sessionToken || undefined };
}

async function password(host: string) {
  const credentials = envCredentials();
  try {
    return await new DsqlSigner({ hostname: host, region, ...(credentials ? { credentials } : {}) }).getDbConnectAdminAuthToken();
  } catch (error) {
    if (credentials || process.env.VERCEL) throw error;
    try {
      return await new DsqlSigner({ hostname: host, region, credentials: loginCredentials }).getDbConnectAdminAuthToken();
    } catch (cliError) {
      console.error("desk database login failed", cliError instanceof Error ? cliError.message.slice(0, 160) : "unknown");
      throw error;
    }
  }
}

function openClient(connectHost: string, servername: string, token: string) {
  const client = new Client({
    host: connectHost,
    port: 5432,
    user: "admin",
    password: token,
    database: "postgres",
    connectionTimeoutMillis: 12000,
    ssl: {
      rejectUnauthorized: true,
      servername,
      checkServerIdentity: (_hostname, cert) => checkServerIdentity(servername, cert),
    },
  });
  return client.connect().then(
    () => client,
    async (error: unknown) => {
      await client.end().catch(() => undefined);
      throw error;
    },
  );
}

export async function connectDsql() {
  const host = process.env.DSQL_ENDPOINT;
  if (!host) throw new Error("Missing DSQL_ENDPOINT");
  const token = await password(host);
  const targets: string[] = [];
  if (process.env.VERCEL) targets.push(host);
  try {
    const { address } = await lookup(host, { family: 4 });
    if (!targets.includes(address)) targets.push(address);
  } catch (error) {
    console.error("desk database address lookup failed", error instanceof Error ? error.name : "unknown");
  }
  if (!targets.includes(host)) targets.push(host);
  let last: unknown;
  for (const target of targets) {
    try {
      return await openClient(target, host, token);
    } catch (error) {
      last = error;
    }
  }
  throw last;
}
