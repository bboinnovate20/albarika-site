import { institute } from "@/lib/landing";
import { getCourseBySlug } from "@/lib/repo/courses";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; months?: string }>;
}) {
  const params = await searchParams;
  const course = params.course ? await getCourseBySlug(params.course) : undefined;
  const months = Number(params.months);
  const option = course?.options.find((item) => item.months === months) ?? course?.options[0];

  return (
    <main className="min-h-screen bg-canvas px-4 py-16 text-ink">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blurple">Enrolment</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          {course ? course.title : "Choose a course, then visit us"}
        </h1>
        {option && (
          <p className="mt-3 text-lg font-medium text-copy">
            {option.months} months · ₦{option.feeNaira.toLocaleString("en-NG")}
          </p>
        )}
        <p className="mt-4 font-medium leading-7 text-copy">
          The full registration form, with your photo and guardian details, is the next piece of this site. For now, call or visit {institute.address.join(", ")} and tell the desk the course you want. A part payment starts your enrolment.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${institute.phones[0]}`} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
            Call {institute.phones[0]}
          </a>
          <Link href="/#contact" className="rounded-full border border-line px-5 py-3 text-sm font-semibold">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
