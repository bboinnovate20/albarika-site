import { getVerificationPdf, listVerifications, saveVerification } from "@/lib/repo/verifications";
import { requestVerification, VerifyError } from "@/lib/verify-platform";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

function fail(error: unknown) {
  if (error instanceof VerifyError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("verification failed", error instanceof Error ? error.name : "unknown");
  return NextResponse.json({ error: "The verification desk could not be reached." }, { status: 502 });
}

export async function GET(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  try {
    const transactions = await listVerifications().catch(() => []);
    return NextResponse.json({ transactions });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "The request was empty." }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (input.consent !== true) {
    return NextResponse.json({ error: "Confirm the consent statement before submitting." }, { status: 400 });
  }
  try {
    const result = await requestVerification({
      serviceId: String(input.serviceId ?? ""),
      nin: String(input.nin ?? ""),
      phone: String(input.phone ?? ""),
      bvn: String(input.bvn ?? ""),
      firstname: String(input.firstname ?? ""),
      lastname: String(input.lastname ?? ""),
      dob: String(input.dob ?? ""),
      gender: String(input.gender ?? ""),
    });
    let id = "";
    let stored = true;
    try {
      id = await saveVerification(result);
    } catch (error) {
      stored = false;
      console.error("verification save failed", error instanceof Error ? error.name : "unknown");
    }
    return NextResponse.json({
      transaction: {
        id,
        kind: result.kind,
        service: result.service,
        slip: result.slip,
        description: result.description,
        amount: result.amount,
        status: "completed",
        message: result.message,
        date: new Date().toISOString(),
        person: result.person,
        stored,
      },
      pdfBase64: stored ? "" : result.pdfBase64,
    });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = body && typeof body === "object" ? String((body as { id?: unknown }).id ?? "") : "";
  if (!id) return NextResponse.json({ error: "Choose a transaction." }, { status: 400 });
  try {
    const slip = await getVerificationPdf(id);
    if (!slip) return NextResponse.json({ error: "That slip is no longer on the desk." }, { status: 404 });
    return NextResponse.json({ pdfBase64: slip.pdfBase64, description: slip.description });
  } catch (error) {
    return fail(error);
  }
}
