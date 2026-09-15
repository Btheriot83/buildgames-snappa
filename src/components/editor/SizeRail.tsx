"use client";

import { CANVAS_PRESETS } from "@/lib/templates/starters";
import { useEditorStore } from "@/store/editorStore";

export function SizeRail() {
  const doc = useEditorStore((s) => s.document);
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);
  const showTemplates = useEditorStore((s) => s.showTemplates);

  if (showTemplates) return null;

  const fit = () => {
    const target = 0.62;
    setViewport({ zoom: target, panX: 48, panY: 36 });
  };

  return (
    <div
      className="absolute left-3 top-3 z-10 flex max-w-[min(100%,48rem)] flex-wrap items-center gap-1 rounded-sm border border-ink-border bg-ink-surface px-2 py-1.5"
      data-testid="size-rail"
    >
      <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-lime">
        Size
      </span>
      {CANVAS_PRESETS.map((p) => {
        const active =
          doc.canvas.width === p.width && doc.canvas.height === p.height;
        return (
          <button
            key={p.label}
            type="button"
            data-active={active ? "true" : "false"}
            className={`rounded-sm px-2 py-1 text-[10px] ${
              active
                ? "bg-ink-lime text-ink-bg"
                : "text-ink-muted hover:bg-ink-panel hover:text-ink-text"
            }`}
            onClick={() => setCanvasSize(p.width, p.height, p.label)}
            title={`${p.width}×${p.height}`}
          >
            {p.label.replace("Instagram ", "IG ").replace("LinkedIn / ", "")}
            <span
              className={`ml-1 font-mono ${active ? "opacity-70" : "opacity-50"}`}
            >
              {p.width}×{p.height}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        className="ml-1 rounded-sm border border-ink-border px-2 py-1 text-[10px] text-ink-muted hover:text-ink-text"
        onClick={fit}
        title={`Zoom ${Math.round(viewport.zoom * 100)}%`}
      >
        Fit
      </button>
    </div>
  );
}
