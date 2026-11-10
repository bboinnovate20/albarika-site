"use client";

import { Reveal } from "@/components/landing/Reveal";
import { institute, whatsappHref } from "@/lib/landing";
import { messageSchema, messageTopics, type MessageInput } from "@/lib/message-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const quickWhatsapp = `https://wa.me/${institute.whatsapp}?text=${encodeURIComponent("Hello, I just sent a message on your website and would like a quick reply.")}`;

const fieldClass =
  "w-full rounded-[14px] border border-line bg-white px-4 py-3 text-base font-medium text-ink outline-none focus:border-blurple";

export default function ContactSection() {
  const [shaking, setShaking] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { fullName: "", phone: "", email: "", body: "", topic: "general" },
  });
  const topic = watch("topic");

  useEffect(() => {
    const apply = (next: string) => {
      if (messageTopics.some((item) => item.id === next)) {
        setValue("topic", next as MessageInput["topic"], { shouldValidate: true });
      }
    };
    const fromUrl = new URLSearchParams(window.location.search).get("topic");
    if (fromUrl) apply(fromUrl);
    const onTopic = (event: Event) => apply((event as CustomEvent<string>).detail);
    window.addEventListener("albarika-topic", onTopic);
    return () => window.removeEventListener("albarika-topic", onTopic);
  }, [setValue]);

  const shake = (fields: string[]) => {
    setShaking(fields);
    window.setTimeout(() => setShaking([]), 400);
  };

  const onSubmit = handleSubmit(
    async (values) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        toast.error("We couldn't send that. Call us and we'll take it from there.");
        return;
      }
      reset({ fullName: "", phone: "", email: "", body: "", topic: values.topic });
      setSent(true);
    },
    (fieldErrors) => {
      const names = Object.keys(fieldErrors);
      shake(names);
      const first = names[0];
      if (first) document.getElementById(first)?.focus();
    },
  );

  return (
    <section id="contact" className="bg-paper py-20 sm:py-28">
      <Reveal className="container-custom grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="t-stagger-line t-stagger-line--1">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blurple">Contact us</p>
            <h2 className="mt-3 font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[40px]">
              Visit, call, or send a message
            </h2>
          </div>
          <ul className="t-stagger-line t-stagger-line--2 mt-8 space-y-3">
            <li>
              <a href={institute.maps} target="_blank" rel="noreferrer" className="flex gap-3 rounded-[20px] bg-white p-4">
                <MapPin className="mt-0.5 size-5 text-blurple" />
                <span>
                  <span className="block font-bold text-ink">Campus</span>
                  <span className="text-sm font-medium text-copy">{institute.address.join(", ")}</span>
                </span>
              </a>
            </li>
            {institute.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone}`} className="flex gap-3 rounded-[20px] bg-white p-4">
                  <Phone className="mt-0.5 size-5 text-blurple" />
                  <span>
                    <span className="block font-bold text-ink">{phone}</span>
                    <span className="text-sm font-medium text-copy">Mon–Sat, 9am–6pm</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${institute.email}`} className="flex gap-3 rounded-[20px] bg-white p-4">
                <Mail className="mt-0.5 size-5 text-blurple" />
                <span className="font-bold text-ink">{institute.email}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-[20px] bg-ink p-4 text-white"
              >
                <img src="/icon/whatsapp.png" alt="" className="size-7 shrink-0 object-contain" />
                <span>
                  <span className="block font-bold">WhatsApp</span>
                  <span className="text-sm text-white/80">Available any time</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="t-stagger-line t-stagger-line--3 rounded-[28px] bg-white p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <SuccessPanel key="sent" reduce={reduce} onAgain={() => setSent(false)} />
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" id="fullName" error={errors.fullName?.message} shaking={shaking.includes("fullName")}>
              <input id="fullName" className={fieldClass} autoComplete="name" {...register("fullName")} />
            </Field>
            <Field label="Phone" id="phone" error={errors.phone?.message} shaking={shaking.includes("phone")}>
              <input id="phone" className={fieldClass} autoComplete="tel" inputMode="tel" {...register("phone")} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Email (optional)" id="email" error={errors.email?.message} shaking={shaking.includes("email")}>
              <input id="email" type="email" className={fieldClass} autoComplete="email" {...register("email")} />
            </Field>
          </div>
          <fieldset className={cn("mt-5", shaking.includes("topic") && "is-shaking")}>
            <legend className="text-sm font-bold text-ink">What do you need?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {messageTopics.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={topic === item.id}
                  onClick={() => setValue("topic", item.id, { shouldValidate: true })}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-semibold transition-[background-color,border-color,color] duration-150",
                    topic === item.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {errors.topic && <p className="mt-2 text-sm font-semibold text-[#E5231B]">{errors.topic.message}</p>}
          </fieldset>
          <div className="mt-4">
            <Field label="Message" id="body" error={errors.body?.message} shaking={shaking.includes("body")}>
              <textarea id="body" rows={5} className={fieldClass} {...register("body")} />
            </Field>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="mt-6 inline-flex min-w-40 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97] disabled:opacity-70"
          >
            {isSubmitting && (
              <span
                className="mr-2.5 size-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none"
                aria-hidden
              />
            )}
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
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
      className="flex min-h-[420px] flex-col items-center justify-center px-2 py-6 text-center sm:px-8"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src="/icon/success-icon.png"
        alt=""
        width={168}
        height={154}
        className="h-36 w-auto"
        initial={reduce ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0 }}
      />
      <h3 className="mt-1 font-display text-[28px] font-extrabold leading-tight text-ink">Message sent</h3>
      <p className="mt-3 max-w-sm text-[17px] font-medium leading-7 text-copy">
        We will contact you soon. For a quicker reply, send a message on WhatsApp.
      </p>
      <a
        href={quickWhatsapp}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97]"
      >
        <img src="/icon/whatsapp.png" alt="" className="size-5 object-contain" />
        Message us on WhatsApp
      </a>
      <button type="button" onClick={onAgain} className="mt-4 text-sm font-bold text-blurple">
        Send another message
      </button>
    </motion.div>
  );
}

function Field({
  label,
  id,
  error,
  shaking,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  shaking: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className={cn("block", shaking && "is-shaking")}>
      <span className="text-sm font-bold text-ink">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-sm font-semibold text-[#E5231B]">{error}</span>}
    </label>
  );
}
