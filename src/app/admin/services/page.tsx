import Link from "next/link";

const jobs = [
  { href: "/admin/exam-cards", title: "Result checker", detail: "Buy WAEC, NECO, and NABTEB checkers from the wallet." },
  { href: "/admin/verification", title: "NIN and BVN", detail: "Verification slips, billed from the Verify Platform wallet." },
  { href: "/admin/receipts", title: "Receipts", detail: "Student and customer receipts." },
  { href: "/admin/messages", title: "Website messages", detail: "Requests sent from the public contact form." },
];

export default function InternalServicesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-admin text-4xl font-medium tracking-tight text-ink">Internal services</h1>
      <p className="mt-2 text-copy">Work the staff do for people who walk in or write to the institute.</p>
      <ul className="mt-8 space-y-3">
        {jobs.map((job) => (
          <li key={job.href}>
            <Link href={job.href} className="block rounded-[24px] border border-line bg-white p-5 hover:border-ink">
              <span className="block font-admin text-2xl font-medium text-ink">{job.title}</span>
              <span className="mt-1 block text-sm font-medium text-copy">{job.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
