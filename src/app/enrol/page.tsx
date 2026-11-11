import { EnrolForm } from "@/components/EnrolForm";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { publicCourses } from "@/lib/repo/courses";

export const dynamic = "force-dynamic";

export default async function EnrolPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; months?: string }>;
}) {
  const params = await searchParams;
  const courses = await publicCourses();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navigation />
      <main className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blurple">Enrolment</p>
          <h1 className="mt-3 font-display text-[32px] font-extrabold leading-tight sm:text-4xl">Register for a course</h1>
          <p className="mt-3 font-medium leading-7 text-copy">
            Send the student’s details. The desk reviews every registration before a place is confirmed.
          </p>
          <div className="mt-8 rounded-[28px] bg-white p-6 sm:p-8">
            <EnrolForm courses={courses} courseSlug={params.course} months={params.months} />
          </div>
        </div>
      </main>
      <Footer courses={courses} />
    </div>
  );
}
