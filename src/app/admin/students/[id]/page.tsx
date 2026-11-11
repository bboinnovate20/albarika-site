import { RegistrationForm } from "@/components/admin/RegistrationForm";
import { PriceText, PriceToggle } from "@/components/admin/PriceVisibility";
import { paymentStatusLabels, registrationStatusLabels } from "@/lib/registration-schema";
import { publicCourses } from "@/lib/repo/courses";
import { getRegistration } from "@/lib/repo/registrations";
import { studentPhotoSrc } from "@/lib/slip-store";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function whatsapp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const local = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${local}`;
}

export default async function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let registration: Awaited<ReturnType<typeof getRegistration>> = null;
  let problem = "";
  try {
    registration = await getRegistration(id);
  } catch {
    problem = "The registration could not be loaded.";
  }
  if (!problem && !registration) notFound();
  const courses = await publicCourses().catch(() => []);
  const chat = registration ? whatsapp(registration.phone) : "";
  const photograph = registration?.photoKey ? await studentPhotoSrc(registration.photoKey) : "";

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/students" className="text-sm font-bold text-blurple">
        Back to students
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <h1 className="font-admin text-4xl font-medium tracking-tight text-ink">{registration?.fullName ?? "Registration"}</h1>
        <PriceToggle />
      </div>
      {problem || !registration ? (
        <p className="mt-6 text-sm font-semibold text-[#E5231B]">{problem}</p>
      ) : (
        <>
          <p className="mt-2 text-sm font-medium text-copy">
            {registrationStatusLabels[registration.status]} · sent {new Date(registration.createdAt).toLocaleString("en-NG")} · expected amount{" "}
            <PriceText value={`₦${registration.feeNaira.toLocaleString("en-NG")}`} />
            {" · "}
            {paymentStatusLabels[registration.payment]}{" "}
            <PriceText value={`₦${registration.paidNaira.toLocaleString("en-NG")}`} />
          </p>
          {registration.studentCode && <p className="mt-2 font-mono text-sm font-semibold tracking-wide text-ink">{registration.studentCode}</p>}
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a href={`tel:${registration.phone}`} className="rounded-full border border-line bg-white px-4 py-2 text-ink">
              Call {registration.phone}
            </a>
            {chat && (
              <a href={chat} target="_blank" rel="noreferrer" className="rounded-full border border-line bg-white px-4 py-2 text-ink">
                WhatsApp
              </a>
            )}
          </div>
          <RegistrationForm registration={registration} courses={courses} photograph={photograph} />
        </>
      )}
    </div>
  );
}
