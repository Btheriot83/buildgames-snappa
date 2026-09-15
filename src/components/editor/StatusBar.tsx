"use client";

import { useEditorStore } from "@/store/editorStore";

export function StatusBar() {
  const status = useEditorStore((s) => s.status);
  const message = useEditorStore((s) => s.statusMessage);
  const dirty = useEditorStore((s) => s.dirty);
  const doc = useEditorStore((s) => s.document);
  const missing = useEditorStore((s) => s.missingFontWarning);
  const errorRecoverable = useEditorStore((s) => s.errorRecoverable);
  const setStatus = useEditorStore((s) => s.setStatus);
  const hydrated = useEditorStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="flex h-8 items-center border-t border-ink-border bg-ink-surface px-3 font-mono text-[11px] text-ink-muted">
        <span className="animate-pulse">Loading local workspace…</span>
      </div>
    );
  }

  const tone =
    status === "error"
      ? "text-ink-danger"
      : status === "success"
        ? "text-ink-lime"
        : status === "exporting" || status === "saving"
          ? "text-ink-amber"
          : "text-ink-muted";

  return (
    <div
      className="flex h-8 shrink-0 items-center gap-3 border-t border-ink-border bg-ink-surface px-3 font-mono text-[11px]"
      data-testid="status-bar"
    >
      <span className={tone}>
        {message ||
          (status === "idle"
            ? dirty
              ? "Unsaved changes · autosave on"
              : "Ready"
            : status)}
      </span>
      {status === "error" && errorRecoverable && (
        <button
          type="button"
          className="text-ink-amber underline"
          onClick={() => setStatus("idle", "")}
        >
          Dismiss
        </button>
      )}
      {missing.length > 0 && (
        <span className="text-ink-amber">
          Font warn: {missing.join(", ")}
        </span>
      )}
      <span className="ml-auto text-ink-muted">
        {doc.canvas.label} · {doc.canvas.width}×{doc.canvas.height} ·{" "}
        {doc.elements.length} elements
      </span>
    </div>
  );
}
