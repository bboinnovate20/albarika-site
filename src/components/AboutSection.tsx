import { Reveal } from "@/components/landing/Reveal";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="mt-10 bg-gradient-to-r from-hero-deep to-ink text-white">
      <Reveal className="grid items-stretch lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.95fr)] lg:gap-3">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:py-24 lg:pl-16 lg:pr-2">
          <div className="t-stagger-line t-stagger-line--1">
            <h2 className="font-script text-[clamp(3.5rem,6vw,5.25rem)] leading-[1.15] text-sun">Meet the Director</h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-white/80">Mrs. Kareem Khadijat</p>
          </div>
          <p className="t-stagger-line t-stagger-line--2 mt-4 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[44px]">
            One institute for learning and for getting the work done
          </p>
          <p className="t-stagger-line t-stagger-line--3 mt-5 text-base font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
            Chief Executive Officer. At Albarika Computer Institute, we are your complete computing partner. From professional training to documents, exam preparation and computer maintenance, the work happens under one roof.
          </p>
          <a
            href="#courses"
            className="t-stagger-line t-stagger-line--4 mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blurple px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#4752C4] active:scale-[0.97]"
          >
            Enrol in a course
            <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="t-from-right relative min-h-[460px] sm:min-h-[560px]">
          <div className="absolute -top-8 right-8 bottom-10 left-8 sm:right-10 lg:-top-10 lg:right-14 lg:bottom-12 lg:left-0">
            <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rounded-[28px] bg-sun" />
            <div className="relative h-full overflow-hidden rounded-[28px] border-[3px] border-sun bg-white">
              <Image
                src="/image/ceo.jpeg"
                alt="Mrs. Kareem Khadijat, Chief Executive Officer of Albarika Computer Institute"
                fill
                className="object-cover object-[center_18%]"
                sizes="(min-width: 1024px) 460px, 86vw"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
