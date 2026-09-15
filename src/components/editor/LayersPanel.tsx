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
      <div className="panel-head">
        Layers
      </div>
      <ul className="flex-1 overflow-y-auto p-1" data-testid="layers-list">
        {layers.length === 0 && (
          <li className="ui-caption px-3 py-8 text-center text-ink-muted">
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
                data-active={active ? "true" : "false"}
                className={`layer-row flex w-full items-center gap-2 rounded-sm border border-transparent px-2 py-1.5 text-left text-[13px] ${
                  active
                    ? ""
                    : "text-ink-text hover:bg-ink-panel-2"
                }`}
                onClick={() => select([id])}
              >
                <span className="w-14 shrink-0 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-label">
                  {el.type}
                </span>
                <span className="truncate font-medium">{el.name}</span>
                <span className="ml-auto flex gap-0.5">
                  <span
                    role="button"
                    tabIndex={0}
                    className="px-1 text-[11px] text-ink-muted hover:text-ink-text"
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
                    className="px-1 text-[11px] text-ink-muted hover:text-ink-text"
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
