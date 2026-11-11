"use client";

import { ConfettiBurst, type ConfettiHandle } from "@/components/custom-ui/confetti-burst";
import { useEffect, useRef, type ReactNode } from "react";

const colors = ["#14215B", "#5865F2", "#FFC845", "#2563eb", "#f9b233", "#ffffff"];

export function StudentCardView({ children }: { children: ReactNode }) {
  const burst = useRef<ConfettiHandle>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => burst.current?.fire(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ConfettiBurst ref={burst} fireOnClick={false} downward count={140} colors={colors} className="mx-auto block w-full max-w-[420px]">
      {children}
    </ConfettiBurst>
  );
}
