import Link from "next/link";

const jobs = [
  { href: "/admin/exam-cards", title: "Exam cards", detail: "Buy and check WAEC and other exam cards." },
  { href: "/admin/receipts", title: "Receipts", detail: "Student and customer receipts." },
  { href: "/admin/messages", title: "Website messages", detail: "Requests sent from the public contact form." },
];

export default function InternalServicesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Internal services</h1>
      <p className="mt-2 text-copy">Work the staff do for people who walk in or write to the institute.</p>
      <ul className="mt-8 space-y-3">
        {jobs.map((job) => (
          <li key={job.href}>
            <Link href={job.href} className="block rounded-[24px] border border-line bg-white p-5 hover:border-ink">
              <span className="block font-display text-xl font-bold text-ink">{job.title}</span>
              <span className="mt-1 block text-sm font-medium text-copy">{job.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
