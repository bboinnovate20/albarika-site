"use client";

import { usePricesVisible } from "@/components/admin/PriceVisibility";
import { downloadStudentIdCard, StudentIdCardFaces, type StudentIdCardData } from "@/components/admin/StudentIdCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Course } from "@/lib/landing";
import { paymentStatusLabels, paymentStatuses, registrationStatusLabels, registrationStatuses, type PaymentStatus, type RegistrationStatus } from "@/lib/registration-schema";
import type { StoredRegistration } from "@/lib/repo/registrations";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

const fieldClass = "w-full rounded-[14px] border border-line bg-white px-4 py-3 text-sm font-medium text-ink outline-none focus:border-ink";

function readPhotograph(file: File) {
  const name = file.name.toLowerCase();
  const allowed = file.type === "image/jpeg" || file.type === "image/png" || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
  if (!allowed) return Promise.reject(new Error("Use a JPEG or PNG photograph."));
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 800 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("The photograph could not be read."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The photograph could not be read."));
    };
    image.src = url;
  });
}

export function RegistrationForm({ registration, courses, photograph }: { registration: StoredRegistration; courses: Course[]; photograph: string }) {
  const { visible } = usePricesVisible();
  const [form, setForm] = useState(registration);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [draft, setDraft] = useState({ status: registration.status, payment: registration.payment, amount: "" });
  const [photo, setPhoto] = useState(photograph);
  const [pendingPhoto, setPendingPhoto] = useState("");
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const selected = courses.find((course) => course.id === form.courseId) ?? courses[0];
  const chosenFee = selected?.options.find((option) => option.id === form.feeId) ?? selected?.options.find((option) => option.months === form.months) ?? selected?.options[0];
  const accepted = form.status === "accepted";
  const card: StudentIdCardData = {
    fullName: form.fullName,
    studentCode: form.studentCode.trim(),
    programme: courses.find((course) => course.id === form.courseId)?.title || form.courseTitle,
    months: form.months,
    issued: registration.status === "accepted" ? new Date(registration.updatedAt) : new Date(),
    photo,
  };

  const downloadCard = async () => {
    if (!card.studentCode) {
      toast.error("Save the accepted registration first. The student ID is assigned then.");
      return;
    }
    if (!frontRef.current || !backRef.current) return;
    setDownloading(true);
    try {
      await downloadStudentIdCard(frontRef.current, backRef.current, card.studentCode);
    } catch {
      toast.error("The ID card could not be downloaded.");
    } finally {
      setDownloading(false);
    }
  };

  const set = (key: keyof StoredRegistration, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const openPayment = () => {
    setDraft({
      status: form.status,
      payment: form.payment,
      amount: form.payment === "partial" && form.paidNaira > 0 ? String(form.paidNaira) : "",
    });
    setPaymentOpen(true);
  };

  const patch = async (status: RegistrationStatus, payment: PaymentStatus, paidNaira: number) => {
    const response = await fetch(`/api/admin/registrations/${registration.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        address: form.address,
        courseId: form.courseId,
        feeId: chosenFee?.id ?? "",
        months: Number(form.months),
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        note: form.note,
        status,
        payment,
        paidNaira,
        deskNote: form.deskNote,
        studentCode: form.studentCode,
      }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; studentCode?: string; paidNaira?: number; payment?: PaymentStatus } | null;
    if (!response.ok) throw new Error(data?.error || "The registration could not be saved.");
    setForm((current) => ({
      ...current,
      status,
      studentCode: typeof data?.studentCode === "string" ? data.studentCode : current.studentCode,
      paidNaira: typeof data?.paidNaira === "number" ? data.paidNaira : paidNaira,
      payment: data?.payment ?? payment,
    }));
    return data;
  };

  const uploadPhoto = async (file: string) => {
    const response = await fetch(`/api/admin/registrations/${registration.id}/photo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: file }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; photoKey?: string } | null;
    if (!response.ok || !data?.photoKey) throw new Error(data?.error || "The photograph could not be saved.");
    setForm((current) => ({ ...current, photoKey: data.photoKey ?? current.photoKey }));
    setPendingPhoto("");
  };

  const onPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const next = await readPhotograph(file);
      setPhoto(next);
      setPendingPhoto(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The photograph could not be read.");
    }
  };

  const save = async () => {
    setSaving(true);
    const chosen = pendingPhoto;
    try {
      const data = await patch(form.status, form.payment, form.payment === "paid" ? form.feeNaira : form.paidNaira);
      if (chosen) {
        try {
          await uploadPhoto(chosen);
        } catch (error) {
          toast.success(data?.studentCode ? `Registration updated. Student ID ${data.studentCode}.` : "Registration updated.");
          toast.error(error instanceof Error ? error.message : "The photograph could not be saved.");
          return;
        }
      }
      const saved = data?.studentCode
        ? `Registration updated. Student ID ${data.studentCode}.${chosen ? " Photograph saved." : ""}`
        : chosen
          ? "Registration and photograph updated."
          : "Registration updated.";
      toast.success(saved);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The registration could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const savePayment = async () => {
    const paidNaira = draft.payment === "paid" ? form.feeNaira : draft.payment === "unpaid" ? 0 : Number(draft.amount);
    if (draft.payment === "partial" && (!Number.isInteger(paidNaira) || paidNaira < 1 || paidNaira >= form.feeNaira)) {
      toast.error("Enter an amount paid that is less than the expected amount.");
      return;
    }
    setSavingPayment(true);
    try {
      const data = await patch(draft.status, draft.payment, paidNaira);
      setPaymentOpen(false);
      toast.success(data?.studentCode ? `Payment updated. Student ID ${data.studentCode}.` : "Payment updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The payment could not be saved.");
    } finally {
      setSavingPayment(false);
    }
  };

  const amountShown = draft.payment === "paid" ? String(form.feeNaira) : draft.payment === "unpaid" ? "0" : draft.amount;
  const balance = Math.max(form.feeNaira - Number(amountShown || 0), 0);

  return (
    <>
    <form
      className="mt-6 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <button
        type="button"
        onClick={openPayment}
        className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96]"
      >
        Update payment
      </button>
      <div>
        <span className="text-sm font-bold text-ink">Photograph</span>
        <div className="mt-2 flex items-center gap-4">
          <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-[#e8f1ff]">
            {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <img src="/id-card/silhouette.svg" alt="" width={64} height={64} />}
          </div>
          <div>
            <input ref={photoRef} type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" aria-label="Photograph" className="sr-only" onChange={(event) => void onPhoto(event)} />
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96]"
            >
              {photo ? "Replace photograph" : "Add photograph"}
            </button>
            <p className="mt-2 text-sm font-medium text-copy">JPEG or PNG. It is saved with the registration and printed on the ID card.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-bold text-ink">Full name</span>
          <input className={`${fieldClass} mt-2`} value={form.fullName} onChange={(event) => set("fullName", event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Phone</span>
          <input className={`${fieldClass} mt-2`} value={form.phone} onChange={(event) => set("phone", event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Email</span>
          <input className={`${fieldClass} mt-2`} value={form.email} onChange={(event) => set("email", event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Gender</span>
          <select className={`${fieldClass} mt-2`} value={form.gender} onChange={(event) => set("gender", event.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-bold text-ink">Address</span>
          <input className={`${fieldClass} mt-2`} value={form.address} autoComplete="street-address" placeholder="Street, area, and city" onChange={(event) => set("address", event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Student ID</span>
          <input
            className={`${fieldClass} mt-2 font-mono uppercase`}
            value={form.studentCode}
            onChange={(event) => set("studentCode", event.target.value.toUpperCase())}
            placeholder="ALB-0001A26"
            spellCheck={false}
            autoCapitalize="characters"
          />
          <span className="mt-2 block text-sm font-medium text-copy">
            {accepted && !form.studentCode.trim()
              ? "Save to assign the next ID, like ALB-0001A26."
              : "Running number, surname initial, and year. Example: ALB-0001A26."}
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Course</span>
          <select
            className={`${fieldClass} mt-2`}
            value={form.courseId}
            onChange={(event) => {
              const course = courses.find((item) => item.id === event.target.value);
              const keep = course?.options.find((option) => option.months === form.months) ?? course?.options[0];
              setForm((current) => ({
                ...current,
                courseId: event.target.value,
                months: keep?.months ?? current.months,
                feeId: keep?.id ?? "",
              }));
            }}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
            {!courses.some((course) => course.id === form.courseId) && <option value={form.courseId}>{form.courseTitle}</option>}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Length</span>
          <select
            className={`${fieldClass} mt-2`}
            value={chosenFee?.id ?? ""}
            onChange={(event) => {
              const option = selected?.options.find((item) => item.id === event.target.value);
              setForm((current) => ({
                ...current,
                feeId: event.target.value,
                months: option?.months ?? current.months,
              }));
            }}
          >
            {(selected?.options ?? []).map((option) => (
              <option key={option.id} value={option.id}>
                {option.months} months · {visible ? `₦${option.feeNaira.toLocaleString("en-NG")}` : "••••"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Guardian name</span>
          <input className={`${fieldClass} mt-2`} value={form.guardianName} onChange={(event) => set("guardianName", event.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink">Guardian phone</span>
          <input className={`${fieldClass} mt-2`} value={form.guardianPhone} onChange={(event) => set("guardianPhone", event.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-ink">Student note</span>
        <textarea className={`${fieldClass} mt-2`} rows={3} value={form.note} onChange={(event) => set("note", event.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-ink">Desk note</span>
        <textarea className={`${fieldClass} mt-2`} rows={3} value={form.deskNote} onChange={(event) => set("deskNote", event.target.value)} placeholder="What the desk has done, or what is still needed." />
      </label>
      <button type="submit" disabled={saving} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? "Saving…" : "Save registration"}
      </button>
      {accepted && (
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-admin text-2xl font-medium text-ink">Student ID card</h2>
              <p className="mt-1 text-sm font-medium text-copy">Concept B. Front and back download as one PDF.</p>
            </div>
            <button
              type="button"
              onClick={() => void downloadCard()}
              disabled={downloading || !card.studentCode}
              aria-busy={downloading}
              className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-60"
            >
              {downloading && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
              {downloading ? "Preparing…" : "Download PDF"}
            </button>
          </div>
          {!card.studentCode && <p className="mt-3 text-sm font-medium text-copy">Save this registration and the student ID is filled in.</p>}
          <div className="mt-5 overflow-x-auto">
            <StudentIdCardFaces data={card} frontRef={frontRef} backRef={backRef} />
          </div>
        </section>
      )}
    </form>
    <Dialog open={paymentOpen} onOpenChange={(open) => { if (!savingPayment) setPaymentOpen(open); }}>
      <DialogContent className="rounded-2xl border-line bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-admin text-2xl font-medium text-ink">Update payment</DialogTitle>
          <DialogDescription className="text-left text-sm font-medium leading-6 text-copy">
            Expected amount {visible ? `₦${form.feeNaira.toLocaleString("en-NG")}` : "••••"}, kept from the course at registration. A later course change leaves this amount as it is.
            {draft.payment === "paid"
              ? " Marking this fully paid adds the rest, so the amount paid becomes the expected amount."
              : draft.payment === "partial"
                ? ` Balance ${visible ? `₦${balance.toLocaleString("en-NG")}` : "••••"}.`
                : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-ink">Status</span>
            <select className={`${fieldClass} mt-2`} value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as RegistrationStatus }))}>
              {registrationStatuses.map((status) => (
                <option key={status} value={status}>
                  {registrationStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink">Payment</span>
            <select
              className={`${fieldClass} mt-2`}
              value={draft.payment}
              onChange={(event) => {
                const payment = event.target.value as PaymentStatus;
                setDraft((current) => ({
                  ...current,
                  payment,
                  amount: payment === "partial" ? current.amount : "",
                }));
              }}
            >
              {paymentStatuses.map((payment) => (
                <option key={payment} value={payment}>
                  {paymentStatusLabels[payment]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink">Amount paid</span>
            <input
              className={`${fieldClass} mt-2`}
              inputMode="numeric"
              autoComplete="off"
              value={amountShown}
              disabled={draft.payment !== "partial"}
              onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value.replace(/\D/g, "") }))}
            />
          </label>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => setPaymentOpen(false)}
            disabled={savingPayment}
            className="inline-flex items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,scale] duration-150 ease-out hover:border-ink/20 active:scale-[0.96] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void savePayment()}
            disabled={savingPayment}
            aria-busy={savingPayment}
            className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-60"
          >
            {savingPayment && <span className="me-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
            {savingPayment ? "Saving…" : "Save payment"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
