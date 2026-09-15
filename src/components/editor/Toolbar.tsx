"use client";

import { useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { Tool } from "@/lib/types";
import { buildSvgString } from "@/lib/export/svg";
import { exportPdf } from "@/lib/export/pdf";
import { safeFilename } from "@/lib/transforms";
import { createId } from "@/lib/id";
import { saveAs } from "file-saver";
import { InkDropCounter } from "./InkDropCounter";

const TOOLS: { id: Tool; label: string; shortcut: string }[] = [
  { id: "select", label: "Select", shortcut: "V" },
  { id: "hand", label: "Hand", shortcut: "H" },
  { id: "text", label: "Text", shortcut: "T" },
  { id: "rect", label: "Rect", shortcut: "R" },
  { id: "circle", label: "Circle", shortcut: "O" },
  { id: "image", label: "Image", shortcut: "I" },
];

export function Toolbar() {
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const history = useEditorStore((s) => s.history);
  const future = useEditorStore((s) => s.future);
  const doc = useEditorStore((s) => s.document);
  const setStatus = useEditorStore((s) => s.setStatus);
  const setMissingFonts = useEditorStore((s) => s.setMissingFonts);
  const bumpExport = useEditorStore((s) => s.bumpExport);
  const exportPortableJson = useEditorStore((s) => s.exportPortableJson);
  const importProject = useEditorStore((s) => s.importProject);
  const setShowTemplates = useEditorStore((s) => s.setShowTemplates);
  const inkDrops = useEditorStore((s) => s.inkDrops);
  const exportsCount = useEditorStore((s) => s.exportsCount);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);
  const addElement = useEditorStore((s) => s.addElement);
  const imgRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<HTMLInputElement>(null);

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

  const handleExportJson = () => {
    const portable = exportPortableJson();
    const blob = new Blob([JSON.stringify(portable, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, safeFilename(doc.meta.name, "json"));
    setStatus("success", "Project JSON downloaded");
  };

  const onImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const result = importProject(raw);
      if (!result.ok) {
        setStatus("error", result.error ?? "Import failed", true);
      }
    } catch {
      setStatus("error", "Could not parse project JSON.", true);
    }
  };

  const onImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("error", "Only image files are supported.", true);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus("error", "Image must be under 8MB.", true);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      addElement({
        id: createId("el"),
        type: "image",
        name: file.name.slice(0, 40),
        x: 80,
        y: 80,
        width: 480,
        height: 480,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        parentId: null,
        src,
        objectFit: "cover",
      });
      setTool("select");
    };
    reader.onerror = () =>
      setStatus("error", "Could not read image file.", true);
    reader.readAsDataURL(file);
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-ink-border bg-ink-surface px-3">
      <div className="mr-1 flex items-center gap-2 border-r border-ink-border pr-3">
        <span
          className="text-lg font-bold tracking-tight text-ink-lime"
          style={{ fontFamily: "var(--font-syne), Syne, sans-serif" }}
        >
          Forge Ink
        </span>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink-muted sm:inline">
          local studio
        </span>
      </div>

      <div className="flex items-center gap-0.5">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={`${t.label} (${t.shortcut})`}
            data-active={tool === t.id}
            className="tool-btn rounded-sm px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:bg-ink-panel hover:text-ink-text"
            onClick={() => {
              if (t.id === "image") {
                imgRef.current?.click();
                return;
              }
              setTool(t.id);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-2 h-5 w-px bg-ink-border" />

      <button
        type="button"
        className="rounded-sm px-2 py-1.5 text-xs text-ink-muted hover:bg-ink-panel hover:text-ink-text disabled:opacity-30"
        disabled={history.length === 0}
        onClick={undo}
      >
        Undo
      </button>
      <button
        type="button"
        className="rounded-sm px-2 py-1.5 text-xs text-ink-muted hover:bg-ink-panel hover:text-ink-text disabled:opacity-30"
        disabled={future.length === 0}
        onClick={redo}
      >
        Redo
      </button>

      <div className="mx-2 flex items-center gap-1">
        <button
          type="button"
          className="rounded-sm px-2 py-1 text-xs text-ink-muted hover:bg-ink-panel"
          onClick={() =>
            setViewport({ zoom: Math.max(0.15, viewport.zoom / 1.15) })
          }
        >
          −
        </button>
        <span className="w-12 text-center font-mono text-[11px] text-ink-muted">
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          type="button"
          className="rounded-sm px-2 py-1 text-xs text-ink-muted hover:bg-ink-panel"
          onClick={() =>
            setViewport({ zoom: Math.min(3, viewport.zoom * 1.15) })
          }
        >
          +
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="hidden items-center gap-2 rounded-sm border border-ink-border bg-ink-panel px-2 py-1 font-mono text-[10px] text-ink-amber md:flex"
          title="Ink drops earned from templates & exports"
          data-testid="ink-drops"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-ink-lime" />
          <InkDropCounter value={inkDrops} suffix="ink" />
          <span>·</span>
          <InkDropCounter value={exportsCount} suffix="exports" />
        </div>

        <button
          type="button"
          className="rounded-sm px-2.5 py-1.5 text-xs text-ink-muted hover:bg-ink-panel hover:text-ink-text"
          onClick={() => setShowTemplates(true)}
        >
          Templates
        </button>
        <button
          type="button"
          className="rounded-sm px-2.5 py-1.5 text-xs text-ink-muted hover:bg-ink-panel"
          onClick={() => projectRef.current?.click()}
        >
          Import
        </button>
        <button
          type="button"
          className="rounded-sm px-2.5 py-1.5 text-xs text-ink-muted hover:bg-ink-panel"
          onClick={handleExportJson}
        >
          .JSON
        </button>
        <button
          type="button"
          data-testid="export-svg"
          className="rounded-sm border border-ink-border-strong bg-ink-panel px-2.5 py-1.5 text-xs font-medium text-ink-text hover:border-ink-lime-dim"
          onClick={handleExportSvg}
        >
          SVG
        </button>
        <button
          type="button"
          data-testid="export-pdf"
          className="rounded-sm bg-ink-lime px-3 py-1.5 text-xs font-semibold text-ink-bg hover:brightness-110"
          onClick={handleExportPdf}
        >
          PDF
        </button>
      </div>

      <input
        ref={imgRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onImageFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={projectRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onImportJson(f);
          e.target.value = "";
        }}
      />
    </header>
  );
}
