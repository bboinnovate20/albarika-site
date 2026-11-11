import { personFrom, verificationService, type VerificationKind, type VerificationPerson } from "@/lib/verification-catalog";

export type { VerificationKind, VerificationPerson };

export class VerifyError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "VerifyError";
    this.status = status;
  }
}

export type VerificationResult = {
  description: string;
  service: string;
  slip: string;
  kind: VerificationKind;
  amount: string;
  message: string;
  person: VerificationPerson;
  pdfBase64: string;
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function amountOf(body: Record<string, unknown>) {
  const nested = body.data && typeof body.data === "object" ? (body.data as Record<string, unknown>) : {};
  const raw = body.amount_charged ?? body.amount ?? nested.amount_charged ?? nested.amount ?? "";
  const text = String(raw ?? "").replace(/,/g, "").trim();
  if (!text || text === "undefined") return "";
  return text.startsWith("₦") ? text : `₦${Number.isFinite(Number(text)) ? Number(text).toFixed(2) : text}`;
}

function walk(value: unknown, visit: (key: string, item: unknown) => void, depth = 0) {
  if (!value || typeof value !== "object" || depth > 5) return;
  const entries = Array.isArray(value) ? value.entries() : Object.entries(value as Record<string, unknown>);
  for (const [key, item] of entries) {
    visit(String(key), item);
    if (item && typeof item === "object") walk(item, visit, depth + 1);
  }
}

function compactFile(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^data:[^;]+;base64,/, "").replace(/\s/g, "");
}

export function readSlip(record: unknown) {
  const person = personFrom(record);
  let pdf = "";
  let image = "";
  walk(record, (key, value) => {
    const file = compactFile(value);
    if (file.length < 200) return;
    const namedSlip = /pdf|slip/i.test(key);
    if (file.startsWith("JVBER") || namedSlip) {
      if (!pdf || namedSlip) pdf = file;
      return;
    }
    if ((file.startsWith("/9j/") || file.startsWith("iVBOR") || file.startsWith("R0lGOD") || /image|photo/i.test(key)) && !image) {
      image = file;
    }
  });
  return { person, pdfBase64: pdf || image };
}

function responseShape(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return value.length;
  if (!value || typeof value !== "object" || depth > 2) return typeof value;
  if (Array.isArray(value)) return [`array:${value.length}`];
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, responseShape(item, depth + 1)]));
}

function safeMessage(body: Record<string, unknown>, fallback: string) {
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const key = process.env.VERIFY_PLATFORM_API_KEY ?? "";
  if (!message || (key && message.includes(key))) return fallback;
  return message.slice(0, 240);
}

export async function requestVerification(input: {
  serviceId: string;
  nin?: string;
  phone?: string;
  bvn?: string;
  firstname?: string;
  lastname?: string;
  dob?: string;
  gender?: string;
}): Promise<VerificationResult> {
  const service = verificationService(input.serviceId);
  if (!service) throw new VerifyError("Choose a verification service.");
  const apiKey = process.env.VERIFY_PLATFORM_API_KEY;
  if (!apiKey) throw new VerifyError("Verification is not set up on this desk.", 500);

  const payload: Record<string, string> = { api_key: apiKey };
  if (service.fields.includes("nin")) {
    const nin = digits(input.nin ?? "");
    if (nin.length !== 11) throw new VerifyError("Enter the 11-digit NIN.");
    payload.nin = nin;
  }
  if (service.fields.includes("phone")) {
    const phone = digits(input.phone ?? "");
    if (phone.length !== 11) throw new VerifyError("Enter the 11-digit phone number.");
    payload.nin = phone;
  }
  if (service.fields.includes("bvn")) {
    const bvn = digits(input.bvn ?? "");
    if (bvn.length !== 11) throw new VerifyError("Enter the 11-digit BVN.");
    payload.bvn = bvn;
  }
  if (service.fields.includes("demographic")) {
    const firstname = (input.firstname ?? "").trim();
    const lastname = (input.lastname ?? "").trim();
    const dob = (input.dob ?? "").trim();
    if (firstname.length < 2 || lastname.length < 2) throw new VerifyError("Enter the first and last name.");
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
    if (!match) throw new VerifyError("Enter the date of birth.");
    payload.firstname = firstname;
    payload.lastname = lastname;
    payload.dob = `${match[3]}-${match[2]}-${match[1]}`;
    const gender = (input.gender ?? "").trim().toUpperCase();
    if (gender === "MALE" || gender === "FEMALE") payload.gender = gender;
  }

  let response: Response;
  try {
    response = await fetch(`https://verifyplatform.com/api/verification/${service.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new VerifyError("Verify Platform could not be reached.", 502);
  }

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  const record = body && typeof body === "object" ? body : {};
  const succeeded = String(record.status ?? "").toLowerCase() === "success" || record.success === true;
  if (!response.ok || !succeeded) {
    const fallback =
      response.status === 429
        ? "Too many requests. Wait a moment and try again."
        : response.status === 403
          ? "Verify Platform blocked this request."
          : "The verification request was not completed.";
    throw new VerifyError(safeMessage(record, fallback), response.status === 429 || response.status === 403 ? response.status : 400);
  }

  const slip = readSlip(record);
  console.info("verification slip shape", JSON.stringify(responseShape(record)));
  return {
    description: `${service.label} (${service.slipLabel})`,
    service: service.label,
    slip: service.slipLabel,
    kind: service.kind,
    amount: amountOf(record),
    message: safeMessage(record, "Slip generated."),
    person: Object.keys(slip.person).length ? slip.person : personFrom(record.user_data),
    pdfBase64: slip.pdfBase64,
  };
}
