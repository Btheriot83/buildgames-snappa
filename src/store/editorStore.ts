"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  AlignGuide,
  AppStatus,
  CanvasElement,
  PortableProject,
  ProjectDocument,
  Tool,
  Viewport,
} from "@/lib/types";
import { createId } from "@/lib/id";
import { alignElements, type AlignMode } from "@/lib/transforms";
import { createEmptyProject, getStarter, type StarterId } from "@/lib/templates/starters";
import { saveProject, setMeta, getMeta } from "@/lib/storage/indexeddb";
import { parsePortableProject } from "@/lib/validation";

const MAX_HISTORY = 50;

interface EditorState {
  document: ProjectDocument;
  selectedIds: string[];
  tool: Tool;
  viewport: Viewport;
  guides: AlignGuide[];
  status: AppStatus;
  statusMessage: string;
  history: ProjectDocument[];
  future: ProjectDocument[];
  dirty: boolean;
  hydrated: boolean;
  inkDrops: number; // light gamification
  exportsCount: number;
  lastExportAt: string | null;
  missingFontWarning: string[];
  showTemplates: boolean;
  errorRecoverable: boolean;

  // actions
  hydrate: () => Promise<void>;
  setTool: (t: Tool) => void;
  setViewport: (v: Partial<Viewport>) => void;
  setGuides: (g: AlignGuide[]) => void;
  select: (ids: string[]) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  updateDocument: (fn: (doc: ProjectDocument) => void, recordHistory?: boolean) => void;
  addElement: (el: CanvasElement) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  deleteSelected: () => void;
  groupSelected: () => void;
  alignSelected: (mode: AlignMode) => void;
  reorderLayer: (id: string, dir: "up" | "down" | "top" | "bottom") => void;
  loadTemplate: (id: StarterId) => void;
  newBlank: () => void;
  setCanvasSize: (w: number, h: number, label: string) => void;
  setBackground: (c: string) => void;
  setName: (name: string) => void;
  autosave: () => Promise<void>;
  importProject: (raw: unknown) => { ok: boolean; error?: string };
  exportPortableJson: () => PortableProject;
  setStatus: (s: AppStatus, message?: string, recoverable?: boolean) => void;
  setMissingFonts: (f: string[]) => void;
  bumpExport: () => Promise<void>;
  setShowTemplates: (v: boolean) => void;
  applyAssistText: (
    target: "headline" | "subhead" | "cta" | "quote" | "body",
    text: string
  ) => void;
}

function cloneDoc(doc: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(doc));
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    document: createEmptyProject(),
    selectedIds: [],
    tool: "select",
    viewport: { zoom: 0.55, panX: 40, panY: 40 },
    guides: [],
    status: "idle",
    statusMessage: "",
    history: [],
    future: [],
    dirty: false,
    hydrated: false,
    inkDrops: 0,
    exportsCount: 0,
    lastExportAt: null,
    missingFontWarning: [],
    showTemplates: true,
    errorRecoverable: false,

    hydrate: async () => {
      set((s) => {
        s.status = "loading";
        s.statusMessage = "Loading local project…";
      });
      try {
        const lastId = await getMeta<string>("lastProjectId");
        const ink = (await getMeta<number>("inkDrops")) ?? 0;
        const exportsCount = (await getMeta<number>("exportsCount")) ?? 0;
        const lastExportAt = (await getMeta<string>("lastExportAt")) ?? null;
        let doc: ProjectDocument | undefined;
        if (lastId) {
          const { loadProject } = await import("@/lib/storage/indexeddb");
          doc = await loadProject(lastId);
        }
        set((s) => {
          if (doc) {
            s.document = doc;
            s.showTemplates = doc.elements.length === 0;
          }
          s.inkDrops = ink;
          s.exportsCount = exportsCount;
          s.lastExportAt = lastExportAt;
          s.hydrated = true;
          s.status = "idle";
          s.statusMessage = "";
        });
      } catch (e) {
        set((s) => {
          s.hydrated = true;
          s.status = "error";
          s.statusMessage =
            e instanceof Error
              ? e.message
              : "Could not load local storage. Starting fresh.";
          s.errorRecoverable = true;
        });
      }
    },

    setTool: (t) => set((s) => { s.tool = t; }),
    setViewport: (v) =>
      set((s) => {
        Object.assign(s.viewport, v);
      }),
    setGuides: (g) => set((s) => { s.guides = g; }),
    select: (ids) => set((s) => { s.selectedIds = ids; }),

    pushHistory: () =>
      set((s) => {
        s.history.push(cloneDoc(s.document));
        if (s.history.length > MAX_HISTORY) s.history.shift();
        s.future = [];
      }),

    undo: () =>
      set((s) => {
        const prev = s.history.pop();
        if (!prev) return;
        s.future.push(cloneDoc(s.document));
        s.document = prev;
        s.dirty = true;
        s.selectedIds = [];
      }),

    redo: () =>
      set((s) => {
        const next = s.future.pop();
        if (!next) return;
        s.history.push(cloneDoc(s.document));
        s.document = next;
        s.dirty = true;
        s.selectedIds = [];
      }),

    updateDocument: (fn, recordHistory = true) =>
      set((s) => {
        if (recordHistory) {
          s.history.push(cloneDoc(s.document));
          if (s.history.length > MAX_HISTORY) s.history.shift();
          s.future = [];
        }
        fn(s.document);
        s.document.meta.updatedAt = new Date().toISOString();
        s.document.meta.version += 1;
        s.dirty = true;
      }),

    addElement: (el) => {
      get().updateDocument((doc) => {
        doc.elements.push(el);
        doc.layerOrder.push(el.id);
      });
      set((s) => {
        s.selectedIds = [el.id];
        s.tool = "select";
        s.showTemplates = false;
      });
    },

    updateElement: (id, patch) => {
      get().updateDocument((doc) => {
        const idx = doc.elements.findIndex((e) => e.id === id);
        if (idx >= 0) {
          doc.elements[idx] = { ...doc.elements[idx], ...patch } as CanvasElement;
        }
      }, true);
    },

    deleteSelected: () => {
      const ids = new Set(get().selectedIds);
      if (ids.size === 0) return;
      get().updateDocument((doc) => {
        doc.elements = doc.elements.filter((e) => !ids.has(e.id));
        doc.layerOrder = doc.layerOrder.filter((id) => !ids.has(id));
      });
      set((s) => {
        s.selectedIds = [];
      });
    },

    groupSelected: () => {
      const ids = get().selectedIds;
      if (ids.length < 2) return;
      get().updateDocument((doc) => {
        const selected = doc.elements.filter((e) => ids.includes(e.id));
        const minX = Math.min(...selected.map((e) => e.x));
        const minY = Math.min(...selected.map((e) => e.y));
        const maxX = Math.max(...selected.map((e) => e.x + e.width));
        const maxY = Math.max(...selected.map((e) => e.y + e.height));
        const groupId = createId("grp");
        for (const el of doc.elements) {
          if (ids.includes(el.id)) el.parentId = groupId;
        }
        doc.elements.push({
          id: groupId,
          type: "group",
          name: "Group",
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          childIds: ids,
        });
        doc.layerOrder.push(groupId);
      });
    },

    alignSelected: (mode) => {
      const ids = get().selectedIds;
      if (ids.length < 2) return;
      get().updateDocument((doc) => {
        const selected = doc.elements.filter((e) => ids.includes(e.id));
        const aligned = alignElements(selected, mode);
        const map = new Map(aligned.map((e) => [e.id, e]));
        doc.elements = doc.elements.map((e) => map.get(e.id) ?? e);
      });
    },

    reorderLayer: (id, dir) => {
      get().updateDocument((doc) => {
        const order = [...doc.layerOrder];
        const i = order.indexOf(id);
        if (i < 0) return;
        order.splice(i, 1);
        if (dir === "top") order.push(id);
        else if (dir === "bottom") order.unshift(id);
        else if (dir === "up") order.splice(Math.min(i + 1, order.length), 0, id);
        else order.splice(Math.max(i - 1, 0), 0, id);
        doc.layerOrder = order;
      });
    },

    loadTemplate: (id) => {
      const starter = getStarter(id);
      if (!starter) return;
      const doc = starter.build();
      set((s) => {
        s.history.push(cloneDoc(s.document));
        s.future = [];
        s.document = doc;
        // Round 1: land on the headline so properties match Snappa density
        const texts = doc.elements.filter((e) => e.type === "text");
        const ranked = [...texts].sort((a, b) => {
          const score = (e: (typeof texts)[number]) => {
            const n = e.name.toLowerCase();
            const size = e.type === "text" ? e.fontSize : 0;
            return (n.includes("headline") || n.includes("title") ? 10 : 0) + size;
          };
          return score(b) - score(a);
        });
        s.selectedIds = ranked[0] ? [ranked[0].id] : [];
        s.dirty = true;
        s.showTemplates = false;
        s.status = "success";
        s.statusMessage = `Loaded “${starter.name}”`;
        s.inkDrops += 1;
        // Fit canvas in typical workstation viewport
        const fit = Math.min(
          0.7,
          Math.max(0.25, (900 / Math.max(doc.canvas.width, 1)) * 0.85)
        );
        s.viewport = { zoom: fit, panX: 48, panY: 36 };
      });
      void setMeta("inkDrops", get().inkDrops);
      setTimeout(() => {
        set((s) => {
          if (s.status === "success") {
            s.status = "idle";
            s.statusMessage = "";
          }
        });
      }, 1600);
    },

    newBlank: () => {
      set((s) => {
        s.history.push(cloneDoc(s.document));
        s.future = [];
        s.document = createEmptyProject(s.document.canvas);
        s.selectedIds = [];
        s.dirty = true;
        // Round 5: stay on paper well with press video — templates stay optional
        s.showTemplates = false;
        s.viewport = { zoom: 0.55, panX: 48, panY: 36 };
      });
    },

    setCanvasSize: (w, h, label) => {
      get().updateDocument((doc) => {
        doc.canvas = { width: w, height: h, label };
      });
    },

    setBackground: (c) => {
      get().updateDocument((doc) => {
        doc.background = c;
      });
    },

    setName: (name) => {
      get().updateDocument((doc) => {
        doc.meta.name = name;
      }, false);
      set((s) => {
        s.dirty = true;
      });
    },

    autosave: async () => {
      const { document: doc, dirty } = get();
      if (!dirty) return;
      set((s) => {
        s.status = "saving";
        s.statusMessage = "Autosaving…";
      });
      try {
        await saveProject(doc);
        await setMeta("lastProjectId", doc.meta.id);
        set((s) => {
          s.dirty = false;
          s.status = "idle";
          s.statusMessage = "Saved locally";
        });
        setTimeout(() => {
          set((s) => {
            if (s.statusMessage === "Saved locally") s.statusMessage = "";
          });
        }, 1200);
      } catch (e) {
        set((s) => {
          s.status = "error";
          s.statusMessage =
            e instanceof Error ? e.message : "Autosave failed.";
          s.errorRecoverable = true;
        });
      }
    },

    importProject: (raw) => {
      const parsed = parsePortableProject(raw);
      if (!parsed.ok) return { ok: false, error: parsed.error };
      set((s) => {
        s.history.push(cloneDoc(s.document));
        s.future = [];
        s.document = parsed.data.document;
        s.selectedIds = [];
        s.dirty = true;
        s.showTemplates = false;
        s.status = "success";
        s.statusMessage = "Project imported";
      });
      return { ok: true };
    },

    exportPortableJson: () => {
      const doc = get().document;
      const assets: Record<string, string> = {};
      for (const el of doc.elements) {
        if (el.type === "image" && el.assetId) {
          assets[el.assetId] = el.src;
        }
      }
      return {
        format: "forgeink-project",
        version: 1,
        document: doc,
        assets,
      };
    },

    setStatus: (status, message = "", recoverable = false) =>
      set((s) => {
        s.status = status;
        s.statusMessage = message;
        s.errorRecoverable = recoverable;
      }),

    setMissingFonts: (f) => set((s) => { s.missingFontWarning = f; }),

    bumpExport: async () => {
      const next = get().exportsCount + 1;
      const drops = get().inkDrops + 3;
      const at = new Date().toISOString();
      set((s) => {
        s.exportsCount = next;
        s.inkDrops = drops;
        s.lastExportAt = at;
        s.status = "success";
        s.statusMessage =
          next === 1
            ? "First export — +3 ink drops"
            : `Exported · ${drops} ink drops`;
      });
      await setMeta("exportsCount", next);
      await setMeta("inkDrops", drops);
      await setMeta("lastExportAt", at);
      setTimeout(() => {
        set((s) => {
          if (s.status === "success") {
            s.status = "idle";
            s.statusMessage = "";
          }
        });
      }, 2000);
    },

    setShowTemplates: (v) => set((s) => { s.showTemplates = v; }),

    applyAssistText: (target, text) => {
      const doc = get().document;
      const texts = doc.elements.filter((e) => e.type === "text");
      if (!texts.length) {
        set((s) => {
          s.status = "error";
          s.statusMessage = "Add or select text first — or load a template.";
          s.errorRecoverable = true;
        });
        return;
      }
      const score = (name: string, body: string) => {
        const n = `${name} ${body}`.toLowerCase();
        const map: Record<string, string[]> = {
          headline: ["title", "headline", "poster", "launch", "drop"],
          subhead: ["sub", "blurb", "support", "deck"],
          cta: ["cta", "button", "link", "url"],
          quote: ["quote", "pull"],
          body: ["body", "copy", "attribution", "studio"],
        };
        return (map[target] || []).reduce((acc, k) => acc + (n.includes(k) ? 2 : 0), 0);
      };
      const ranked = [...texts].sort(
        (a, b) =>
          score(b.name, b.type === "text" ? b.text : "") -
          score(a.name, a.type === "text" ? a.text : "")
      );
      const pick = ranked[0];
      get().pushHistory();
      set((s) => {
        const el = s.document.elements.find((e) => e.id === pick.id);
        if (el && el.type === "text") {
          el.text = text;
          el.name = el.name || target;
        }
        s.dirty = true;
        s.status = "success";
        s.statusMessage = `Applied ${target} to “${pick.name}”`;
      });
      setTimeout(() => {
        set((s) => {
          if (s.status === "success") {
            s.status = "idle";
            s.statusMessage = "";
          }
        });
      }, 1600);
    },
  }))
);
