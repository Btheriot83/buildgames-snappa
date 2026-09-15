"use client";

import { STARTER_TEMPLATES, inkWashDataUrl } from "@/lib/templates/starters";
import { useEditorStore } from "@/store/editorStore";

export function TemplateGallery() {
  const show = useEditorStore((s) => s.showTemplates);
  const loadTemplate = useEditorStore((s) => s.loadTemplate);
  const setShowTemplates = useEditorStore((s) => s.setShowTemplates);
  const newBlank = useEditorStore((s) => s.newBlank);

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[#0c0f0d]/88 p-6 backdrop-blur-[2px]"
      data-testid="template-gallery"
    >
      <div className="ink-grain relative max-h-[90vh] w-full max-w-4xl overflow-hidden border border-ink-border bg-ink-surface animate-ink-in">
        <div className="flex items-end justify-between border-b border-ink-border px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-lime">
              Start here
            </p>
            <h2
              className="mt-1 text-3xl font-bold tracking-tight text-ink-text"
              style={{ fontFamily: "var(--font-syne), Syne, sans-serif" }}
            >
              Pick a layout. Ship tonight.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Fixed social sizes, local assets, SVG & PDF export. Nothing leaves
              this browser unless you download it.
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
            <button
              key={t.id}
              type="button"
              className="template-card group flex flex-col overflow-hidden border border-ink-border bg-ink-panel text-left"
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => loadTemplate(t.id)}
              data-testid={`template-${t.id}`}
            >
              <div
                className="relative h-28 w-full overflow-hidden"
                style={{
                  backgroundImage: `url("${inkWashDataUrl(400, 160, i % 2 === 0 ? "#9FE870" : "#E8A54B", "#121812")}")`,
                  backgroundSize: "cover",
                }}
              >
                <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-bg bg-ink-lime px-1.5 py-0.5">
                  {t.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span
                  className="text-sm font-semibold text-ink-text group-hover:text-ink-lime"
                  style={{ fontFamily: "var(--font-syne), Syne, sans-serif" }}
                >
                  {t.name}
                </span>
                <span className="text-xs leading-snug text-ink-muted">
                  {t.blurb}
                </span>
              </div>
            </button>
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
            +1 ink drop per template
          </span>
        </div>
      </div>
    </div>
  );
}
