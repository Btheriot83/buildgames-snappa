"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { TemplateGallery } from "./TemplateGallery";
import { StatusBar } from "./StatusBar";
import { GrainShader } from "./GrainShader";
import { SuccessSplash } from "./SuccessSplash";
import { SizeRail } from "./SizeRail";
import { InkPressVideo } from "./InkPressVideo";
import { ExportDock } from "./ExportDock";

export function EditorApp() {
  const hydrate = useEditorStore((s) => s.hydrate);
  const autosave = useEditorStore((s) => s.autosave);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const setTool = useEditorStore((s) => s.setTool);
  const hydrated = useEditorStore((s) => s.hydrated);
  const status = useEditorStore((s) => s.status);
  const setStatus = useEditorStore((s) => s.setStatus);
  const errorShakeRef = useRef<HTMLDivElement>(null);
  const statusMessage = useEditorStore((s) => s.statusMessage);

  useEffect(() => {
    if (status !== "error") return;
    const el = errorShakeRef.current;
    if (!el) return;
    el.classList.add("is-error");
    el.classList.remove("is-shaking");
    void el.offsetWidth;
    el.classList.add("is-shaking");
    const t = setTimeout(() => el.classList.remove("is-shaking"), 320);
    return () => clearTimeout(t);
  }, [status, statusMessage]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const id = setInterval(() => {
      void autosave();
    }, 4000);
    return () => clearInterval(id);
  }, [autosave]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        meta &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      } else if (!meta) {
        const k = e.key.toLowerCase();
        if (k === "v") setTool("select");
        if (k === "h") setTool("hand");
        if (k === "t") setTool("text");
        if (k === "r") setTool("rect");
        if (k === "o") setTool("circle");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, deleteSelected, setTool]);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-ink-bg text-ink-text">
      <GrainShader />
      <div className="relative z-10 flex h-full flex-col">
        {/* Materials tape — Night Press job strip, spottable in ≤3s */}
        <div
          className="job-tape flex h-8 shrink-0 items-center gap-3 overflow-hidden border-b border-ink-border-strong bg-[#121812] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-lime"
          data-testid="materials-tape"
        >
          <span className="text-ink-amber">Night Press</span>
          <span className="text-ink-muted">/</span>
          <span>Fixed size</span>
          <span className="text-ink-muted">/</span>
          <span>Local ink</span>
          <span className="text-ink-muted">/</span>
          <span>SVG + PDF</span>
          <span className="text-ink-muted">/</span>
          <span className="hidden sm:inline">No account</span>
          <span className="ml-auto hidden text-ink-muted md:inline">
            Compose → Export
          </span>
        </div>
        <Toolbar />
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-56 shrink-0 border-r border-ink-border-strong bg-ink-surface md:block">
            <LayersPanel />
          </aside>
          <main className="relative min-w-0 flex-1">
            {!hydrated && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center bg-ink-bg/80"
                data-testid="loading-state"
              >
                <p className="animate-pulse font-mono text-sm text-ink-label">
                  Opening IndexedDB…
                </p>
              </div>
            )}
            {status === "error" && (
              <div
                ref={errorShakeRef}
                className="t-input absolute left-1/2 top-4 z-30 max-w-md -translate-x-1/2 border border-ink-danger bg-ink-panel px-4 py-3 text-sm text-ink-danger is-error"
                role="alert"
                data-testid="error-state"
              >
                <p className="font-medium">Something went wrong</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {statusMessage ||
                    "You can dismiss and keep editing — data stays local when storage is available."}
                </p>
                <button
                  type="button"
                  className="btn-ghost mt-2 text-ink-amber"
                  onClick={() => setStatus("idle", "")}
                >
                  Continue editing
                </button>
              </div>
            )}
            <Canvas />
            <SizeRail />
            <InkPressVideo />
            <ExportDock />
            <TemplateGallery />
            <SuccessSplash />
          </main>
          <aside className="hidden w-64 shrink-0 border-l border-ink-border-strong bg-ink-surface lg:block">
            <PropertiesPanel />
          </aside>
        </div>
        <StatusBar />
      </div>
    </div>
  );
}
