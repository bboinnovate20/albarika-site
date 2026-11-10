"use client";

import { Reveal } from "@/components/landing/Reveal";
import { services } from "@/lib/landing";
import type { MessageInput } from "@/lib/message-schema";
import { ClipboardList, FileText, FolderKanban, MonitorSmartphone, Printer } from "lucide-react";

const icons = [Printer, ClipboardList, MonitorSmartphone, FileText, FolderKanban];

function requestService(topic: MessageInput["topic"]) {
  window.dispatchEvent(new CustomEvent("albarika-topic", { detail: topic }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white pb-20 pt-4 sm:pb-24 sm:pt-6">
      <div className="container-custom">
        <Reveal>
        <div className="max-w-2xl">
          <h2 className="t-stagger-line t-stagger-line--1 font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[40px]">
            Our Services
          </h2>
          <p className="t-stagger-line t-stagger-line--2 mt-4 text-[17px] font-medium leading-7 text-copy">
            Training is one part of the institute. The same desk handles documents, exams, repairs and projects.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index];
            return (
              <article
                key={service.title}
                className="t-stagger-line flex flex-col rounded-[28px] border border-line bg-paper p-6"
                style={{ transitionDelay: `calc(var(--stagger-stagger) * ${index + 2})` }}
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-ink">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-6 text-copy">{service.summary}</p>
                <div className="mt-auto pt-5">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{service.timing}</span>
                  <button
                    type="button"
                    onClick={() => requestService(service.topic)}
                    className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1e2f7a] active:scale-[0.97]"
                  >
                    Request this service
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
