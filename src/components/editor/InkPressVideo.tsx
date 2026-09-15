"use client";

import { useEditorStore } from "@/store/editorStore";

/** Tech 5 — looping matted press-bench clip behind empty canvas (not a CSS blob). */
export function InkPressVideo() {
  const doc = useEditorStore((s) => s.document);
  const showTemplates = useEditorStore((s) => s.showTemplates);
  if (showTemplates || doc.elements.length > 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
      data-testid="ink-press-video"
      aria-hidden
    >
      <div className="relative max-h-[70%] max-w-[min(520px,70%)] overflow-hidden rounded-sm border border-black/10 shadow-2xl press-ink-settle">
        <video
          className="press-video-matte block h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/empty-desk.jpg"
        >
          <source src="/assets/press-loop.mp4" type="video/mp4" />
        </video>
        <div className="press-lamp pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-amber-200/20" />
        <p className="absolute bottom-3 left-3 right-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1f1b]/80">
          Blank sheet on the press — pick a size above or open Templates
        </p>
      </div>
      {/* registration marks */}
      <span className="press-reg-mark absolute left-8 top-8 h-3 w-3 border border-ink-lime/70" />
      <span className="press-reg-mark absolute right-8 top-8 h-3 w-3 border border-ink-lime/70" />
      <span className="press-reg-mark absolute bottom-8 left-8 h-3 w-3 border border-ink-lime/70" />
      <span className="press-reg-mark absolute bottom-8 right-8 h-3 w-3 border border-ink-lime/70" />
    </div>
  );
}
