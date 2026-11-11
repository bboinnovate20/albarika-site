import { PriceText, PriceToggle } from "@/components/admin/PriceVisibility";
import { messageTopics } from "@/lib/message-schema";
import { institute } from "@/lib/landing";
import { publicCourses } from "@/lib/repo/courses";
import { listMessages, type StoredMessage } from "@/lib/repo/messages";
import { listRegistrations, type StoredRegistration } from "@/lib/repo/registrations";
import { CreditCard, Fingerprint, GraduationCap, MessageSquare, ReceiptText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const desk = [
  { href: "/admin/students", title: "Review registrations", detail: "Pending students", icon: GraduationCap },
  { href: "/admin/exam-cards", title: "Result checker", detail: "WAEC, NECO and NABTEB", icon: CreditCard },
  { href: "/admin/verification", title: "NIN and BVN", detail: "Verification slips", icon: Fingerprint },
  { href: "/admin/receipts", title: "Receipts", detail: "Student and walk-in", icon: ReceiptText },
];

function when(iso: string) {
  const date = new Date(iso);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((start.getTime() - day.getTime()) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}

export default async function AdminDashboard() {
  const [messages, courses, registrations] = await Promise.all([
    listMessages().catch(() => [] as StoredMessage[]),
    publicCourses(),
    listRegistrations().catch(() => [] as StoredRegistration[]),
  ]);
  const waiting = messages.filter((message) => message.status === "new");
  const pending = registrations.filter((item) => item.status === "pending");
  const prices = courses.reduce((count, course) => count + course.options.length, 0);
  const now = new Date();
  const today = `${now.toLocaleDateString("en-GB", { weekday: "long" })}, ${now.getDate()} ${now.toLocaleDateString("en-GB", { month: "long" })}`.toUpperCase();

  const stats = [
    { href: "/admin/messages", label: "New messages", value: waiting.length, note: "From the website", tone: "bg-[#F6CDB8]" },
    { href: "/admin/courses", label: "Courses", value: courses.length, note: "On the landing page", tone: "bg-[#F4E3A0]" },
    { href: "/admin/courses", label: "Prices", value: prices, note: "Ready to change", tone: "bg-[#F6D4E6]" },
    { href: "/admin/students", label: "Pending students", value: pending.length, note: "Waiting on the desk", tone: "bg-[#D3E3F8]" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-copy">{today}</p>
          <h1 className="mt-2 font-admin text-4xl font-medium tracking-tight text-ink sm:text-5xl">Welcome back</h1>
        </div>
        <DeskMark />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={`rounded-[22px] ${stat.tone} px-5 py-4 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5`}>
            <span className="text-[11px] font-semibold tracking-[0.14em] text-ink/70">{stat.label.toUpperCase()}</span>
            <span className="mt-3 block font-admin text-5xl leading-none text-ink">{stat.value}</span>
            <span className="mt-3 block text-sm font-medium text-ink/70">{stat.note}</span>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[22px] bg-[#F8F4E4] p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <GraduationCap className="size-4" /> Pending students
              <span className="text-copy">{pending.length}</span>
            </h2>
            <Link href="/admin/students" className="text-sm font-semibold text-copy">
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {pending.length === 0 && <li className="rounded-2xl bg-white px-4 py-5 text-sm font-medium text-copy">No pending registrations.</li>}
            {pending.slice(0, 4).map((item) => (
              <li key={item.id}>
                <Link href={`/admin/students/${item.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-ink">{item.fullName}</span>
                    <span className="mt-0.5 block text-xs font-medium text-copy">
                      {item.courseTitle} · {item.months} months
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#F4E3A0] px-2.5 py-1 text-[11px] font-semibold text-ink">Pending</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[22px] bg-[#F4F7FC] p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <MessageSquare className="size-4" /> Messages
              <span className="text-copy">{messages.length}</span>
            </h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-copy">
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {messages.length === 0 && <li className="rounded-2xl bg-white px-4 py-5 text-sm font-medium text-copy">No messages yet.</li>}
            {messages.slice(0, 4).map((message) => (
              <li key={message.id}>
                <Link href="/admin/messages" className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-ink">{message.fullName}</span>
                    <span className="mt-0.5 block text-xs font-medium text-copy">
                      {messageTopics.find((item) => item.id === message.topic)?.label ?? message.topic}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-copy">{when(message.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[22px] bg-[#FBF3EE] p-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              Courses <span className="text-copy">{courses.length}</span>
              <PriceToggle />
            </h2>
            <Link href="/admin/courses" className="text-sm font-semibold text-copy">
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Link href={`/admin/courses/${course.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm font-semibold text-ink">{course.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-ink">
                    <PriceText value={`₦${(course.options[0]?.feeNaira ?? 0).toLocaleString("en-NG")}`} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[22px] bg-[#F8F4E4] p-4">
          <h2 className="px-2 text-sm font-semibold text-ink">
            Next on the desk <span className="text-copy">{desk.length}</span>
          </h2>
          <ul className="mt-3 space-y-2">
            {desk.map((job) => (
              <li key={job.href}>
                <Link href={job.href} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <span className="flex items-center gap-3">
                    <job.icon className="size-4 text-ink" />
                    <span className="text-sm font-semibold text-ink">{job.title}</span>
                  </span>
                  <span className="text-xs font-medium text-copy">{job.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[22px] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">The desk</h2>
          <p className="mt-3 text-sm font-medium leading-6 text-copy">{institute.address.join(", ")}</p>
          <p className="mt-2 text-sm font-semibold text-ink">{institute.phones.join(" · ")}</p>
          <p className="mt-1 text-sm font-medium text-copy">{institute.email}</p>
        </section>
      </div>
    </div>
  );
}

function DeskMark() {
  return (
    <svg viewBox="0 0 120 72" className="hidden h-16 w-28 shrink-0 text-ink sm:block" aria-hidden>
      <rect x="8" y="14" width="70" height="46" rx="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 24h70" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="16" cy="19" r="1.6" fill="currentColor" />
      <path d="M78 40c10-16 22-16 34-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M96 22l16 10-16 4z" fill="currentColor" />
    </svg>
  );
}
