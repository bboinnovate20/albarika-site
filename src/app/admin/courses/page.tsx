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
          <h1 className="font-display text-3xl font-extrabold text-ink">Courses</h1>
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
              <span className="block font-display text-xl font-bold text-ink">
                {course.position}. {course.title}
              </span>
              <span className="mt-1 block text-sm font-medium text-copy">{course.summary}</span>
              <span className="mt-3 block text-sm font-semibold text-ink">
                {course.options.map((option) => `${option.months} months · ₦${option.feeNaira.toLocaleString("en-NG")}`).join("  ·  ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
