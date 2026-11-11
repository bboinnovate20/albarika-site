"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "albarika-prices-visible";
const eventName = "albarika-prices";

function storedVisible() {
  return window.localStorage.getItem(storageKey) !== "hidden";
}

export function usePricesVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(storedVisible());
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = () => {
    window.localStorage.setItem(storageKey, storedVisible() ? "hidden" : "visible");
    window.dispatchEvent(new Event(eventName));
  };

  return { visible, toggle };
}

export function PriceToggle({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const { visible, toggle } = usePricesVisible();
  const toneClass = tone === "paper" ? "border-white/30 text-white hover:border-white/60" : "border-line text-ink hover:border-ink/20";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={visible}
      aria-label={visible ? "Hide prices" : "Show prices"}
      className={`grid size-7 shrink-0 place-items-center rounded-md border transition-[border-color,scale] duration-150 ease-out active:scale-[0.96] ${toneClass}`}
    >
      {visible ? <Eye className="size-3.5" strokeWidth={2} /> : <EyeOff className="size-3.5" strokeWidth={2} />}
    </button>
  );
}

export function PriceText({ value }: { value: string }) {
  const { visible } = usePricesVisible();
  return <>{visible ? value : "••••"}</>;
}
