import { institute, services, type Course } from "@/lib/landing";
import Image from "next/image";
import Link from "next/link";

export default function Footer({ courses }: { courses: Course[] }) {
  return (
    <footer className="bg-hero-deep text-white">
      <div className="container-custom grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/image/logo.jpeg" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
            <span>
              <span className="block font-display text-sm font-bold">{institute.short}</span>
              <span className="block text-xs text-white/70">{institute.tagline}</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Practical IT training and everyday computing services at {institute.address.join(", ")}.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">Courses</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link href={`/enrol?course=${course.slug}`}>{course.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">Services</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {services.map((service) => (
              <li key={service.title}>
                <a href={`/?topic=${service.topic}#contact`}>{service.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">Visit</h2>
          <p className="mt-4 text-sm leading-6 text-white/75">{institute.address.join(", ")}</p>
          <p className="mt-3 text-sm text-white/75">{institute.phones.join(" · ")}</p>
          <p className="mt-3 text-sm text-white/75">{institute.email}</p>
          <Link href="/portal/login" className="mt-4 inline-block text-sm font-bold text-white">
            Student login
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-custom py-5 text-sm text-white/60">© {new Date().getFullYear()} Albarika Computer Institute</p>
      </div>
    </footer>
  );
}
