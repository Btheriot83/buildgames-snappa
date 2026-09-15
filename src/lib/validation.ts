import type { PortableProject, ProjectDocument } from "./types";

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

export function validateProjectName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Project name is required.";
  if (trimmed.length > 80) return "Project name must be 80 characters or fewer.";
  return null;
}

export function parsePortableProject(raw: unknown): {
  ok: true;
  data: PortableProject;
} | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid project file: not an object." };
  }
  const obj = raw as Record<string, unknown>;
  if (obj.format !== "forgeink-project") {
    return { ok: false, error: "Unrecognized project format." };
  }
  if (obj.version !== 1) {
    return { ok: false, error: `Unsupported project version: ${String(obj.version)}.` };
  }
  if (!obj.document || typeof obj.document !== "object") {
    return { ok: false, error: "Missing project document." };
  }
  const doc = obj.document as ProjectDocument;
  if (!doc.meta?.id || !doc.canvas?.width || !Array.isArray(doc.elements)) {
    return { ok: false, error: "Project document is incomplete." };
  }
  return {
    ok: true,
    data: {
      format: "forgeink-project",
      version: 1,
      document: doc,
      assets: (obj.assets as Record<string, string>) || {},
    },
  };
}

export function assertIndexedDbAvailable(): void {
  if (typeof indexedDB === "undefined") {
    throw new Error(
      "IndexedDB is unavailable in this environment. Your work cannot be autosaved locally."
    );
  }
}
