"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { AssistSuggestion } from "@/lib/ai/assist";
import type { TextElement } from "@/lib/types";

export function AssistPanel() {
  const doc = useEditorStore((s) => s.document);
  const applyAssistText = useEditorStore((s) => s.applyAssistText);
  const setStatus = useEditorStore((s) => s.setStatus);
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [result, setResult] = useState<AssistSuggestion | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/assist")
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false));
  }, []);

  const currentTexts = doc.elements
    .filter((e): e is TextElement => e.type === "text")
    .map((e) => ({ id: e.id, name: e.name, text: e.text }));

  const run = async () => {
    if (!brief.trim()) {
      setError("Describe the graphic in one sentence.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "both",
          canvas: {
            width: doc.canvas.width,
            height: doc.canvas.height,
            label: doc.canvas.label,
          },
          brief: brief.trim(),
          currentTexts,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Assist failed (${res.status})`);
        setStatus("error", data.error || "Assist failed", true);
        return;
      }
      setResult(data as AssistSuggestion);
      setStatus("success", `Assist via ${data.provider}/${data.model}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      className="space-y-2 border-t border-ink-border p-3"
      data-testid="assist-panel"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-amber">
          Pressman assist
        </p>
        <span className="font-mono text-[9px] text-ink-muted">
          {configured === null
            ? "…"
            : configured
              ? "API ready"
              : "key missing"}
        </span>
      </div>
      <p className="text-[11px] leading-snug text-ink-muted">
        Real layout/copy for this canvas size. No canned filler — needs a server
        key.
      </p>
      <textarea
        className="min-h-[64px] w-full resize-y rounded-sm border border-ink-border bg-ink-bg px-2 py-1.5 text-xs text-ink-text"
        placeholder="e.g. Launch poster for a night-market coffee cart — bold, local, no hype"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        data-testid="assist-brief"
      />
      <button
        type="button"
        disabled={busy}
        className="w-full rounded-sm bg-ink-amber px-2 py-1.5 text-xs font-semibold text-ink-bg disabled:opacity-50"
        onClick={() => void run()}
        data-testid="assist-run"
      >
        {busy ? "Pulling proofs…" : "Suggest copy & layout"}
      </button>
      {error && (
        <p className="text-[11px] text-ink-danger" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-2 text-xs">
          {result.headlines.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Headlines
              </p>
              <ul className="space-y-1">
                {result.headlines.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      className="w-full rounded-sm border border-ink-border px-2 py-1 text-left hover:border-ink-lime-dim"
                      onClick={() => applyAssistText("headline", h)}
                    >
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.subheads.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Subheads
              </p>
              <ul className="space-y-1">
                {result.subheads.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      className="w-full rounded-sm border border-ink-border px-2 py-1 text-left hover:border-ink-lime-dim"
                      onClick={() => applyAssistText("subhead", h)}
                    >
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.layoutNotes.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                Layout notes
              </p>
              <ul className="list-disc space-y-0.5 pl-4 text-ink-muted">
                {result.layoutNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="font-mono text-[9px] text-ink-muted">
            via {result.provider} · {result.model}
          </p>
        </div>
      )}
    </section>
  );
}
