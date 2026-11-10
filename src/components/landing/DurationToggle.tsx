"use client";

import { useLayoutEffect, useRef } from "react";

export function DurationToggle({
  options,
  value,
  onChange,
}: {
  options: number[];
  value: number;
  onChange: (months: number) => void;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const ready = useRef(false);

  const move = (animate: boolean) => {
    const root = bar.current;
    const knob = pill.current;
    if (!root || !knob) return;
    const tab = root.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!tab) return;
    if (!animate) knob.style.transition = "none";
    knob.style.transform = `translateX(${tab.offsetLeft}px)`;
    knob.style.width = `${tab.offsetWidth}px`;
    if (!animate) {
      void knob.offsetWidth;
      knob.style.transition = "";
    }
  };

  useLayoutEffect(() => {
    move(ready.current);
    ready.current = true;
    const onResize = () => move(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value]);

  const select = (months: number) => onChange(months);

  return (
    <div className="t-tabs" role="tablist" aria-label="Course length" ref={bar}>
      <span className="t-tabs-pill" aria-hidden ref={pill} />
      {options.map((months) => (
        <button
          key={months}
          type="button"
          className="t-tab"
          role="tab"
          aria-selected={value === months}
          onClick={() => select(months)}
        >
          {months} months
        </button>
      ))}
    </div>
  );
}
