"use client";

import { PriceText, PriceToggle } from "@/components/admin/PriceVisibility";
import { generateWAECCardsPDF } from "@/components/GenerateWAEC";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WAEC_EXAM_ACCOUNT_NAME, WAEC_EXAM_ACCOUNT_NO, WAEC_EXAM_BANK_NAME } from "@/lib/constant";
import type { ResultCard, ResultExam, ResultProduct, ResultWallet } from "@/lib/naija-result";
import { Check, Copy, Download, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const maxQuantity = 100;

const howTo: Record<ResultExam, string> = {
  waec: "Buy the checker, then open the serial number and PIN. On WAEC Direct, enter the examination number, the year, the serial number and the PIN, then submit.",
  neco: "Buy the token, then open the serial number and PIN. On the NECO result portal, enter the examination number, the year, the serial number and the PIN.",
  nabteb: "Buy the checker, then open the serial number and PIN. On the NABTEB result portal, enter the examination number, the year, the serial number and the PIN.",
};

type Purchase = {
  reference: string;
  description: string;
  exam: ResultExam;
  quantity: number;
  amount: string;
  date: string;
  cards: ResultCard[];
};

function naira(value: number) {
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function money(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? naira(amount) : "—";
}

function when(value: string) {
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value || "—";
  const day = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time}`;
}

export default function ExamCardsPage() {
  const [products, setProducts] = useState<ResultProduct[]>([]);
  const [wallet, setWallet] = useState<ResultWallet | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [opened, setOpened] = useState<Purchase | null>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const selected = products.find((product) => product.card_type_id === selectedId) ?? products[0];

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/result-checker");
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.error || "The wallet could not be loaded. You are still signed in.");
        return;
      }
      const nextProducts = Array.isArray(data.products) ? (data.products as ResultProduct[]) : [];
      const nextPurchases = Array.isArray(data.transactions) ? (data.transactions as Purchase[]) : [];
      setProducts(nextProducts);
      setPurchases(nextPurchases);
      setWallet(data.wallet ?? null);
      setSelectedId((current) => (nextProducts.some((product) => product.card_type_id === current) ? current : nextProducts[0]?.card_type_id ?? ""));
      setNotice("");
    } catch {
      setNotice("The wallet could not be loaded. You are still signed in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return purchases;
    return purchases.filter(
      (purchase) =>
        purchase.reference.toLowerCase().includes(needle) ||
        purchase.description.toLowerCase().includes(needle) ||
        purchase.cards.some((card) => card.serial_no.toLowerCase().includes(needle) || card.pin.includes(needle)),
    );
  }, [purchases, query]);

  const askPurchase = () => {
    if (!selected) {
      toast.error("Choose a result checker.");
      return;
    }
    if (!selected.in_stock) {
      toast.error(`${selected.label} is out of stock.`);
      return;
    }
    setConfirming(true);
  };

  const purchase = async () => {
    if (!selected || buying) return;
    setBuying(true);
    try {
      const response = await fetch("/api/admin/result-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_type_id: selected.card_type_id, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "The purchase did not go through.");
        setNotice(data.error || "The purchase did not go through. You are still signed in.");
        return;
      }
      const bought: Purchase = {
        reference: data.reference ?? "",
        description: data.card_name || `${data.label} Result Checker`,
        exam: data.exam,
        quantity: Number(data.quantity) || quantity,
        amount: String(data.amount ?? selected.unit_amount * quantity),
        date: data.transaction_date || new Date().toISOString(),
        cards: Array.isArray(data.cards) ? data.cards : [],
      };
      setPurchases((current) => [bought, ...current]);
      setConfirming(false);
      setOpened(bought);
      if (data.new_balance) setWallet((current) => ({ firstname: current?.firstname ?? "", lastname: current?.lastname ?? "", wallet_balance: String(data.new_balance) }));
      toast.success(data.message || `${bought.quantity} ${selected.label} checker${bought.quantity === 1 ? "" : "s"} purchased.`);
      setNotice("");
    } catch {
      setNotice("The purchase did not go through. You are still signed in.");
    } finally {
      setBuying(false);
    }
  };

  const downloadCard = async (item: Purchase) => {
    try {
      await generateWAECCardsPDF(
        item.cards.map((card) => ({ serialNumber: card.serial_no, pin: card.pin })),
        item.reference,
      );
    } catch {
      toast.error("The card could not be downloaded.");
    }
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(WAEC_EXAM_ACCOUNT_NO);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("The account number could not be copied.");
    }
  };

  const holder = [wallet?.firstname, wallet?.lastname].filter(Boolean).join(" ");
  const amount = selected ? selected.unit_amount * quantity : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.3fr]">
        <section className="rounded-2xl bg-ink p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Wallet</p>
              <PriceToggle tone="paper" />
            </div>
            <button type="button" onClick={() => void load()} className="text-xs font-semibold text-white/80 underline-offset-2 hover:underline" disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <p className="mt-4 font-admin text-4xl font-medium tracking-tight">
            <PriceText value={wallet ? money(wallet.wallet_balance) : loading ? "…" : "—"} />
          </p>
          <p className="mt-2 text-sm font-medium text-white/75">{holder || "Naija Result wallet"}</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copy">Automated bank transfer</p>
          <h1 className="mt-2 font-admin text-2xl font-medium text-ink">Fund your wallet</h1>
          <p className="mt-2 text-sm font-medium leading-6 text-copy">
            Transfer to this virtual account and the wallet updates. Save it as a beneficiary so you can send money to it at any time.
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold text-copy">Bank</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{WAEC_EXAM_BANK_NAME}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-copy">Account name</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{WAEC_EXAM_ACCOUNT_NAME}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-copy">Account number</dt>
              <dd className="mt-1 flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wide text-ink">{WAEC_EXAM_ACCOUNT_NO}</span>
                <button type="button" onClick={() => void copyAccount()} className="grid size-7 place-items-center rounded-md border border-line text-ink" aria-label="Copy account number">
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs font-medium leading-5 text-copy">
            Virtual account deposit attracts a transaction fee of 1% capped at <PriceText value="₦300" />.
          </p>
        </section>
      </div>

      <section className="mt-4 max-w-xl rounded-2xl border border-line bg-white p-5">
          <h2 className="font-admin text-2xl font-medium text-ink">Result checker</h2>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {products.map((product) => {
              const active = product.card_type_id === selected?.card_type_id;
              return (
                <button
                  key={product.card_type_id}
                  type="button"
                  onClick={() => setSelectedId(product.card_type_id)}
                  className={`rounded-xl px-3 py-3 text-left ${active ? "bg-ink text-white" : "border border-line text-ink"}`}
                >
                  <span className="block text-sm font-semibold">{product.label}</span>
                  <span className={`mt-1 block text-xs font-medium ${active ? "text-white/75" : "text-copy"}`}>
                    <PriceText value={money(product.unit_amount)} />
                  </span>
                </button>
              );
            })}
            {!loading && products.length === 0 && <p className="col-span-3 text-sm font-medium text-copy">WAEC, NECO, and NABTEB are not listed right now.</p>}
          </div>
          {selected && (
            <p className="mt-3 text-xs font-medium text-copy">
              {selected.card_name} · {selected.in_stock ? "In stock" : selected.availability || "Out of stock"}
            </p>
          )}
          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">Quantity</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-lg bg-[#E5231B] text-white disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1 || buying}
                aria-label="Reduce quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold text-ink">{quantity}</span>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-lg bg-[#1F9D55] text-white disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                disabled={quantity >= maxQuantity || buying}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-xs font-medium text-copy">1 unit · max {maxQuantity}</p>
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">Amount</p>
            <p className="mt-2 rounded-lg bg-[#F4F5F7] px-4 py-3 text-sm font-semibold text-ink">
              <PriceText value={selected ? naira(amount) : "—"} />
            </p>
          </div>
          <button
            type="button"
            onClick={askPurchase}
            disabled={buying || loading || !selected || !selected.in_stock}
            aria-busy={buying}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-ink py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {buying && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
            {buying ? "Proceeding…" : "Proceed"}
          </button>
        </section>

        <Dialog open={confirming} onOpenChange={(open) => { if (!buying) setConfirming(open); }}>
          <DialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-admin text-2xl font-medium text-ink">Confirm this purchase</DialogTitle>
              <p className="font-admin text-3xl font-bold tracking-tight text-ink">{selected?.label ?? "Result checker"}</p>
              <DialogDescription className="text-left text-sm font-medium leading-6 text-copy">
                You are about to purchase {quantity} <span className="font-bold text-ink">{selected?.label ?? "result"}</span> checker{quantity === 1 ? "" : "s"}
                {selected ? ` for ${naira(amount)}` : ""}. The wallet is charged immediately. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="button"
                  disabled={buying}
                  className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96] disabled:opacity-60"
                >
                  Go back
                </button>
              </DialogClose>
              <button
                type="button"
                onClick={() => void purchase()}
                disabled={buying}
                aria-busy={buying}
                className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-60"
              >
                {buying && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
                {buying ? "Purchasing…" : "Yes, purchase"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={opened !== null} onOpenChange={(open) => { if (!open) setOpened(null); }}>
          <DialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-admin text-2xl font-medium text-ink">How to use it</DialogTitle>
              <DialogDescription className="text-left text-sm font-medium leading-6 text-copy">
                {opened ? howTo[opened.exam] : ""}
              </DialogDescription>
            </DialogHeader>
            {opened && (
              <div className="rounded-xl bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-copy">{opened.description}</p>
                {opened.reference && <p className="mt-2 text-xs font-medium text-copy">{opened.reference}</p>}
                <ul className="mt-3 space-y-3">
                  {opened.cards.map((card) => (
                    <li key={`${card.serial_no}-${card.pin}`}>
                      <p className="text-sm font-semibold text-ink">Serial {card.serial_no}</p>
                      <p className="mt-1 text-sm font-semibold text-ink">PIN {card.pin}</p>
                    </li>
                  ))}
                </ul>
                {opened.exam === "waec" && opened.cards.length > 0 && (
                  <button
                  type="button"
                  onClick={() => void downloadCard(opened)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3 ps-3.5 pe-4 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96]"
                >
                  <Download className="size-4" strokeWidth={2} aria-hidden />
                  Download card
                </button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-admin text-3xl font-medium text-ink">Transactions</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reference..."
            className="w-full max-w-xs rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink outline-none focus:border-ink sm:w-64"
          />
        </div>
        <p className="mt-2 text-xs font-medium text-copy">Saved purchases stay here after you leave the page.</p>
        {notice && <p className="mt-4 text-sm font-semibold text-copy">{notice}</p>}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs font-semibold text-copy">
              <tr className="border-b border-line">
                {["#", "Description", "Qty", "Amount", "Reference", "Date", "Action"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm font-medium text-copy">
                    No transactions yet.
                  </td>
                </tr>
              )}
              {rows.map((item, index) => (
                <tr key={`${item.reference}-${index}`} className="border-b border-line last:border-0 odd:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-medium text-copy">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{item.description}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <PriceText value={money(item.amount)} />
                  </td>
                  <td className="px-4 py-3 text-copy">{item.reference || "—"}</td>
                  <td className="px-4 py-3 text-copy">{when(item.date)}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setOpened(item)} className="rounded-md border border-ink px-3 py-1 text-xs font-semibold text-ink">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
