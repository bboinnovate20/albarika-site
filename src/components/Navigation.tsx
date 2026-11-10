"use client";

import { institute } from "@/lib/landing";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#courses", label: "Courses" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact us" },
];

const menuItems = [
  ...links,
  { href: "/portal/login", label: "Student login" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const panel = {
  open: { opacity: 1, transition: { duration: 0.28, ease, when: "beforeChildren" } },
  closed: { opacity: 0, transition: { duration: 0.2, ease, when: "afterChildren" } },
};

const list = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const item = {
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  closed: { opacity: 0, y: 16, transition: { duration: 0.2, ease } },
};

export default function Navigation() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        open || scrolled ? "border-b border-line bg-canvas" : "border-b border-transparent bg-canvas/80",
      )}
    >
      <div className="container-custom relative z-50 flex h-[78px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={close}>
          <Image
            src="/image/logo.jpeg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold tracking-tight text-ink">{institute.short}</span>
            <span className="block text-[12px] font-medium text-copy">{institute.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 whitespace-nowrap lg:flex" aria-label="Page">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 whitespace-nowrap lg:flex">
          <Link href="/portal/login" className="text-sm font-semibold text-ink">
            Student login
          </Link>
          <Link
            href="/enrol"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97]"
          >
            Enrol
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              className="grid place-items-center"
              initial={reduce ? false : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}
            >
              {open ? <X /> : <Menu />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col bg-canvas px-6 pb-8 pt-[102px] lg:hidden"
            aria-label="Page"
            initial={reduce ? false : "closed"}
            animate="open"
            exit="closed"
            variants={reduce ? undefined : panel}
          >
            <motion.ul className="flex flex-1 flex-col justify-center" variants={reduce ? undefined : list}>
              {menuItems.map((link) => (
                <motion.li key={link.href} variants={reduce ? undefined : item}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="block py-3 text-lg font-medium text-ink" onClick={close}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="block py-3 text-lg font-medium text-ink" onClick={close}>
                      {link.label}
                    </a>
                  )}
                </motion.li>
              ))}
              <motion.li variants={reduce ? undefined : item} className="mt-6">
                <Link
                  href="/enrol"
                  className="block rounded-full bg-ink px-4 py-3.5 text-center text-base font-semibold text-white"
                  onClick={close}
                >
                  Enrol
                </Link>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
