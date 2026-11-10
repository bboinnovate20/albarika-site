import { LocalStorage } from "node-localstorage";
import { tmpdir } from "os";
import path from "path";

/**
 * Server-side localStorage shim for Node.
 * On Vercel/Lambda the deploy root (/var/task) is read-only; use /tmp instead.
 */
if (typeof globalThis.localStorage === "undefined") {
  const root =
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? path.join(tmpdir(), "albarika-scratch")
      : path.join(process.cwd(), "scratch");
  globalThis.localStorage = new LocalStorage(root);
}
