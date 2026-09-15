/**
 * AI layout/copy assist for fixed-size social canvases.
 * BUILD_GAMES_LLM_API_KEY is an OpenRouter key (see /workspace/build-games/gauntlet/LLM.md).
 * Also accepts OPENROUTER_API_KEY / XAI_API_KEY / GROK_API_KEY / OPENAI_API_KEY.
 * No canned fake AI — missing/invalid key → honest error.
 */

export type AssistMode = "copy" | "layout" | "both";

export type AssistRequest = {
  mode: AssistMode;
  canvas: { width: number; height: number; label: string };
  brief: string;
  currentTexts?: { id: string; name: string; text: string }[];
};

export type AssistSuggestion = {
  headlines: string[];
  subheads: string[];
  ctas: string[];
  layoutNotes: string[];
  applyPatches: {
    kind: "text";
    target: "headline" | "subhead" | "cta" | "quote" | "body";
    text: string;
  }[];
  provider: string;
  model: string;
};

type Provider = {
  key: string;
  base: string;
  model: string;
  name: string;
  extraHeaders?: Record<string, string>;
};

function resolveProvider(): Provider | null {
  const shared = process.env.BUILD_GAMES_LLM_API_KEY?.trim();
  const openrouter =
    process.env.OPENROUTER_API_KEY?.trim() ||
    (shared && !shared.startsWith("xai-") && !shared.startsWith("sk-")
      ? shared
      : undefined) ||
    (shared && process.env.LLM_BASE_URL?.includes("openrouter")
      ? shared
      : undefined);

  // Prefer explicit OpenRouter base or shared Build Games key → OpenRouter
  const llmBase = process.env.LLM_BASE_URL?.replace(/\/$/, "");
  if (shared && (llmBase?.includes("openrouter") || !process.env.OPENAI_API_KEY)) {
    // Default Build Games path: OpenRouter (LLM.md)
    if (!shared.startsWith("xai-")) {
      return {
        key: shared,
        base: llmBase || "https://openrouter.ai/api/v1",
        model:
          process.env.OPENROUTER_MODEL?.trim() ||
          process.env.OPENAI_MODEL?.trim() ||
          "openai/gpt-4o-mini",
        name: "openrouter",
        extraHeaders: {
          "HTTP-Referer": "https://buildgames-snappa.vercel.app",
          "X-Title": "Build Games — Forge Ink",
        },
      };
    }
  }

  const xai =
    process.env.XAI_API_KEY?.trim() ||
    process.env.GROK_API_KEY?.trim() ||
    (shared?.startsWith("xai-") ? shared : undefined);
  if (xai) {
    return {
      key: xai,
      base: (process.env.XAI_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, ""),
      model: process.env.XAI_MODEL?.trim() || "grok-3-mini",
      name: "xai",
    };
  }

  if (openrouter) {
    return {
      key: openrouter,
      base: "https://openrouter.ai/api/v1",
      model: process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini",
      name: "openrouter",
      extraHeaders: {
        "HTTP-Referer": "https://buildgames-snappa.vercel.app",
        "X-Title": "Build Games — Forge Ink",
      },
    };
  }

  const openai = process.env.OPENAI_API_KEY?.trim();
  if (openai) {
    return {
      key: openai,
      base: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
        /\/$/,
        ""
      ),
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      name: "openai",
    };
  }

  if (shared) {
    return {
      key: shared,
      base: "https://openrouter.ai/api/v1",
      model: "openai/gpt-4o-mini",
      name: "openrouter-fallback",
      extraHeaders: {
        "HTTP-Referer": "https://buildgames-snappa.vercel.app",
        "X-Title": "Build Games — Forge Ink",
      },
    };
  }
  return null;
}

export function hasAssistProvider(): boolean {
  return resolveProvider() !== null;
}

export async function runAssist(req: AssistRequest): Promise<AssistSuggestion> {
  const provider = resolveProvider();
  if (!provider) {
    const err = new Error(
      "No AI key configured. Set BUILD_GAMES_LLM_API_KEY (OpenRouter) or XAI_API_KEY / OPENAI_API_KEY."
    );
    (err as Error & { status: number }).status = 503;
    throw err;
  }

  const system = `You are a senior social-graphic art director for Forge Ink — a local fixed-size canvas tool (Night Press aesthetic).
Return ONLY valid JSON:
{
  "headlines": string[3],
  "subheads": string[3],
  "ctas": string[3],
  "layoutNotes": string[3],
  "applyPatches": [{"kind":"text","target":"headline"|"subhead"|"cta"|"quote"|"body","text":string}]
}
Copy must fit ${req.canvas.width}×${req.canvas.height} (${req.canvas.label}).
Short punchy lines. No markdown. No vibe-purple clichés. No fake stats.
Prefer concrete places, hours, and shop names when the brief allows (Phoenix / Mesa / diesel / night market OK).
layoutNotes must be spatial (margins, hierarchy, contrast on the artboard).`;

  const user = JSON.stringify({
    mode: req.mode,
    canvas: req.canvas,
    brief: req.brief.slice(0, 1200),
    currentTexts: (req.currentTexts ?? []).slice(0, 12),
  });

  const res = await fetch(`${provider.base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.key}`,
      "Content-Type": "application/json",
      ...(provider.extraHeaders ?? {}),
    },
    body: JSON.stringify({
      model: provider.model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(
      `AI provider (${provider.name}) error ${res.status}: ${body.slice(0, 200)}`
    );
    (err as Error & { status: number }).status = 502;
    throw err;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "{}";
  let parsed: Partial<AssistSuggestion>;
  try {
    parsed = JSON.parse(raw) as Partial<AssistSuggestion>;
  } catch {
    const err = new Error("AI returned non-JSON.");
    (err as Error & { status: number }).status = 502;
    throw err;
  }

  return {
    headlines: Array.isArray(parsed.headlines) ? parsed.headlines.slice(0, 5) : [],
    subheads: Array.isArray(parsed.subheads) ? parsed.subheads.slice(0, 5) : [],
    ctas: Array.isArray(parsed.ctas) ? parsed.ctas.slice(0, 5) : [],
    layoutNotes: Array.isArray(parsed.layoutNotes)
      ? parsed.layoutNotes.slice(0, 5)
      : [],
    applyPatches: Array.isArray(parsed.applyPatches)
      ? parsed.applyPatches
          .filter((p) => p && p.kind === "text" && typeof p.text === "string")
          .slice(0, 8)
      : [],
    provider: provider.name,
    model: provider.model,
  };
}
