"use client";

import { DurationToggle } from "@/components/landing/DurationToggle";
import { Naira } from "@/components/landing/Naira";
import { Reveal } from "@/components/landing/Reveal";
import type { Course } from "@/lib/landing";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CoursesSection({ courses }: { courses: Course[] }) {
  const publishing = courses[0];
  const [months, setMonths] = useState(publishing?.options[0]?.months ?? 3);
  const option = publishing?.options.find((item) => item.months === months) ?? publishing?.options[0];
  if (!publishing || !option) return null;

  return (
    <section id="courses" className="bg-white pb-8 pt-16 sm:pb-10 sm:pt-20 lg:pt-24">
      <div className="container-custom">
        <Reveal>
        <div className="max-w-2xl">
          <h2 className="t-stagger-line t-stagger-line--1 font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[40px]">
            Courses you can start this term
          </h2>
          <p className="t-stagger-line t-stagger-line--2 mt-4 text-[17px] font-medium leading-7 text-copy">
            The programmes we are running, with the fees we charge today. A part payment opens the starter PDFs. Paying in full opens every PDF and your ID card.
          </p>
        </div>

        <div className="t-stagger-line t-stagger-line--3 mt-10 grid gap-5 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[28px] border border-line bg-white">
            <div className="relative aspect-[16/9]">
              <Image
                src="/image/illustration-lab.jpg"
                alt="Illustrated young adults learning at rows of desktop computers"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-[22px] font-bold text-ink">{publishing.title}</h3>
              <p className="mt-2 text-copy">{publishing.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                {publishing.options.length > 1 ? (
                  <DurationToggle options={publishing.options.map((item) => item.months)} value={option.months} onChange={setMonths} />
                ) : (
                  <span className="rounded-full bg-paper px-3 py-1 text-sm font-semibold text-ink">{option.months} months</span>
                )}
                <p className="font-display text-[28px] font-extrabold text-ink">
                  <Naira value={option.feeNaira} />
                </p>
              </div>
              <p className="mt-4 text-sm font-medium text-copy">
                Partial payment opens starter PDFs. Full payment opens every PDF and your ID card.
              </p>
              <Link
                href={`/enrol?course=${publishing.slug}&months=${option.months}`}
                className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97]"
              >
                Enrol in this course
              </Link>
            </div>
          </article>

          <div className="grid gap-5">
            {courses.slice(1).map((course) => {
              const only = course.options[0];
              return (
                <article key={course.slug} className="rounded-[28px] border border-line bg-paper p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[20px] font-bold text-ink">{course.title}</h3>
                      <p className="mt-1 max-w-md text-sm font-medium leading-6 text-copy">{course.summary}</p>
                    </div>
                    <p className="font-display text-2xl font-extrabold text-ink">
                      <Naira value={only.feeNaira} />
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">{only.months} months</span>
                    <Link href={`/enrol?course=${course.slug}&months=${only.months}`} className="text-sm font-bold text-blurple">
                      Enrol in this course
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
