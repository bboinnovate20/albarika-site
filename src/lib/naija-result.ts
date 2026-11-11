function baseUrl() {
  const value = process.env.NAIJA_RESULT_BASE_URL ?? "https://www.naijaresultpins.com/api/v1";
  return value.replace(/\/$/, "");
}

const offered = [
  { exam: "waec", label: "WAEC", match: /waec/i },
  { exam: "neco", label: "NECO", match: /neco/i },
  { exam: "nabteb", label: "NABTEB", match: /nabteb/i },
] as const;

export type ResultExam = (typeof offered)[number]["exam"];

export type ResultProduct = {
  card_type_id: string;
  card_name: string;
  unit_amount: number;
  availability: string;
  in_stock: boolean;
  exam: ResultExam;
  label: string;
};

export type ResultWallet = {
  firstname: string;
  lastname: string;
  wallet_balance: string;
};

export type ResultCard = {
  pin: string;
  serial_no: string;
};

export type ResultPurchase = {
  message: string;
  reference: string;
  quantity: number;
  amount: string;
  new_balance: string;
  transaction_date: string;
  exam: ResultExam;
  label: string;
  card_name: string;
  cards: ResultCard[];
};

export class NaijaError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "NaijaError";
    this.status = status;
    this.code = code;
  }
}

function messageOf(body: unknown) {
  if (!body || typeof body !== "object" || !("message" in body)) return "";
  const message = (body as { message?: unknown }).message;
  return typeof message === "string" ? message : "";
}

function codeOf(body: unknown) {
  if (!body || typeof body !== "object" || !("code" in body)) return undefined;
  const code = (body as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

async function call(path: string, init?: RequestInit) {
  const token = process.env.NAIJA_RESULT_API_KEY;
  if (!token) throw new NaijaError("The result checker is not connected yet.", 503);

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new NaijaError("Naija Result did not respond.", 504);
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (response.status === 401) throw new NaijaError("Naija Result rejected the desk key.", 502);
  if (!response.ok) {
    throw new NaijaError(messageOf(body) || "Naija Result could not complete that.", response.status >= 500 ? 502 : 400, codeOf(body));
  }
  if (body && typeof body === "object" && "status" in body && (body as { status?: unknown }).status === false) {
    throw new NaijaError(messageOf(body) || "Naija Result could not complete that.", 400, codeOf(body));
  }
  return body;
}

function parseProduct(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const cardTypeId = String(row.card_type_id ?? "");
  const cardName = String(row.card_name ?? "");
  const unit = Number(row.unit_amount);
  const availability = String(row.availability ?? "");
  if (!cardTypeId || !cardName || !Number.isFinite(unit)) return null;
  return { card_type_id: cardTypeId, card_name: cardName, unit_amount: unit, availability, in_stock: /in stock/i.test(availability) };
}

export async function listOfferedProducts() {
  const body = await call("");
  if (!Array.isArray(body)) throw new NaijaError("The product list did not come back.", 502);
  const products = body.flatMap((item) => {
    const product = parseProduct(item);
    return product ? [product] : [];
  });

  return offered.flatMap((offer) => {
    const match = products.find((product) => offer.match.test(product.card_name));
    return match ? [{ ...match, exam: offer.exam, label: offer.label }] : [];
  });
}

export async function walletBalance(): Promise<ResultWallet> {
  const body = await call("/account");
  const row = Array.isArray(body) ? body[0] : body;
  if (!row || typeof row !== "object") throw new NaijaError("The wallet balance did not come back.", 502);
  const account = row as Record<string, unknown>;
  return {
    firstname: String(account.firstname ?? ""),
    lastname: String(account.lastname ?? ""),
    wallet_balance: String(account.wallet_balance ?? ""),
  };
}

export async function buyResultCard(cardTypeId: string, quantity: number): Promise<ResultPurchase> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new NaijaError("Buy between 1 and 100 cards at a time.", 400, "012");
  }
  const products = await listOfferedProducts();
  const product = products.find((item) => item.card_type_id === cardTypeId);
  if (!product) throw new NaijaError("Choose WAEC, NECO, or NABTEB.", 400);
  if (!product.in_stock) throw new NaijaError(`${product.label} is out of stock.`, 400, "011");

  const body = await call("/exam-card/buy", {
    method: "POST",
    body: JSON.stringify({ card_type_id: cardTypeId, quantity: String(quantity) }),
  });
  if (!body || typeof body !== "object") throw new NaijaError("The purchase did not come back.", 502);
  const purchase = body as Record<string, unknown>;
  const cards = Array.isArray(purchase.cards)
    ? purchase.cards.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const card = item as Record<string, unknown>;
        const pin = String(card.pin ?? "");
        const serial = String(card.serial_no ?? "");
        return pin && serial ? [{ pin, serial_no: serial }] : [];
      })
    : [];

  return {
    message: String(purchase.message ?? `${product.label} checker purchased.`),
    reference: String(purchase.reference ?? ""),
    quantity: Number(purchase.quantity ?? quantity) || quantity,
    amount: String(purchase.amount ?? product.unit_amount * quantity),
    new_balance: String(purchase.new_balance ?? ""),
    transaction_date: String(purchase.transaction_date ?? new Date().toISOString()),
    exam: product.exam,
    label: product.label,
    card_name: product.card_name,
    cards,
  };
}
