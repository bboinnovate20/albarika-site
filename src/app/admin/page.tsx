import Link from "next/link";

const segments = [
  {
    href: "/admin/students",
    title: "Students",
    detail: "Register students, and change the courses and prices shown on the website.",
  },
  {
    href: "/admin/services",
    title: "Internal services",
    detail: "Staff work such as buying exam cards, receipts, and messages from the website.",
  },
  {
    href: "/admin/internal",
    title: "Internal",
    detail: "A place for the institute's own work. What lives here will be decided later.",
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-2 text-copy">Choose the part of the institute you are working on.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {segments.map((segment) => (
          <Link
            key={segment.href}
            href={segment.href}
            className="flex min-h-52 flex-col justify-between rounded-[28px] border border-line bg-white p-6 transition-[transform,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-ink"
          >
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink">{segment.title}</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-copy">{segment.detail}</p>
            </div>
            <span className="mt-6 text-sm font-bold text-blurple">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
