"use client";

import { useEffect, useRef, useState } from "react";

/** Number pop-in for ink drops / export counts. */
export function InkDropCounter({
  value,
  suffix,
}: {
  value: number;
  suffix?: string;
}) {
  const [digits, setDigits] = useState(() => String(value).split(""));
  const [animating, setAnimating] = useState(true);
  const groupRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    const el = groupRef.current;
    setAnimating(false);
    setDigits(String(value).split(""));
    requestAnimationFrame(() => {
      if (el) void el.offsetHeight;
      setAnimating(true);
    });
  }, [value]);

  return (
    <span className="inline-flex items-baseline gap-1">
      <span
        ref={groupRef}
        className={`t-digit-group ${animating ? "is-animating" : ""}`}
        aria-label={`${value}${suffix ? ` ${suffix}` : ""}`}
      >
        {digits.map((ch, i) => (
          <span
            key={`${ch}-${i}-${value}`}
            className="t-digit"
            data-stagger={
              i === digits.length - 2 ? "1" : i === digits.length - 1 ? "2" : undefined
            }
          >
            {ch}
          </span>
        ))}
      </span>
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
