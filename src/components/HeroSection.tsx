"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

const cards = [
  {
    src: "/image/illustration-services.jpg",
    alt: "Illustrated students checking a printed flyer beside a design on screen",
    className: "left-[0%] top-[16%] z-10 w-[46%] sm:left-[2%] sm:w-[38%]",
    rotate: 6,
  },
  {
    src: "/image/computer.jpg",
    alt: "A computer laboratory with rows of desktop computers",
    className: "left-1/2 top-0 z-20 w-[52%] -translate-x-1/2 sm:w-[42%]",
    rotate: 0,
  },
  {
    src: "/image/illustration-mentorship.jpg",
    alt: "Illustrated instructor guiding a student in hijab at a computer",
    className: "right-[0%] top-[12%] z-10 w-[46%] sm:right-[2%] sm:w-[38%]",
    rotate: -6,
  },
];

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 48, damping: 16, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 48, damping: 16, mass: 0.7 });

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!reduce) return;
    pointerX.set(0);
    pointerY.set(0);
  }, [reduce, pointerX, pointerY]);

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      className="relative overflow-hidden bg-canvas"
      onPointerMove={followPointer}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <HeroFloaters x={x} y={y} />
      <div className="container-custom relative z-10 pb-0 pt-8 text-center sm:pt-12 md:pb-6 md:pt-16">
        <div className={cn("t-stagger mx-auto max-w-[1040px]", shown && "is-shown")}>
          <h1 className="t-stagger-line t-stagger-line--1 font-display text-[1.5rem] font-black normal-case leading-[1.08] tracking-[-0.02em] text-ink sm:text-[1.7rem] md:text-[clamp(1.85rem,3.5vw,3.15rem)] md:leading-[1.04]">
            Providing Quality
            <br />
            Computing Services
          </h1>
          <p className="t-stagger-line t-stagger-line--2 mx-auto mt-5 max-w-[640px] text-[17px] font-medium leading-[26px] text-copy sm:text-[19px] sm:leading-7">
              Practical IT training for students. Reliable IT services for everyone.
          </p>
          <div className="t-stagger-line t-stagger-line--3 mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#courses"
              className="rounded-full bg-ink px-6 py-3.5 text-base font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97]"
            >
              Enrol in a course
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-base font-semibold text-ink transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-paper active:scale-[0.97]"
            >
              Explore our services
              <img src="/icon/right-chevron.svg" alt="" className="size-5" />
            </a>
          </div>
        </div>

        <div className="-mx-4 mt-7 max-w-none sm:-mx-6 md:mx-auto md:mt-16 md:max-w-[1080px]">
          <div className={cn("md:hidden", reduce ? "overflow-x-auto" : "overflow-hidden")}>
            <div className={cn("flex w-max", !reduce && "hero-card-marquee")}>
              {(reduce ? [0] : [0, 1]).map((copy) => (
                <div key={copy} className="flex" aria-hidden={copy === 1}>
                  {cards.map((card) => (
                    <div key={`${copy}-${card.src}`} className="relative h-[148px] w-[78vw] shrink-0 overflow-hidden bg-white">
                      <Image src={card.src} alt={card.alt} fill className="object-cover" sizes="78vw" priority={copy === 0 && card.rotate === 0} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden h-[360px] md:block lg:h-[420px]">
          {cards.map((card, index) => {
            const lifted = active === index;
            const neighbour = active !== null && !lifted;
            return (
              <div key={card.src} className={cn("absolute", card.className)} style={{ zIndex: lifted ? 30 : undefined }}>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: 1,
                    y: lifted ? -12 : neighbour ? 10 : 0,
                    rotate: lifted || reduce ? 0 : card.rotate,
                    scale: lifted ? 1.02 : neighbour ? 0.98 : 1,
                  }}
                  transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.6, bounce: 0.2 }}
                  onHoverStart={() => setActive(index)}
                  onHoverEnd={() => setActive(null)}
                >
                  <div className="relative aspect-[38/34] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_48px_-16px_rgba(20,33,91,0.22)]">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        lifted && !reduce && "scale-105",
                      )}
                      sizes="(min-width: 1024px) 420px, 46vw"
                      priority={index === 1}
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 overflow-hidden sm:h-14 lg:h-16">
        <div className="absolute left-1/2 top-0 h-[880px] w-[240%] -translate-x-1/2 rounded-[100%] bg-white" />
      </div>
    </section>
  );
}

function floaterStyle(rotate: number, duration: number, delay: number): CSSProperties {
  return {
    ["--r" as string]: `${rotate}deg`,
    ["--floater-dur" as string]: `${duration}s`,
    ["--floater-delay" as string]: `${delay}s`,
  };
}

function HeroFloaters({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <FloaterShift x={x} y={y} depth={18} className="left-[-28px] top-[34%] sm:left-[-12px]">
        <div className="floater size-16 rounded-[40px] bg-[#F4A49A] sm:size-20" style={floaterStyle(12, 8, 0)} />
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={26} className="right-[1%] top-[2%] hidden lg:block">
        <svg className="floater size-14" style={floaterStyle(-18, 9, -2)} viewBox="0 0 100 90">
          <polygon points="50,6 96,84 4,84" fill="#F2B544" strokeLinejoin="round" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={22} className="left-[8%] top-[46%] hidden xl:block">
        <svg className="floater size-16" style={floaterStyle(8, 7, -1)} viewBox="0 0 100 100">
          <polygon points="50,4 93,35 77,90 23,90 7,35" fill="#A9D3F2" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={30} className="right-[12%] top-[30%] hidden xl:block">
        <svg className="floater size-28" style={floaterStyle(20, 8.5, -3)} viewBox="0 0 120 70">
          <path d="M8 62a52 52 0 0 1 104 0Z" fill="#C7C2F5" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={36} className="right-[-18px] top-[30%] hidden sm:block xl:right-2">
        <svg className="floater size-16 xl:size-[72px]" style={floaterStyle(8, 7.5, -1.5)} viewBox="0 0 120 110">
          <rect x="4" y="4" width="112" height="76" rx="14" fill="#A9D3F2" />
          <rect x="16" y="16" width="88" height="52" rx="6" fill="#7FB8E6" />
          <rect x="50" y="78" width="20" height="18" fill="#A9D3F2" />
          <rect x="30" y="94" width="60" height="12" rx="6" fill="#A9D3F2" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={32} className="left-[6%] top-[40%] hidden xl:block">
        <svg className="floater" width="72" height="90" style={floaterStyle(-10, 6.5, -2)} viewBox="0 0 84 104">
          <path d="M14 2h38l30 30v58a12 12 0 0 1-12 12H14A12 12 0 0 1 2 90V14A12 12 0 0 1 14 2z" fill="#F2B544" />
          <path d="M52 2v20a10 10 0 0 0 10 10h20z" fill="#D99A2B" />
          <rect x="16" y="50" width="52" height="8" rx="4" fill="#D99A2B" />
          <rect x="16" y="66" width="40" height="8" rx="4" fill="#D99A2B" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={28} className="left-[2%] top-[34%] hidden lg:block">
        <svg className="floater size-14" style={floaterStyle(18, 9, -4)} viewBox="0 0 70 104">
          <rect x="2" y="2" width="66" height="100" rx="33" fill="#C7C2F5" />
          <rect x="32.5" y="2" width="5" height="40" fill="#A79FEA" />
          <rect x="29" y="14" width="12" height="20" rx="6" fill="#A79FEA" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={34} className="right-[-10px] top-[58%] hidden xl:block">
        <svg className="floater" width="84" height="64" style={floaterStyle(-8, 6, -1)} viewBox="0 0 96 72">
          <rect width="96" height="72" rx="18" fill="#F4A49A" />
          <path d="M34 22 20 36l14 14M62 22l14 14-14 14M53 18 43 54" stroke="#E07B6E" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={24} className="right-[18%] top-[36%] hidden xl:block">
        <svg className="floater" width="52" height="64" style={floaterStyle(0, 7, -2.5)} viewBox="0 0 64 80">
          <path d="M6 4 58 44 34 48 46 72 36 76 24 52 6 66z" fill="#F2B544" />
        </svg>
      </FloaterShift>
      <FloaterShift x={x} y={y} depth={20} className="right-[-2%] bottom-[18%] hidden sm:block">
        <svg className="floater size-16" style={floaterStyle(-10, 8, -3)} viewBox="0 0 100 100">
          <polygon points="50,6 90,32 76,84 24,84 10,32" fill="#C7C2F5" />
        </svg>
      </FloaterShift>
    </div>
  );
}

function FloaterShift({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className: string;
  children: ReactNode;
}) {
  const shiftX = useTransform(x, (value) => value * depth);
  const shiftY = useTransform(y, (value) => value * depth);
  return (
    <motion.div className={cn("absolute", className)} style={{ x: shiftX, y: shiftY }}>
      {children}
    </motion.div>
  );
}
