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
      className="absolute left-3 top-3 z-10 flex max-w-[min(100%,48rem)] flex-wrap items-center gap-1.5 rounded-sm border-2 border-ink-border-strong bg-ink-surface px-2.5 py-2"
      data-testid="size-rail"
    >
      <span className="ui-label mr-1 text-ink-lime">
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
            className="btn-chip"
            onClick={() => setCanvasSize(p.width, p.height, p.label)}
            title={`${p.width}×${p.height}`}
          >
            {p.label.replace("Instagram ", "IG ").replace("LinkedIn / ", "")}
            <span
              className={`ml-1 font-mono text-[11px] ${active ? "text-ink-bg" : "text-ink-muted"}`}
            >
              {p.width}×{p.height}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        className="btn-secondary ml-1 min-h-[28px] px-2 text-[11px]"
        onClick={fit}
        title={`Zoom ${Math.round(viewport.zoom * 100)}%`}
      >
        Fit
      </button>
    </div>
  );
}
