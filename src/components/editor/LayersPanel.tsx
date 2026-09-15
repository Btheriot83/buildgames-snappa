"use client";

import { useEditorStore } from "@/store/editorStore";

export function LayersPanel() {
  const doc = useEditorStore((s) => s.document);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const select = useEditorStore((s) => s.select);
  const reorderLayer = useEditorStore((s) => s.reorderLayer);
  const updateElement = useEditorStore((s) => s.updateElement);
  const byId = new Map(doc.elements.map((e) => [e.id, e]));
  const layers = [...doc.layerOrder].reverse();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        Layers
      </div>
      <ul className="flex-1 overflow-y-auto p-1" data-testid="layers-list">
        {layers.length === 0 && (
          <li className="px-2 py-6 text-center text-xs text-ink-muted">
            Empty stack — load a template or draw on the sheet.
          </li>
        )}
        {layers.map((id) => {
          const el = byId.get(id);
          if (!el) return null;
          const active = selectedIds.includes(id);
          return (
            <li key={id}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs ${
                  active
                    ? "bg-ink-lime/15 text-ink-lime"
                    : "text-ink-text hover:bg-ink-panel-2"
                }`}
                onClick={() => select([id])}
              >
                <span className="w-14 shrink-0 font-mono text-[10px] uppercase text-ink-muted">
                  {el.type}
                </span>
                <span className="truncate">{el.name}</span>
                <span className="ml-auto flex gap-0.5">
                  <span
                    role="button"
                    tabIndex={0}
                    className="px-1 text-ink-muted hover:text-ink-text"
                    title="Toggle visibility"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(id, { visible: !el.visible });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        updateElement(id, { visible: !el.visible });
                      }
                    }}
                  >
                    {el.visible ? "vis" : "hid"}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="px-1 text-ink-muted hover:text-ink-text"
                    title="Bring forward"
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderLayer(id, "up");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        reorderLayer(id, "up");
                      }
                    }}
                  >
                    up
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
