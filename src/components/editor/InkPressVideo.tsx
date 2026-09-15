"use client";

import { useEditorStore } from "@/store/editorStore";

/** Tech 5 — looping matted press-bench clip behind empty canvas (real photo/video, flat chrome). */
export function InkPressVideo() {
  const doc = useEditorStore((s) => s.document);
  const showTemplates = useEditorStore((s) => s.showTemplates);
  const setShowTemplates = useEditorStore((s) => s.setShowTemplates);
  if (showTemplates || doc.elements.length > 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
      data-testid="ink-press-video"
    >
      <div className="relative max-h-[70%] max-w-[min(520px,70%)] overflow-hidden rounded-sm border border-ink-border-strong press-ink-settle">
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
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#0e1210] bg-[#e7e1d4] px-4 py-3.5 text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#1a1f1b]">
            Blank sheet on the press
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#0e1210]">
            Pick a size above, or open Templates → Export PDF
          </p>
          <button
            type="button"
            className="pointer-events-auto btn-primary mt-3"
            onClick={() => setShowTemplates(true)}
          >
            Open templates
          </button>
        </div>
      </div>
      <span className="press-reg-mark absolute left-8 top-8 h-4 w-4 border-2 border-ink-lime" />
      <span className="press-reg-mark absolute right-8 top-8 h-4 w-4 border-2 border-ink-lime" />
      <span className="press-reg-mark absolute bottom-8 left-8 h-4 w-4 border-2 border-ink-lime" />
      <span className="press-reg-mark absolute bottom-8 right-8 h-4 w-4 border-2 border-ink-lime" />
    </div>
  );
}
