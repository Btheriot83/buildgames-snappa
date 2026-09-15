"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";

export function SuccessSplash() {
  const status = useEditorStore((s) => s.status);
  const message = useEditorStore((s) => s.statusMessage);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status === "success" && /export|ink|Loaded/i.test(message)) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 700);
      return () => clearTimeout(t);
    }
  }, [status, message]);

  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      <div className="animate-ink-splash h-40 w-40 rounded-full border-2 border-ink-lime bg-ink-lime/20" />
    </div>
  );
}
