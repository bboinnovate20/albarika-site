"use client";

import { usePricesVisible } from "@/components/admin/PriceVisibility";
import { downloadStudentIdCard, StudentIdCardFaces, type StudentIdCardData } from "@/components/admin/StudentIdCard";
import type { Course } from "@/lib/landing";
import { paymentStatusLabels, paymentStatuses, registrationStatusLabels, registrationStatuses, type PaymentStatus, type RegistrationStatus } from "@/lib/registration-schema";
import type { StoredRegistration } from "@/lib/repo/registrations";
import { useRef, useState } from "react";
import { toast } from "sonner";

const fieldClass = "w-full rounded-[14px] border border-line bg-white px-4 py-3 text-sm font-medium text-ink outline-none focus:border-ink";

export function RegistrationForm({ registration, courses }: { registration: StoredRegistration; courses: Course[] }) {
  const { visible } = usePricesVisible();
  const [form, setForm] = useState(registration);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const selected = courses.find((course) => course.id === form.courseId) ?? courses[0];
  const chosenFee = selected?.options.find((option) => option.id === form.feeId) ?? selected?.options.find((option) => option.months === form.months) ?? selected?.options[0];
  const accepted = form.status === "accepted";
  const card: StudentIdCardData = {
    fullName: form.fullName,
    studentCode: form.studentCode.trim(),
    programme: courses.find((course) => course.id === form.courseId)?.title || form.courseTitle,
    months: form.months,
    issued: registration.status === "accepted" ? new Date(registration.updatedAt) : new Date(),
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

  const save = async () => {
    setSaving(true);
    try {
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
          status: form.status,
          payment: form.payment,
          paidNaira: form.payment === "paid" ? form.feeNaira : Number(form.paidNaira),
          deskNote: form.deskNote,
          studentCode: form.studentCode,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string; studentCode?: string; paidNaira?: number; payment?: PaymentStatus } | null;
      if (!response.ok) {
        toast.error(data?.error || "The registration could not be saved.");
        return;
      }
      setForm((current) => ({
        ...current,
        studentCode: typeof data?.studentCode === "string" ? data.studentCode : current.studentCode,
        paidNaira: typeof data?.paidNaira === "number" ? data.paidNaira : current.paidNaira,
        payment: data?.payment ?? current.payment,
      }));
      toast.success(data?.studentCode ? `Registration updated. Student ID ${data.studentCode}.` : "Registration updated.");
    } catch {
      toast.error("The registration could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <label className="block">
        <span className="text-sm font-bold text-ink">Status</span>
        <select className={`${fieldClass} mt-2`} value={form.status} onChange={(event) => set("status", event.target.value as RegistrationStatus)}>
          {registrationStatuses.map((status) => (
            <option key={status} value={status}>
              {registrationStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-ink">Payment</span>
          <select
            className={`${fieldClass} mt-2`}
            value={form.payment}
            onChange={(event) => {
              const payment = event.target.value as PaymentStatus;
              setForm((current) => ({
                ...current,
                payment,
                paidNaira: payment === "paid" ? current.feeNaira : payment === "unpaid" ? 0 : current.paidNaira > 0 && current.paidNaira < current.feeNaira ? current.paidNaira : 0,
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
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={form.payment === "paid" ? form.feeNaira : form.paidNaira}
            disabled={form.payment !== "partial"}
            onChange={(event) => setForm((current) => ({ ...current, paidNaira: Number(event.target.value) }))}
          />
        </label>
      </div>
      <p className="text-sm font-medium text-copy">
        Expected amount {visible ? `₦${form.feeNaira.toLocaleString("en-NG")}` : "••••"}, kept from the course at registration. A later course change leaves this amount as it is.
        {form.payment === "paid"
          ? " Marking this fully paid adds the rest, so the amount paid becomes the expected amount."
          : form.payment === "partial"
            ? ` Balance ${visible ? `₦${Math.max(form.feeNaira - Number(form.paidNaira), 0).toLocaleString("en-NG")}` : "••••"}.`
            : ""}
      </p>
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
  );
}
