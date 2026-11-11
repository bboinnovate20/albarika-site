import { registrationStatusLabels, type RegistrationStatus } from "@/lib/registration-schema";
import { listRegistrations } from "@/lib/repo/registrations";
import Link from "next/link";

export const dynamic = "force-dynamic";

const tones: Record<RegistrationStatus, string> = {
  pending: "bg-[#F4E3A0] text-ink",
  accepted: "bg-[#D7EBD6] text-ink",
  waitlist: "bg-[#D3E3F8] text-ink",
  declined: "bg-[#F3F1EC] text-copy",
};

export default async function StudentPage() {
  let registrations: Awaited<ReturnType<typeof listRegistrations>> = [];
  let problem = "";
  try {
    registrations = await listRegistrations();
  } catch {
    problem = "The registration list could not be loaded.";
  }
  const pending = registrations.filter((item) => item.status === "pending").length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-admin text-4xl font-medium tracking-tight text-ink">Students</h1>
      <p className="mt-2 text-copy">
        {pending} pending from the public registration form. Open a record to accept it, change the course, or leave a desk note.
      </p>
      <p className="mt-3 text-sm font-semibold">
        <Link href="/enrol" className="text-blurple">
          Public registration form
        </Link>
      </p>
      {problem && <p className="mt-6 text-sm font-semibold text-[#E5231B]">{problem}</p>}
      {!problem && registrations.length === 0 && <p className="mt-6 text-sm font-medium text-copy">No registrations yet.</p>}
      <ul className="mt-6 space-y-3">
        {registrations.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/students/${item.id}`} className="block rounded-[24px] border border-line bg-white p-5 hover:border-ink">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-lg font-bold text-ink">{item.fullName}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[item.status] ?? tones.pending}`}>
                  {registrationStatusLabels[item.status] ?? item.status}
                </span>
              </span>
              <span className="mt-2 block text-sm font-medium text-copy">
                {item.courseTitle} · {item.months} months · {item.phone}
              </span>
              {item.studentCode && <span className="mt-1 block font-mono text-sm font-semibold tracking-wide text-ink">{item.studentCode}</span>}
              <span className="mt-1 block text-xs font-medium text-copy">{new Date(item.createdAt).toLocaleString("en-NG")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
