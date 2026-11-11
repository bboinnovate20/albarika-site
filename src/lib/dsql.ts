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

async function password(host: string) {
  try {
    return await new DsqlSigner({ hostname: host, region }).getDbConnectAdminAuthToken();
  } catch (error) {
    try {
      return await new DsqlSigner({ hostname: host, region, credentials: cliLoginCredentials }).getDbConnectAdminAuthToken();
    } catch (cliError) {
      console.error("desk database login failed", cliError instanceof Error ? cliError.message.slice(0, 160) : "unknown");
      throw error;
    }
  }
}

export async function connectDsql() {
  const host = process.env.DSQL_ENDPOINT;
  if (!host) throw new Error("Missing DSQL_ENDPOINT");
  const { address } = await lookup(host, { family: 4 });
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const client = new Client({
      host: address,
      port: 5432,
      user: "admin",
      password: await password(host),
      database: "postgres",
      connectionTimeoutMillis: 12000,
      ssl: {
        rejectUnauthorized: true,
        servername: host,
        checkServerIdentity: (_hostname, cert) => checkServerIdentity(host, cert),
      },
    });
    try {
      await client.connect();
      return client;
    } catch (error) {
      last = error;
      await client.end().catch(() => undefined);
    }
  }
  throw last;
}
