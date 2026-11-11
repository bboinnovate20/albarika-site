"use client";

import { PriceText, PriceToggle } from "@/components/admin/PriceVisibility";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VERIFY_PLATFORM_ACCOUNTS } from "@/lib/constant";
import { verificationServices, type VerificationKind, type VerificationPerson } from "@/lib/verification-catalog";
import { Check, ChevronDown, Copy, Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

type Transaction = {
  id: string;
  kind: VerificationKind;
  service: string;
  slip: string;
  description: string;
  amount: string;
  status: string;
  message: string;
  date: string;
  person: VerificationPerson;
  stored?: boolean;
};

const steps = [
  "Select a verification service.",
  "Select the preferred slip format.",
  "Fill the required fields exactly.",
  "Read the consent statement and confirm it.",
  "Track the status from your transactions below.",
];

const consent = [
  "I am the legal owner of the data being accessed, or I have explicit authorisation from the owner.",
  "I accept full liability for accessing this information.",
  "Accessing someone else's details without their authorisation violates their rights. I am responsible for checking and verifying what I receive.",
];

const controlClass =
  "w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink transition-[border-color,outline-color] duration-150 ease-out hover:border-ink/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function personName(person: VerificationPerson) {
  const parts = [person["First name"], person["Middle name"], person["Last name"]].filter(Boolean).join(" ");
  return parts || person.Name || "";
}

function slipFileName(person: VerificationPerson, kind: string) {
  const name = personName(person).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  return `${name || kind}-${kind}-verification`;
}

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function slipFile(base64: string) {
  const file = base64.trim().replace(/^data:[^;]+;base64,/, "").replace(/\s/g, "");
  const type = file.startsWith("/9j/") ? "image/jpeg" : file.startsWith("iVBOR") ? "image/png" : file.startsWith("R0lGOD") ? "image/gif" : "application/pdf";
  const extension = type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : type === "image/gif" ? "gif" : "pdf";
  return { file, type, extension };
}

function downloadSlip(base64: string, name: string) {
  const { file, type, extension } = slipFile(base64);
  const bytes = Uint8Array.from(atob(file), (char) => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name.endsWith(`.${extension}`) ? name : `${name}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function VerificationPage() {
  const [kind, setKind] = useState<VerificationKind>("nin");
  const [serviceId, setServiceId] = useState("nin-regular");
  const [nin, setNin] = useState("");
  const [phone, setPhone] = useState("");
  const [bvn, setBvn] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState("");
  const [opened, setOpened] = useState<Transaction | null>(null);
  const [slipPdf, setSlipPdf] = useState("");
  const [slipLoading, setSlipLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [previewBroken, setPreviewBroken] = useState(false);
  const slipRequest = useRef(0);

  const services = verificationServices.filter((service) => service.kind === kind);
  const selected = services.find((service) => service.id === serviceId) ?? null;
  const ready = kind === "bvn" ? Boolean(selected) : true;

  useEffect(() => {
    if (!slipPdf) {
      setPreviewUrl("");
      setPreviewType("");
      setPreviewBroken(false);
      return;
    }
    const { file, type } = slipFile(slipPdf);
    try {
      const bytes = Uint8Array.from(atob(file), (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type }));
      setPreviewUrl(url);
      setPreviewType(type);
      setPreviewBroken(false);
      return () => URL.revokeObjectURL(url);
    } catch {
      setPreviewUrl("");
      setPreviewType("");
      setPreviewBroken(true);
    }
  }, [slipPdf]);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/verification")
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || "The transaction list could not be loaded.");
        if (live) setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
      })
      .catch((error: Error) => toast.error(error.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return transactions.filter((item) => {
      if (item.kind !== kind) return false;
      if (!needle) return true;
      const name = personName(item.person);
      return `${name} ${item.service} ${item.description} ${item.slip}`.toLowerCase().includes(needle);
    });
  }, [transactions, kind, query]);

  const switchKind = (next: VerificationKind) => {
    setKind(next);
    setServiceId(next === "nin" ? "nin-regular" : "");
    setAgreed(false);
    setQuery("");
  };

  const copyAccount = async (number: string) => {
    await navigator.clipboard.writeText(number);
    setCopied(number);
    window.setTimeout(() => setCopied(""), 1500);
  };

  const openSlip = async (item: Transaction, pdf = "") => {
    const ticket = ++slipRequest.current;
    setOpened(item);
    setSlipPdf(pdf);
    setPreviewBroken(false);
    if (pdf || !item.id) {
      setSlipLoading(false);
      return;
    }
    setSlipLoading(true);
    try {
      const response = await fetch("/api/admin/verification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await response.json().catch(() => null);
      if (slipRequest.current !== ticket) return;
      if (!response.ok) {
        toast.error(data?.error || "The slip could not be opened.");
        return;
      }
      setSlipPdf(typeof data?.pdfBase64 === "string" ? data.pdfBase64 : "");
    } catch {
      if (slipRequest.current === ticket) toast.error("The slip could not be opened.");
    } finally {
      if (slipRequest.current === ticket) setSlipLoading(false);
    }
  };

  const slipName = selected ? selected.slipLabel.replace(/slip$/i, "Slip") : "";
  const purchaseSubject = !selected
    ? ""
    : selected.fields.includes("phone")
      ? "a phone number"
      : selected.fields.includes("bvn")
        ? "a BVN"
        : selected.fields.includes("demographic")
          ? "demographic details"
          : "a NIN";

  const ask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) {
      toast.error("Select a verification service to continue.");
      return;
    }
    if (!agreed) {
      toast.error("Confirm the consent statement before submitting.");
      return;
    }
    setConfirming(true);
  };

  const submit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selected.id, nin, phone, bvn, firstname, lastname, dob, gender, consent: true }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "The verification request was not completed.");
      const transaction = data?.transaction as Transaction | undefined;
      if (!transaction) throw new Error("The slip came back without a record.");
      if (transaction.stored !== false && transaction.id) {
        setTransactions((current) => [transaction, ...current.filter((item) => item.id !== transaction.id)]);
      }
      toast.success(transaction.stored === false ? "Slip generated. It could not be saved to the desk list." : "Verification completed.");
      setConfirming(false);
      await openSlip(transaction, typeof data?.pdfBase64 === "string" ? data.pdfBase64 : "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The verification request was not completed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-admin text-4xl font-medium tracking-tight text-ink">Identity verification</h1>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-copy">
        NIN and BVN slips for a person at the desk. Each request is billed on the Verify Platform wallet as soon as it is submitted.
      </p>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copy">Virtual accounts</p>
        <h2 className="mt-2 font-admin text-2xl font-medium text-ink">Fund the verification wallet</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-copy">Transfer to either account. The money is added to the wallet automatically.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {VERIFY_PLATFORM_ACCOUNTS.map((account) => (
            <div key={account.number} className="rounded-xl border border-line px-4 py-3">
              <p className="text-xs font-semibold text-copy">{account.bank}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{account.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wide text-ink">{account.number}</span>
                <button
                  type="button"
                  onClick={() => void copyAccount(account.number)}
                  className="grid size-7 place-items-center rounded-md border border-line text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96]"
                  aria-label={`Copy ${account.bank} account number`}
                >
                  {copied === account.number ? <Check className="size-3.5" strokeWidth={2} /> : <Copy className="size-3.5" strokeWidth={2} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <form onSubmit={ask} className="rounded-2xl border border-line bg-white p-5">
          <div className="grid grid-cols-2 gap-2">
            {(["nin", "bvn"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => switchKind(item)}
                className={`rounded-lg py-2.5 text-sm font-semibold transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96] ${kind === item ? "bg-ink text-white" : "border border-line text-ink"}`}
              >
                {item === "nin" ? "NIN verification" : "BVN verification"}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-xs font-semibold text-copy" htmlFor="verification-service">
            Verification service
          </label>
          <div className="relative mt-1.5">
            <select
              id="verification-service"
              value={serviceId}
              onChange={(event) => {
                setServiceId(event.target.value);
                setAgreed(false);
              }}
              className={`${controlClass} pe-10`}
            >
              {kind === "bvn" && <option value="">Select verification service</option>}
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.label} ({service.slipLabel})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-ink" strokeWidth={2} />
          </div>

          {!ready && <p className="mt-4 rounded-lg bg-[#E7F1FF] px-3 py-2.5 text-sm font-medium text-[#1d4f91]">Select a verification service to continue.</p>}

          {ready && selected && (
            <>
              <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink">Document verification · {selected.slipLabel}</p>
              {selected.fields.includes("nin") && (
                <Field label="NIN number" value={nin} onChange={setNin} placeholder="11 digits" inputMode="numeric" />
              )}
              {selected.fields.includes("phone") && (
                <Field label="Phone number" value={phone} onChange={setPhone} placeholder="080…" inputMode="numeric" />
              )}
              {selected.fields.includes("bvn") && (
                <Field label="BVN number" value={bvn} onChange={setBvn} placeholder="11 digits" inputMode="numeric" />
              )}
              {selected.fields.includes("demographic") && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="First name" value={firstname} onChange={setFirstname} bare />
                  <Field label="Last name" value={lastname} onChange={setLastname} bare />
                  <Field label="Date of birth" value={dob} onChange={setDob} type="date" bare />
                  <label className="block text-xs font-semibold text-copy">
                    Gender
                    <div className="relative mt-1.5">
                      <select value={gender} onChange={(event) => setGender(event.target.value)} className={`${controlClass} pe-10`}>
                        <option value="">Optional</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-ink" strokeWidth={2} />
                    </div>
                  </label>
                </div>
              )}

              <fieldset className="mt-4 rounded-xl border border-[#F4E3A0] bg-[#FFF8E6] px-4 py-3">
                <legend className="px-1 text-xs font-semibold text-ink">Consent required</legend>
                <p className="text-sm font-medium text-ink">To proceed with this service, confirm that:</p>
                <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-sm font-medium leading-5 text-copy">
                  {consent.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
                <label className="mt-3 flex items-start gap-2 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-0.5 size-4 accent-ink"
                  />
                  I have read and agree to the above statement
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={submitting || !agreed}
                aria-busy={submitting}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-ink py-3 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-60"
              >
                {submitting && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
                {submitting ? "Submitting…" : "Submit request"}
              </button>
            </>
          )}
        </form>

        <aside className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-admin text-2xl font-medium text-ink">How to use</h2>
          <ol className="mt-4 list-decimal space-y-2 ps-4 text-sm font-medium leading-6 text-copy">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-4 rounded-lg bg-[#FFF8E6] px-3 py-2.5 text-sm font-semibold text-ink">
            Important: verification requests are billed immediately after submission.
          </p>
        </aside>
      </div>

      <section className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 font-admin text-2xl font-medium text-ink">
            Verification transactions
            <PriceToggle />
          </h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name…"
            className={`${controlClass} w-full sm:w-64`}
            aria-label="Search by name"
          />
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-[0.08em] text-copy">
              <tr className="border-b border-line">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item, index) => (
                <tr key={item.id || `${item.description}-${index}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-copy">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">{personName(item.person) || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{item.service}</td>
                  <td className="px-4 py-3 font-medium text-copy">{item.description}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    <PriceText value={item.amount || "—"} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === "completed" ? "bg-[#DDF5E5] text-[#0E7A3D]" : "bg-paper text-copy"}`}>
                      {item.status === "completed" ? "Completed" : item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-copy">{when(item.date)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void openSlip(item)}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-sm font-medium text-copy">
                    No {kind.toUpperCase()} verifications yet. Saved requests stay here after you leave the page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={confirming} onOpenChange={(open) => { if (!submitting) setConfirming(open); }}>
        <DialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-admin text-2xl font-medium text-ink">Confirm this purchase</DialogTitle>
            <p className="font-admin text-3xl font-bold tracking-tight text-ink">{slipName}</p>
            <DialogDescription className="text-left text-sm font-medium leading-6 text-copy">
              You are about to purchase a <span className="font-bold text-ink">{slipName}</span>
              {purchaseSubject ? ` for ${purchaseSubject}` : ""}. The wallet is charged immediately. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96] disabled:opacity-60"
              >
                Go back
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-60"
            >
              {submitting && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
              {submitting ? "Submitting…" : "Yes, purchase"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={opened !== null}
        onOpenChange={(open) => {
          if (!open) {
            slipRequest.current += 1;
            setOpened(null);
            setSlipPdf("");
            setSlipLoading(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pe-8">
              <DialogTitle className="text-left">{personName(opened?.person ?? {}) || opened?.service || "Verification"}</DialogTitle>
              {slipPdf && (
                <button
                  type="button"
                  onClick={() => downloadSlip(slipPdf, slipFileName(opened?.person ?? {}, opened?.kind ?? "slip"))}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96]"
                >
                  <Download className="size-4" strokeWidth={2} />
                  Download slip
                </button>
              )}
            </div>
            <DialogDescription className="text-left">{opened?.description}</DialogDescription>
          </DialogHeader>
          {previewUrl && previewType === "application/pdf" && (
            <iframe title="Verification slip" src={previewUrl} className="h-[68vh] w-full rounded-lg border border-line" />
          )}
          {previewUrl && previewType.startsWith("image/") && (
            <img src={previewUrl} alt="Verification slip" className="max-h-[68vh] w-full rounded-lg border border-line object-contain" />
          )}
          {opened && !previewUrl && !previewBroken && (slipLoading || Boolean(slipPdf)) && (
            <div role="status" aria-live="polite" className="flex h-[68vh] items-center justify-center rounded-lg border border-line bg-canvas">
              <span className="size-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink motion-reduce:animate-none" aria-hidden />
              <span className="sr-only">Loading slip</span>
            </div>
          )}
          <dl className="grid gap-2 text-sm">
            {Object.entries(opened?.person ?? {}).map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <dt className="font-medium text-copy">{label}</dt>
                <dd className="text-right font-semibold text-ink">{value}</dd>
              </div>
            ))}
            {opened && !slipLoading && !slipPdf && Object.keys(opened.person).length === 0 && (
              <p className="text-sm font-medium leading-6 text-copy">
                {opened.message ? `${opened.message.replace(/\.?$/, ". ")}` : ""}
                The slip PDF was not in the response that was saved, so this row cannot be opened. The next slip will show here.
              </p>
            )}
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  bare = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "text";
  bare?: boolean;
}) {
  return (
    <label className={`${bare ? "" : "mt-4"} block text-xs font-semibold text-copy`}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        className={`${controlClass} mt-1.5`}
      />
    </label>
  );
}
