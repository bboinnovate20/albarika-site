import { CourseForm } from "@/components/admin/CourseForm";
import { listCourses } from "@/lib/repo/courses";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const courses = await listCourses().catch(() => []);
  const nextPosition = courses.length + 1;
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/courses" className="text-sm font-bold text-blurple">
        Back to courses
      </Link>
      <h1 className="mt-3 font-admin text-4xl font-medium tracking-tight text-ink">Add a course</h1>
      <CourseForm nextPosition={nextPosition} />
    </div>
  );
}
