import { PriceText, PriceToggle } from "@/components/admin/PriceVisibility";
import { listCourses } from "@/lib/repo/courses";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  let courses: Awaited<ReturnType<typeof listCourses>> = [];
  let problem = "";
  try {
    courses = await listCourses();
  } catch {
    problem = "The course list could not be loaded.";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-admin text-4xl font-medium tracking-tight text-ink">Courses</h1>
            <PriceToggle />
          </div>
          <p className="mt-2 text-copy">These names and prices are what the landing page shows.</p>
        </div>
        <Link href="/admin/courses/new" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          Add a course
        </Link>
      </div>
      {problem && <p className="mt-6 text-sm font-semibold text-[#E5231B]">{problem}</p>}
      <ul className="mt-8 space-y-3">
        {courses.map((course) => (
          <li key={course.id}>
            <Link href={`/admin/courses/${course.id}`} className="block rounded-[24px] border border-line bg-white p-5 hover:border-ink">
              <span className="block font-admin text-2xl font-medium text-ink">
                {course.position}. {course.title}
              </span>
              <span className="mt-1 block text-sm font-medium text-copy">{course.summary}</span>
              <span className="mt-3 block text-sm font-semibold text-ink">
                {course.options.map((option, index) => (
                  <span key={option.months}>
                    {index > 0 ? "  ·  " : ""}
                    {option.months} months · <PriceText value={`₦${option.feeNaira.toLocaleString("en-NG")}`} />
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
