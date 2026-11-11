import { buyResultCard, listOfferedProducts, NaijaError, walletBalance } from "@/lib/naija-result";
import { listCheckerPurchases, saveCheckerPurchase } from "@/lib/repo/checker-purchases";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
  return !request.cookies.get("auth_token")?.value;
}

function fail(error: unknown) {
  if (error instanceof NaijaError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error("result checker failed", error instanceof Error ? error.name : "unknown");
  return NextResponse.json({ error: "The result checker could not be reached." }, { status: 502 });
}

export async function GET(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  try {
    const [products, wallet, transactions] = await Promise.all([
      listOfferedProducts(),
      walletBalance(),
      listCheckerPurchases().catch(() => [] as Awaited<ReturnType<typeof listCheckerPurchases>>),
    ]);
    return NextResponse.json({ products, wallet, transactions });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  if (unauthorized(request)) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const cardTypeId = body && typeof body === "object" ? String((body as { card_type_id?: unknown }).card_type_id ?? "") : "";
  const quantity = body && typeof body === "object" ? Number((body as { quantity?: unknown }).quantity) : NaN;
  if (!cardTypeId) return NextResponse.json({ error: "Choose a result checker." }, { status: 400 });
  try {
    const purchase = await buyResultCard(cardTypeId, quantity);
    try {
      await saveCheckerPurchase(purchase);
    } catch (error) {
      console.error("checker purchase save failed", error instanceof Error ? error.name : "unknown");
    }
    return NextResponse.json(purchase);
  } catch (error) {
    return fail(error);
  }
}
