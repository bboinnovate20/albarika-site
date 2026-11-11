"use client";

import { institute, type Course } from "@/lib/landing";
import { registrationSchema } from "@/lib/registration-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function controlClass(invalid: boolean) {
  return cn(
    "w-full rounded-[14px] border bg-white px-4 py-3 text-base font-medium text-ink",
    "transition-[border-color,outline-color] duration-150 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    invalid
      ? "border-[#E5231B] focus-visible:border-[#E5231B] focus-visible:outline-[#E5231B]"
      : "border-line hover:border-ink/20 focus-visible:border-blurple focus-visible:outline-blurple",
  );
}

const quickWhatsapp = `https://wa.me/${institute.whatsapp}?text=${encodeURIComponent("Hello, I just registered for a course on your website and would like a quick reply.")}`;

export function EnrolForm({
  courses,
  courseSlug,
  months,
}: {
  courses: Course[];
  courseSlug?: string;
  months?: string;
}) {
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [shaking, setShaking] = useState<string[]>([]);
  const initialCourse = courses.find((course) => course.slug === courseSlug) ?? courses[0];
  const initialOption =
    initialCourse?.options.find((option) => String(option.months) === months) ?? initialCourse?.options[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      gender: "",
      courseId: initialCourse?.id ?? "",
      feeId: initialOption?.id ?? "",
      months: initialOption?.months ?? 0,
      guardianName: "",
      guardianPhone: "",
      note: "",
    },
  });

  const courseId = watch("courseId");
  const feeId = watch("feeId");
  const selected = courses.find((course) => course.id === courseId) ?? courses[0];
  const option = selected?.options.find((item) => item.id === feeId) ?? selected?.options[0];

  useEffect(() => {
    if (!option) return;
    if (option.id !== feeId) setValue("feeId", option.id);
    setValue("months", option.months);
  }, [option, feeId, setValue]);

  const price = useMemo(() => (option ? `₦${option.feeNaira.toLocaleString("en-NG")}` : ""), [option]);

  const shake = (fields: string[]) => {
    setShaking(fields);
    window.setTimeout(() => setShaking([]), 400);
  };

  const onSubmit = handleSubmit(
    async (values) => {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.error || "We couldn't save that. Call us and we'll take it from there.");
        return;
      }
      reset({ ...values, fullName: "", phone: "", email: "", guardianName: "", guardianPhone: "", note: "" });
      setSent(true);
    },
    (fieldErrors) => {
      const names = Object.keys(fieldErrors);
      shake(names);
      const first = names[0];
      if (first) document.getElementById(first)?.focus();
    },
  );

  if (!courses.length) {
    return <p className="text-sm font-medium text-copy">Courses are not listed right now. Call {institute.phones[0]} and the desk will take your details.</p>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <SuccessPanel key="sent" reduce={reduce} onAgain={() => setSent(false)} />
      ) : (
        <motion.form key="form" onSubmit={onSubmit} className="space-y-5" noValidate initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Field label="Full name" id="fullName" error={errors.fullName?.message} shaking={shaking.includes("fullName")}>
            <input id="fullName" className={controlClass(Boolean(errors.fullName))} autoComplete="name" aria-invalid={Boolean(errors.fullName)} {...register("fullName")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" id="phone" error={errors.phone?.message} shaking={shaking.includes("phone")}>
              <input id="phone" className={controlClass(Boolean(errors.phone))} autoComplete="tel" inputMode="tel" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
            </Field>
            <Field label="Email" id="email" error={errors.email?.message} shaking={shaking.includes("email")}>
              <input id="email" type="email" className={controlClass(Boolean(errors.email))} autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            </Field>
          </div>
          <Field label="Gender" id="gender" error={errors.gender?.message} shaking={shaking.includes("gender")}>
            <SelectWrap invalid={Boolean(errors.gender)}>
              <select id="gender" className={selectClass(Boolean(errors.gender))} aria-invalid={Boolean(errors.gender)} {...register("gender")}>
                <option value="">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </SelectWrap>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Course" id="courseId" error={errors.courseId?.message} shaking={shaking.includes("courseId")}>
              <SelectWrap invalid={Boolean(errors.courseId)}>
                <select id="courseId" className={selectClass(Boolean(errors.courseId))} aria-invalid={Boolean(errors.courseId)} {...register("courseId")}>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
            <Field label="Length" id="months" error={errors.months?.message} shaking={shaking.includes("months")}>
              <SelectWrap invalid={Boolean(errors.months)}>
                <select id="months" className={selectClass(Boolean(errors.months))} aria-invalid={Boolean(errors.months)} {...register("feeId")}>
                  {selected?.options.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.months} months · ₦{item.feeNaira.toLocaleString("en-NG")}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          </div>
          {option && <p className="text-sm font-semibold text-ink">{selected?.title} · {option.months} months · {price}</p>}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Guardian name" id="guardianName" error={errors.guardianName?.message} shaking={shaking.includes("guardianName")}>
              <input id="guardianName" className={controlClass(Boolean(errors.guardianName))} aria-invalid={Boolean(errors.guardianName)} {...register("guardianName")} />
            </Field>
            <Field label="Guardian phone" id="guardianPhone" error={errors.guardianPhone?.message} shaking={shaking.includes("guardianPhone")}>
              <input id="guardianPhone" className={controlClass(Boolean(errors.guardianPhone))} inputMode="tel" aria-invalid={Boolean(errors.guardianPhone)} {...register("guardianPhone")} />
            </Field>
          </div>
          <Field label="Anything we should know" id="note" error={errors.note?.message} shaking={shaking.includes("note")}>
            <textarea id="note" rows={4} className={cn(controlClass(Boolean(errors.note)), "min-h-28 resize-y")} aria-invalid={Boolean(errors.note)} {...register("note")} />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1e2f7a] active:scale-[0.96] disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting && <span className="mr-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />}
            {isSubmitting ? "Sending…" : "Submit registration"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function SuccessPanel({ reduce, onAgain }: { reduce: boolean | null; onAgain: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  return (
    <motion.div
      ref={panel}
      role="status"
      className="flex min-h-[420px] flex-col items-center justify-center px-2 py-6 text-center"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.img
        src="/icon/success-icon.webp"
        alt=""
        width={168}
        height={154}
        className="h-36 w-auto"
        initial={reduce ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0 }}
      />
      <h2 className="mt-1 font-display text-[28px] font-extrabold leading-tight text-ink">Registration received</h2>
      <p className="mt-3 max-w-sm text-[17px] font-medium leading-7 text-copy">
        The desk will review it and contact you. For a quicker reply, send a message on WhatsApp.
      </p>
      <a href={quickWhatsapp} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
        <img src="/icon/whatsapp.png" alt="" className="size-5 object-contain" />
        Message us on WhatsApp
      </a>
      <button type="button" onClick={onAgain} className="mt-4 text-sm font-bold text-blurple">
        Register another student
      </button>
    </motion.div>
  );
}

function selectClass(invalid: boolean) {
  return cn(controlClass(invalid), "appearance-none pe-10");
}

function SelectWrap({ invalid, children }: { invalid: boolean; children: ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <ChevronDown className={cn("pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2", invalid ? "text-[#E5231B]" : "text-copy")} strokeWidth={2} aria-hidden />
    </span>
  );
}

function Field({ label, id, error, shaking, children }: { label: string; id: string; error?: string; shaking: boolean; children: ReactNode }) {
  return (
    <label htmlFor={id} className={cn("block", shaking && "is-shaking")}>
      <span className="text-sm font-bold text-ink">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-sm font-semibold text-[#E5231B]">{error}</span>}
    </label>
  );
}
