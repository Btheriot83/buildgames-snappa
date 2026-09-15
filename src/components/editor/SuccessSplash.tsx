"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";

export function SuccessSplash() {
  const status = useEditorStore((s) => s.status);
  const message = useEditorStore((s) => s.statusMessage);
  const [show, setShow] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [label, setLabel] = useState("Exported");

  useEffect(() => {
    if (status === "success" && /export|ink|Loaded|downloaded|PDF|SVG|JSON/i.test(message)) {
      setLabel(message || "Exported");
      setShow(true);
      setCheckIn(false);
      setToastOpen(false);
      const frame = requestAnimationFrame(() => {
        setCheckIn(true);
        setToastOpen(true);
      });
      const t = setTimeout(() => {
        setToastOpen(false);
        setShow(false);
        setCheckIn(false);
      }, 1600);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }
  }, [status, message]);

  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center gap-6">
      <span
        className="t-success-check text-ink-lime"
        data-state={checkIn ? "in" : "out"}
        aria-hidden="true"
      >
        <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" opacity="0.35" />
          <path
            d="M14 25.5 L21 32.5 L34 16.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <div
        className={`t-toast rounded-sm border border-ink-border bg-ink-panel px-4 py-2 font-mono text-xs text-ink-lime shadow-lg ${toastOpen ? "is-open" : ""}`}
        role="status"
      >
        {label}
      </div>
    </div>
  );
}
