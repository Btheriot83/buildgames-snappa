"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { AssistSuggestion } from "@/lib/ai/assist";
import type { TextElement } from "@/lib/types";

const BRIEF_EXAMPLES = [
  "Mesa diesel bay open — same-day mobile repair, Apache Blvd",
  "Roosevelt Row night market Sat 7PM — free entry flyer",
  "$89 on-site diagnostic this week — Tempe / Mesa fleet vans",
];

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
      className="space-y-2 border-t border-ink-border-strong p-3"
      data-testid="assist-panel"
    >
      <div className="flex items-center justify-between">
        <p className="ui-label text-ink-amber">
          Pressman assist
        </p>
        <span className="font-mono text-[11px] text-ink-label">
          {doc.canvas.width}×{doc.canvas.height}
          {" · "}
          {configured === null
            ? "…"
            : configured
              ? "API ready"
              : "key missing"}
        </span>
      </div>
      <p className="ui-caption leading-snug">
        {configured
          ? "Real layout/copy sized to this canvas. No canned filler."
          : "Add BUILD_GAMES_LLM_API_KEY (OpenRouter) on the server to unlock proofs."}
      </p>
      <textarea
        className="field-input min-h-[72px] resize-y text-[13px]"
        placeholder={BRIEF_EXAMPLES[0]}
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        data-testid="assist-brief"
      />
      <div className="flex flex-wrap gap-1">
        {BRIEF_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="btn-chip hover:border-ink-amber hover:text-ink-amber"
            onClick={() => setBrief(ex)}
          >
            {ex.split("—")[0].trim().slice(0, 28)}…
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={busy}
        className="btn-amber w-full disabled:opacity-50"
        onClick={() => void run()}
        data-testid="assist-run"
      >
        {busy ? "Pulling proofs…" : "Suggest copy & layout"}
      </button>
      {error && (
        <p className="ui-caption text-ink-danger" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-2 text-xs">
          {result.headlines.length > 0 && (
            <div>
              <p className="ui-label mb-1">
                Headlines
              </p>
              <ul className="space-y-1">
                {result.headlines.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      className="btn-secondary w-full justify-start text-left text-[12px]"
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
              <p className="ui-label mb-1">
                Subheads
              </p>
              <ul className="space-y-1">
                {result.subheads.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      className="btn-secondary w-full justify-start text-left text-[12px]"
                      onClick={() => applyAssistText("subhead", h)}
                    >
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.headlines[0] && (
            <button
              type="button"
              className="btn-secondary w-full border-ink-lime-dim text-ink-lime"
              onClick={() => {
                if (result.headlines[0])
                  applyAssistText("headline", result.headlines[0]);
                if (result.subheads[0])
                  applyAssistText("subhead", result.subheads[0]);
                if (result.ctas[0]) applyAssistText("cta", result.ctas[0]);
              }}
              data-testid="assist-apply-top"
            >
              Apply top proof set
            </button>
          )}
          {result.ctas.length > 0 && (
            <div>
              <p className="ui-label mb-1">
                CTAs
              </p>
              <ul className="space-y-1">
                {result.ctas.map((h) => (
                  <li key={h}>
                    <button
                      type="button"
                      className="btn-secondary w-full justify-start text-left text-[12px]"
                      onClick={() => applyAssistText("cta", h)}
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
              <p className="ui-label mb-1">
                Layout notes
              </p>
              <ul className="list-disc space-y-0.5 pl-4 text-ink-muted">
                {result.layoutNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="font-mono text-[11px] text-ink-muted">
            via {result.provider} · {result.model}
          </p>
        </div>
      )}
    </section>
  );
}
