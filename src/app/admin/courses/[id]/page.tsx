import { CourseForm } from "@/components/admin/CourseForm";
import { getCourse } from "@/lib/repo/courses";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let course: Awaited<ReturnType<typeof getCourse>> = null;
  let problem = "";
  try {
    course = await getCourse(id);
  } catch {
    problem = "The course could not be loaded. Try again in a moment.";
  }
  if (!problem && !course) notFound();
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/courses" className="text-sm font-bold text-blurple">
        Back to courses
      </Link>
      <h1 className="mt-3 font-admin text-4xl font-medium tracking-tight text-ink">Edit course</h1>
      {problem || !course ? (
        <p className="mt-6 text-sm font-semibold text-[#E5231B]">{problem}</p>
      ) : (
        <CourseForm course={course} nextPosition={course.position ?? 1} />
      )}
    </div>
  );
}
