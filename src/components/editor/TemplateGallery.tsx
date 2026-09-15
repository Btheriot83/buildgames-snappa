"use client";

import { useEffect, useState } from "react";
import { CANVAS_PRESETS, STARTER_TEMPLATES } from "@/lib/templates/starters";
import { useEditorStore } from "@/store/editorStore";
import { TiltCard } from "./TiltCard";

const THUMBS: Record<string, string> = {
  "launch-poster": "/assets/texture-square.jpg",
  "quote-card": "/assets/texture-square.jpg",
  "story-countdown": "/assets/texture-story.jpg",
  "event-flyer": "/assets/empty-desk.jpg",
  "product-drop": "/assets/texture-wide.jpg",
  "shop-hours": "/assets/texture-square.jpg",
  "story-offer": "/assets/texture-story.jpg",
};

export function TemplateGallery() {
  const show = useEditorStore((s) => s.showTemplates);
  const loadTemplate = useEditorStore((s) => s.loadTemplate);
  const setShowTemplates = useEditorStore((s) => s.setShowTemplates);
  const newBlank = useEditorStore((s) => s.newBlank);
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
    setOpen(false);
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-ink-bg p-4 sm:p-6"
      data-testid="template-gallery"
    >
      <div
        className="t-panel-slide relative max-h-[92vh] w-full max-w-5xl overflow-hidden border border-ink-border-strong bg-ink-surface"
        data-open={open ? "true" : "false"}
        style={{ ["--panel-translate-y" as string]: "24px" }}
      >
        {/* Job billboard — ≤3s: compose fixed-size → export */}
        <div className="job-tape flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-ink-border-strong bg-ink-lime px-4 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-bg sm:px-6">
          <span>Compose graphic</span>
          <span aria-hidden>→</span>
          <span>Fixed size</span>
          <span aria-hidden>→</span>
          <span>Export SVG / PDF</span>
          <span className="ml-auto hidden opacity-80 sm:inline">
            No account · local ink
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 border-b border-ink-border-strong px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="ui-label text-ink-lime">
              Night Press · start
            </p>
            <h2 className="mark-word mt-1 text-4xl tracking-tight text-ink-text sm:text-5xl">
              Compose. Export.
            </h2>
            <p className="ui-body mt-2 max-w-xl text-ink-muted">
              Pick a fixed social size, edit type on the sheet, download SVG or
              PDF. Nothing leaves this browser unless you export it.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary shrink-0"
            onClick={() => setShowTemplates(false)}
          >
            Close
          </button>
        </div>

        <div className="grid max-h-[52vh] grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
          {STARTER_TEMPLATES.map((t, i) => {
            const isTall =
              t.id === "story-countdown" || t.id === "story-offer";
            const isWide = t.id === "product-drop";
            return (
              <TiltCard
                key={t.id}
                testId={`template-${t.id}`}
                onClick={() => loadTemplate(t.id)}
                className="template-card"
              >
                <div
                  className={`relative w-full overflow-hidden bg-ink-panel ${
                    isTall ? "h-36" : isWide ? "h-24" : "h-28"
                  }`}
                  style={{
                    backgroundImage: `url("${THUMBS[t.id] || "/assets/texture-square.jpg"}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  <span className="absolute left-2 top-2 bg-ink-bg px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-lime">
                    {t.sizeLabel}
                  </span>
                  {/* Flat bottom plate — no gradient scrim */}
                  <div className="absolute inset-x-0 bottom-0 bg-ink-bg px-2 pb-2 pt-3">
                    <span className="mb-1 inline-block bg-ink-lime px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-bg">
                      {t.category}
                    </span>
                    <p className="card-title whitespace-pre-line text-lg leading-tight sm:text-xl">
                      {t.previewHeadline}
                    </p>
                    {t.previewSub && (
                      <p className="mt-0.5 font-mono text-[11px] font-medium text-ink-amber">
                        {t.previewSub}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <span className="card-title text-[16px] group-hover:text-ink-lime">
                    {t.name}
                  </span>
                  <span className="ui-caption leading-snug">
                    {t.blurb}
                  </span>
                </div>
              </TiltCard>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-ink-border-strong px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-label">
              Blank + size
            </span>
            {CANVAS_PRESETS.slice(0, 4).map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn-chip"
                onClick={() => {
                  setCanvasSize(p.width, p.height, p.label);
                  newBlank();
                  setShowTemplates(false);
                }}
              >
                {p.label.replace("Instagram ", "IG ").replace("LinkedIn / ", "")}
              </button>
            ))}
            <button
              type="button"
              className="btn-secondary border-ink-lime-dim text-ink-lime"
              onClick={() => {
                newBlank();
                setShowTemplates(false);
              }}
              data-testid="blank-canvas"
            >
              Blank sheet
            </button>
          </div>
          <span className="ui-caption font-mono">
            Real shop copy · +1 drop per template · then Export PDF
          </span>
        </div>
      </div>
    </div>
  );
}
