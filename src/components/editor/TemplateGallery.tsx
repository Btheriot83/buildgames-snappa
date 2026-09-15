"use client";

import { useEffect, useState } from "react";
import { STARTER_TEMPLATES } from "@/lib/templates/starters";
import { useEditorStore } from "@/store/editorStore";
import { TiltCard } from "./TiltCard";

const THUMBS: Record<string, string> = {
  "launch-poster": "/assets/texture-square.jpg",
  "quote-card": "/assets/texture-square.jpg",
  "story-countdown": "/assets/texture-story.jpg",
  "event-flyer": "/assets/empty-desk.jpg",
  "product-drop": "/assets/texture-wide.jpg",
};

export function TemplateGallery() {
  const show = useEditorStore((s) => s.showTemplates);
  const loadTemplate = useEditorStore((s) => s.loadTemplate);
  const setShowTemplates = useEditorStore((s) => s.setShowTemplates);
  const newBlank = useEditorStore((s) => s.newBlank);
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
      className="absolute inset-0 z-40 flex items-center justify-center bg-[#0e1210]/92 p-6"
      data-testid="template-gallery"
    >
      <div
        className="t-panel-slide relative max-h-[90vh] w-full max-w-4xl overflow-hidden border border-ink-border bg-ink-surface"
        data-open={open ? "true" : "false"}
        style={{ ["--panel-translate-y" as string]: "24px" }}
      >
        <div className="flex items-end justify-between border-b border-ink-border px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-lime">
              Night Press · start
            </p>
            <h2 className="mark-word mt-1 text-3xl tracking-tight text-ink-text">
              Pick a size. Ink tonight.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Fixed social canvases, local assets, SVG & PDF. Nothing leaves this
              browser unless you download it.
            </p>
          </div>
          <button
            type="button"
            className="rounded-sm border border-ink-border px-3 py-1.5 text-xs text-ink-muted hover:text-ink-text"
            onClick={() => setShowTemplates(false)}
          >
            Close
          </button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto p-6 sm:grid-cols-2 lg:grid-cols-3">
          {STARTER_TEMPLATES.map((t, i) => (
            <TiltCard
              key={t.id}
              testId={`template-${t.id}`}
              onClick={() => loadTemplate(t.id)}
              className="template-card"
            >
              <div
                className="relative h-28 w-full overflow-hidden bg-ink-panel"
                style={{
                  backgroundImage: `url("${THUMBS[t.id] || "/assets/texture-square.jpg"}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <span className="absolute bottom-2 left-2 bg-ink-lime px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-bg">
                  {t.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="mark-word text-sm text-ink-text group-hover:text-ink-lime">
                  {t.name}
                </span>
                <span className="text-xs leading-snug text-ink-muted">
                  {t.blurb}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-ink-border px-6 py-3">
          <button
            type="button"
            className="text-xs text-ink-muted underline-offset-2 hover:text-ink-text hover:underline"
            onClick={() => {
              newBlank();
              setShowTemplates(false);
            }}
            data-testid="blank-canvas"
          >
            Start from blank canvas
          </button>
          <span className="font-mono text-[10px] text-ink-muted">
            Real ink textures · +1 drop per template
          </span>
        </div>
      </div>
    </div>
  );
}
