/** Canvas + UI stacks — Archivo Black is the mark, not the whole UI. No Inter/Geist. */
export const LOCAL_FONTS = [
  { family: "Archivo Black", fallback: "Impact, sans-serif", label: "Archivo Black" },
  { family: "IBM Plex Sans", fallback: "Helvetica Neue, sans-serif", label: "IBM Plex Sans" },
  { family: "IBM Plex Mono", fallback: "Courier New, monospace", label: "IBM Plex Mono" },
  { family: "Playfair Display", fallback: "Georgia, serif", label: "Playfair Display" },
  { family: "Syne", fallback: "Arial Black, sans-serif", label: "Syne (canvas)" },
  { family: "Georgia", fallback: "serif", label: "Georgia" },
  { family: "Courier New", fallback: "monospace", label: "Courier New" },
] as const;

export type LocalFontFamily = (typeof LOCAL_FONTS)[number]["family"];

export async function detectMissingFonts(families: string[]): Promise<string[]> {
  if (typeof document === "undefined") return [];
  const unique = Array.from(new Set(families.filter(Boolean)));
  const missing: string[] = [];
  const known = new Set(LOCAL_FONTS.map((f) => f.family));
  const systemSafe = new Set(["Georgia", "Courier New", "Arial", "Impact"]);

  for (const family of unique) {
    if (!known.has(family as LocalFontFamily) && !systemSafe.has(family)) {
      missing.push(family);
      continue;
    }
    try {
      if (document.fonts?.check) {
        const ok = document.fonts.check(`16px "${family}"`);
        if (!ok && !systemSafe.has(family)) missing.push(family);
      }
    } catch {
      if (!systemSafe.has(family)) missing.push(family);
    }
  }
  return missing;
}

export function fontStack(family: string): string {
  const match = LOCAL_FONTS.find((f) => f.family === family);
  if (match) return `"${match.family}", ${match.fallback}`;
  return `"${family}", "IBM Plex Sans", system-ui, sans-serif`;
}
