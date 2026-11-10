"use client";

import { whatsappHref } from "@/lib/landing";
import { usePathname } from "next/navigation";

export function WhatsAppFloat() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp us about our services"
      className="fixed bottom-5 right-5 z-40 size-12 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-[0.97]"
    >
      <img src="/icon/whatsapp.png" alt="" className="size-full object-contain drop-shadow-[0_8px_16px_rgba(8,10,36,0.28)]" />
    </a>
  );
}
