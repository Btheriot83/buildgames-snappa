"use client";

import {
  useCallback,
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

const MAX = 10;

export function TiltCard({
  children,
  className = "",
  onClick,
  testId,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  testId?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  const reset = useCallback(() => {
    const tilt = outerRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;
    tilt.classList.remove("is-hover");
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
  }, []);

  const track = useCallback((e: ReactPointerEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tilt = outerRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;
    const r = tilt.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    tilt.classList.add("is-hover");
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-ry", `${((px - 0.5) * MAX).toFixed(2)}deg`);
    card.style.setProperty("--tilt-rx", `${((0.5 - py) * MAX).toFixed(2)}deg`);
    card.style.setProperty("--tilt-gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-gy", `${(py * 100).toFixed(1)}%`);
  }, []);

  return (
    <div
      ref={outerRef}
      className="t-tilt h-full"
      onPointerMove={track}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <button
        type="button"
        ref={cardRef}
        data-testid={testId}
        className={`t-tilt-card group flex h-full w-full flex-col overflow-hidden border border-ink-border bg-ink-panel text-left ${className}`}
        onClick={onClick}
      >
        {children}
        <div className="t-tilt-glare" aria-hidden />
      </button>
    </div>
  );
}
