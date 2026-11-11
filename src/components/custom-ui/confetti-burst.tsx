"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Physics confetti that bursts out of the wrapped element, flutters down,
 * and lands on top of the element and on the floor of its container.
 *
 * Usage:
 *   <ConfettiBurst><Button>Submit</Button></ConfettiBurst>            // fires on click
 *   <ConfettiBurst ref={c} fireOnClick={false}>...</ConfettiBurst>   // c.current?.fire()
 *   <ConfettiBurst container={stageRef}>...</ConfettiBurst>          // confined to a box
 *                                                                     // (box must be position: relative)
 */

export type ConfettiHandle = { fire: (opts?: { count?: number }) => void };

type Props = {
  children: ReactNode;
  ref?: Ref<ConfettiHandle>;
  /** Fire automatically when the wrapped element is clicked. Default true. */
  fireOnClick?: boolean;
  /** Number of pieces per burst. Default 120. */
  count?: number;
  /** Confine the confetti to this element (it must be position: relative). Default: viewport. */
  container?: RefObject<HTMLElement | null>;
  colors?: string[];
  className?: string;
};

const DEFAULT_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];

const GRAVITY = 1400; // px/s²
const DRAG = 1.6; // air resistance per second
const TERMINAL = 260; // max fall speed (paper flutters, it doesn't drop)
const LINGER = 1200; // ms after everything settles before fading
const FADE = 500; // ms fade-out

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
  flip: number; // phase for the 3D "tumble" (width squash)
  vflip: number;
  color: string;
  /** null = airborne, "floor" = on container floor, number = x offset on the target */
  rest: null | "floor" | number;
};

export function ConfettiBurst({
  children,
  ref,
  fireOnClick = true,
  count = 120,
  container,
  colors = DEFAULT_COLORS,
  className,
}: Props) {
  const targetRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<Piece[]>([]);
  const raf = useRef<number | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(container?.current ?? document.body);
  }, [container]);

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const run = useCallback(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) return;
    const ctx = canvas.getContext("2d")!;
    let last = performance.now();
    let settledAt: number | null = null;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Keep the canvas sized to its box (handles resize mid-animation).
      const dpr = window.devicePixelRatio || 1;
      const box = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(box.width * dpr) || canvas.height !== Math.round(box.height * dpr)) {
        canvas.width = Math.round(box.width * dpr);
        canvas.height = Math.round(box.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);

      // Target rect in canvas space — read every frame so pieces follow it.
      const r = target.getBoundingClientRect();
      const tLeft = r.left - box.left;
      const tRight = r.right - box.left;
      const tTop = r.top - box.top;
      const floor = box.height;

      let airborne = 0;
      for (const p of pieces.current) {
        if (p.rest === null) {
          airborne++;
          const prevY = p.y;
          p.vy += GRAVITY * dt;
          p.vx -= p.vx * DRAG * dt;
          p.vy -= p.vy * DRAG * dt;
          if (p.vy > TERMINAL) p.vy = TERMINAL;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;
          p.flip += p.vflip * dt;

          // Side walls
          if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.4; }
          if (p.x > box.width) { p.x = box.width; p.vx = -Math.abs(p.vx) * 0.4; }

          // Land on top of the target while falling through its top edge
          if (p.vy > 0 && prevY <= tTop && p.y >= tTop && p.x > tLeft + 4 && p.x < tRight - 4) {
            p.y = tTop - p.h / 2;
            p.rest = p.x - tLeft;
            p.rot = (Math.random() - 0.5) * 0.6;
            p.flip = 0;
          } else if (p.y >= floor - p.h / 2) {
            p.y = floor - p.h / 2;
            p.rest = "floor";
            p.rot = (Math.random() - 0.5) * 0.8;
            p.flip = 0;
          }
        } else if (typeof p.rest === "number") {
          // Ride along with the target (scroll, layout shift)
          p.x = tLeft + p.rest;
          p.y = tTop - p.h / 2;
        }
      }

      if (airborne === 0 && settledAt === null) settledAt = now;
      const fadeT = settledAt === null ? 0 : (now - settledAt - LINGER) / FADE;
      const alpha = Math.max(0, Math.min(1, 1 - fadeT));

      ctx.globalAlpha = alpha;
      for (const p of pieces.current) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(Math.cos(p.flip), 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (alpha <= 0) {
        pieces.current = [];
        ctx.clearRect(0, 0, box.width, box.height);
        raf.current = null;
        return;
      }
      raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
  }, []);

  const fire = useCallback(
    (opts?: { count?: number }) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const canvas = canvasRef.current;
      const target = targetRef.current;
      if (!canvas || !target) return;

      const box = canvas.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const ox = r.left + r.width / 2 - box.left;
      const oy = r.top - box.top;
      const n = opts?.count ?? count;

      for (let i = 0; i < n; i++) {
        // Fan upward: mostly vertical, spread ±~55°
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        const speed = 500 + Math.random() * 700;
        pieces.current.push({
          x: ox + (Math.random() - 0.5) * r.width * 0.6,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: 4 + Math.random() * 4,
          h: 2 + Math.random() * 2,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 12,
          flip: Math.random() * Math.PI * 2,
          vflip: 6 + Math.random() * 10,
          color: colors[(Math.random() * colors.length) | 0],
          rest: null,
        });
      }
      // Restart the loop so a new burst resets the fade timer
      if (raf.current) cancelAnimationFrame(raf.current);
      run();
    },
    [count, colors, run],
  );

  useImperativeHandle(ref, () => ({ fire }), [fire]);

  const canvas = host
    ? createPortal(
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "pointer-events-none inset-0 z-50 h-full w-full",
            container ? "absolute" : "fixed",
          )}
        />,
        host,
      )
    : null;

  return (
    <span
      ref={targetRef}
      className={cn("inline-block", className)}
      onClickCapture={fireOnClick ? () => fire() : undefined}
    >
      {children}
      {canvas}
    </span>
  );
}
