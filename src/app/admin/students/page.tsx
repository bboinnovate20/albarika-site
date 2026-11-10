import Link from "next/link";

const jobs = [
  { href: "/admin/courses", title: "Courses", detail: "Change course names, lengths, and the prices shown on the website." },
  { href: "/admin/students/register", title: "Register a student", detail: "Take a new student's details and start their record." },
];

export default function StudentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-ink">Students</h1>
      <p className="mt-2 text-copy">Register students and keep their records in one place.</p>
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
