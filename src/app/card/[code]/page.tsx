import { StudentCardView } from "@/components/StudentCardView";
import { institute } from "@/lib/landing";
import { getRegistrationByCode } from "@/lib/repo/registrations";
import { readStudentPhoto } from "@/lib/slip-store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student card — Albarika Computer Institute",
  robots: { index: false, follow: false },
};

function cardDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function addMonths(iso: string, months: number) {
  const date = new Date(iso);
  date.setMonth(date.getMonth() + months);
  return cardDate(date.toISOString());
}

async function portrait(key: string) {
  if (!key) return "";
  try {
    const file = await readStudentPhoto(key);
    if (!file) return "";
    const type = key.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${type};base64,${file}`;
  } catch {
    return "";
  }
}

export default async function StudentCardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const registration = await getRegistrationByCode(decodeURIComponent(code)).catch(() => null);
  const photo = registration ? await portrait(registration.photoKey) : "";

  const card = (
    <article className="w-full overflow-hidden rounded-[28px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
      <header className="flex items-center gap-3 bg-[#0e2a5c] px-6 pt-8 pb-16">
        <img src="/image/logo.jpeg" alt="" width={48} height={48} className="size-12 rounded-full border-2 border-white object-cover" />
        <div>
          <p className="text-lg leading-6 font-extrabold tracking-[0.08em] text-white">ALBARIKA</p>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#c9dcff]">COMPUTER INSTITUTE</p>
        </div>
      </header>
      {!registration ? (
        <div className="-mt-8 px-6 pb-8">
          <h1 className="font-admin text-3xl font-medium text-ink">Card not found</h1>
          <p className="mt-3 text-sm leading-6 font-medium text-copy">This code is not an active Albarika student card.</p>
        </div>
      ) : (
        <div className="px-6 pb-8">
            <div className="-mt-12 mb-4 grid size-28 place-items-center overflow-hidden rounded-full border-[5px] border-[#f9b233] bg-[#e8f1ff]">
              {photo ? (
                <img src={photo} alt="" className="size-full object-cover" />
              ) : (
                <img src="/id-card/silhouette.svg" alt="" width={72} height={72} />
              )}
            </div>
            <h1 className="font-admin text-4xl font-medium tracking-tight text-[#0e2a5c]">{registration.fullName}</h1>
            <p className="mt-1 text-sm font-bold tracking-[0.28em] text-[#2563eb]">STUDENT</p>
            <dl className="mt-6 grid gap-3 text-sm">
              {[
                ["ID no.", registration.studentCode],
                ["Programme", registration.courseTitle],
                ["Duration", `${registration.months} month${registration.months === 1 ? "" : "s"}`],
                ["Enrolled", cardDate(registration.createdAt)],
                ["Valid until", addMonths(registration.createdAt, registration.months)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#dce6f7] pb-3">
                  <dt className="text-xs font-bold tracking-[0.12em] text-[#6b7a99] uppercase">{label}</dt>
                  <dd className={`text-right font-semibold text-[#16223f] ${label === "ID no." ? "font-mono tracking-wide" : ""}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm font-medium text-copy">
              {institute.address.join(", ")}
              <br />
              {institute.phones.join(" · ")}
            </p>
        </div>
      )}
    </article>
  );

  return (
    <main className="min-h-screen bg-[#e8f1ff] px-4 py-8">
      {registration ? <StudentCardView>{card}</StudentCardView> : <div className="mx-auto w-full max-w-[420px]">{card}</div>}
    </main>
  );
}
