"use client";

import { useEditorStore } from "@/store/editorStore";
import { buildSvgString } from "@/lib/export/svg";
import { exportPdf } from "@/lib/export/pdf";
import { safeFilename } from "@/lib/transforms";
import { saveAs } from "file-saver";

/** Round 5/9 — sticky export dock so the job (export) stays obvious after compose. */
export function ExportDock() {
  const doc = useEditorStore((s) => s.document);
  const showTemplates = useEditorStore((s) => s.showTemplates);
  const setStatus = useEditorStore((s) => s.setStatus);
  const setMissingFonts = useEditorStore((s) => s.setMissingFonts);
  const bumpExport = useEditorStore((s) => s.bumpExport);

  if (showTemplates || doc.elements.length === 0) return null;

  const handleExportSvg = async () => {
    setStatus("exporting", "Building SVG…");
    try {
      const { svg, missingFonts } = await buildSvgString(doc);
      setMissingFonts(missingFonts);
      if (missingFonts.length) {
        const proceed = window.confirm(
          `Missing fonts may not embed correctly:\n${missingFonts.join(", ")}\n\nExport anyway?`
        );
        if (!proceed) {
          setStatus("idle", "");
          return;
        }
      }
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      saveAs(blob, safeFilename(doc.meta.name, "svg"));
      await bumpExport();
    } catch (e) {
      setStatus(
        "error",
        e instanceof Error ? e.message : "SVG export failed",
        true
      );
    }
  };

  const handleExportPdf = async () => {
    setStatus("exporting", "Building PDF…");
    try {
      const { blob, missingFonts } = await exportPdf(doc);
      setMissingFonts(missingFonts);
      if (missingFonts.length) {
        const proceed = window.confirm(
          `Missing fonts may fall back in PDF:\n${missingFonts.join(", ")}\n\nExport anyway?`
        );
        if (!proceed) {
          setStatus("idle", "");
          return;
        }
      }
      saveAs(blob, safeFilename(doc.meta.name, "pdf"));
      await bumpExport();
    } catch (e) {
      setStatus(
        "error",
        e instanceof Error ? e.message : "PDF export failed",
        true
      );
    }
  };

  return (
    <div
      className="export-dock absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-sm border border-ink-border-strong bg-ink-surface px-3 py-2"
      data-testid="export-dock"
    >
      <div className="mr-1 hidden sm:block">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          Ready to pull
        </p>
        <p className="text-xs text-ink-text">
          {doc.canvas.label} · {doc.canvas.width}×{doc.canvas.height}
        </p>
      </div>
      <button
        type="button"
        className="rounded-sm border border-ink-border-strong bg-ink-panel px-3 py-2 text-xs font-medium text-ink-text hover:border-ink-lime-dim"
        onClick={() => void handleExportSvg()}
        data-testid="dock-export-svg"
      >
        SVG
      </button>
      <button
        type="button"
        className="rounded-sm bg-ink-lime px-4 py-2 text-xs font-semibold text-ink-bg hover:bg-ink-lime-dim"
        onClick={() => void handleExportPdf()}
        data-testid="dock-export-pdf"
      >
        Export PDF
      </button>
    </div>
  );
}
