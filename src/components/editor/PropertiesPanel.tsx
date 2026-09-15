"use client";

import { useEditorStore } from "@/store/editorStore";
import { LOCAL_FONTS } from "@/lib/fonts";
import { CANVAS_PRESETS } from "@/lib/templates/starters";
import type { TextElement, RectElement, CircleElement, ImageElement } from "@/lib/types";

export function PropertiesPanel() {
  const doc = useEditorStore((s) => s.document);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const setBackground = useEditorStore((s) => s.setBackground);
  const setCanvasSize = useEditorStore((s) => s.setCanvasSize);
  const setName = useEditorStore((s) => s.setName);
  const alignSelected = useEditorStore((s) => s.alignSelected);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const groupSelected = useEditorStore((s) => s.groupSelected);

  const selected = doc.elements.filter((e) => selectedIds.includes(e.id));
  const el = selected[0];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-ink-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        Properties
      </div>

      <section className="space-y-2 border-b border-ink-border p-3">
        <label className="block text-[10px] uppercase tracking-wider text-ink-muted">
          Project
        </label>
        <input
          className="w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1.5 text-sm text-ink-text"
          value={doc.meta.name}
          onChange={(e) => setName(e.target.value)}
          data-testid="project-name"
        />
        <label className="block text-[10px] uppercase tracking-wider text-ink-muted">
          Canvas
        </label>
        <select
          className="w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1.5 text-sm"
          value={`${doc.canvas.width}x${doc.canvas.height}`}
          onChange={(e) => {
            const preset = CANVAS_PRESETS.find(
              (p) => `${p.width}x${p.height}` === e.target.value
            );
            if (preset) setCanvasSize(preset.width, preset.height, preset.label);
          }}
        >
          {CANVAS_PRESETS.map((p) => (
            <option key={p.label} value={`${p.width}x${p.height}`}>
              {p.label} ({p.width}×{p.height})
            </option>
          ))}
        </select>
        <label className="block text-[10px] uppercase tracking-wider text-ink-muted">
          Background
        </label>
        <input
          type="color"
          value={doc.background.slice(0, 7)}
          onChange={(e) => setBackground(e.target.value)}
          className="h-8 w-full cursor-pointer rounded-sm border border-ink-border bg-transparent"
        />
      </section>

      {selected.length > 1 && (
        <section className="space-y-2 border-b border-ink-border p-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-muted">
            Align ({selected.length})
          </p>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                ["left", "Left"],
                ["center", "Center"],
                ["right", "Right"],
                ["top", "Top"],
                ["middle", "Mid"],
                ["bottom", "Bottom"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className="rounded-sm border border-ink-border px-1 py-1 text-[10px] hover:border-ink-lime-dim"
                onClick={() => alignSelected(mode)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="w-full rounded-sm border border-ink-border py-1.5 text-xs hover:border-ink-lime-dim"
            onClick={groupSelected}
          >
            Group
          </button>
          <button
            type="button"
            className="w-full rounded-sm border border-ink-danger/40 py-1.5 text-xs text-ink-danger"
            onClick={deleteSelected}
          >
            Delete
          </button>
        </section>
      )}

      {!el && selected.length <= 1 && (
        <p className="px-3 py-8 text-center text-xs text-ink-muted">
          Select an element to edit its properties.
        </p>
      )}

      {el && selected.length === 1 && (
        <section className="space-y-2 p-3">
          <Field
            label="Name"
            value={el.name}
            onChange={(v) => updateElement(el.id, { name: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Num
              label="X"
              value={Math.round(el.x)}
              onChange={(v) => updateElement(el.id, { x: v })}
            />
            <Num
              label="Y"
              value={Math.round(el.y)}
              onChange={(v) => updateElement(el.id, { y: v })}
            />
            <Num
              label="W"
              value={Math.round(el.width)}
              onChange={(v) => updateElement(el.id, { width: Math.max(8, v) })}
            />
            <Num
              label="H"
              value={Math.round(el.height)}
              onChange={(v) => updateElement(el.id, { height: Math.max(8, v) })}
            />
          </div>
          <Num
            label="Opacity"
            value={el.opacity}
            step={0.05}
            min={0}
            max={1}
            onChange={(v) => updateElement(el.id, { opacity: v })}
          />
          <Num
            label="Rotation"
            value={el.rotation}
            onChange={(v) => updateElement(el.id, { rotation: v })}
          />

          {el.type === "text" && <TextProps el={el} onChange={updateElement} />}
          {el.type === "rect" && <RectProps el={el} onChange={updateElement} />}
          {el.type === "circle" && (
            <CircleProps el={el} onChange={updateElement} />
          )}
          {el.type === "image" && (
            <ImageProps el={el} onChange={updateElement} />
          )}

          <button
            type="button"
            className="mt-2 w-full rounded-sm border border-ink-danger/40 py-1.5 text-xs text-ink-danger"
            onClick={deleteSelected}
          >
            Delete
          </button>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <input
        className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Num({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 font-mono text-sm"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function TextProps({
  el,
  onChange,
}: {
  el: TextElement;
  onChange: (id: string, p: Partial<TextElement>) => void;
}) {
  return (
    <>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Text
        </span>
        <textarea
          className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 text-sm"
          rows={3}
          value={el.text}
          onChange={(e) => onChange(el.id, { text: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Font
        </span>
        <select
          className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 text-sm"
          value={el.fontFamily}
          onChange={(e) => onChange(el.id, { fontFamily: e.target.value })}
        >
          {LOCAL_FONTS.map((f) => (
            <option key={f.family} value={f.family}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <Num
        label="Size"
        value={el.fontSize}
        onChange={(v) => onChange(el.id, { fontSize: v })}
      />
      <Num
        label="Weight"
        value={el.fontWeight}
        step={100}
        min={100}
        max={900}
        onChange={(v) => onChange(el.id, { fontWeight: v })}
      />
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Fill
        </span>
        <input
          type="color"
          className="mt-0.5 h-8 w-full"
          value={el.fill.slice(0, 7)}
          onChange={(e) => onChange(el.id, { fill: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Align
        </span>
        <select
          className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 text-sm"
          value={el.align}
          onChange={(e) =>
            onChange(el.id, {
              align: e.target.value as TextElement["align"],
            })
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </>
  );
}

function RectProps({
  el,
  onChange,
}: {
  el: RectElement;
  onChange: (id: string, p: Partial<RectElement>) => void;
}) {
  return (
    <>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Fill
        </span>
        <input
          type="color"
          className="mt-0.5 h-8 w-full"
          value={el.fill === "transparent" ? "#000000" : el.fill.slice(0, 7)}
          onChange={(e) => onChange(el.id, { fill: e.target.value })}
        />
      </label>
      <Num
        label="Corner"
        value={el.cornerRadius}
        onChange={(v) => onChange(el.id, { cornerRadius: v })}
      />
      <Num
        label="Stroke W"
        value={el.strokeWidth}
        onChange={(v) => onChange(el.id, { strokeWidth: v })}
      />
    </>
  );
}

function CircleProps({
  el,
  onChange,
}: {
  el: CircleElement;
  onChange: (id: string, p: Partial<CircleElement>) => void;
}) {
  return (
    <>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">
          Fill
        </span>
        <input
          type="color"
          className="mt-0.5 h-8 w-full"
          value={el.fill === "transparent" ? "#000000" : el.fill.slice(0, 7)}
          onChange={(e) => onChange(el.id, { fill: e.target.value })}
        />
      </label>
      <Num
        label="Stroke W"
        value={el.strokeWidth}
        onChange={(v) => onChange(el.id, { strokeWidth: v })}
      />
      {el.strokeWidth > 0 && (
        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-ink-muted">
            Stroke
          </span>
          <input
            type="color"
            className="mt-0.5 h-8 w-full"
            value={el.stroke.slice(0, 7)}
            onChange={(e) => onChange(el.id, { stroke: e.target.value })}
          />
        </label>
      )}
    </>
  );
}

function ImageProps({
  el,
  onChange,
}: {
  el: ImageElement;
  onChange: (id: string, p: Partial<ImageElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-ink-muted">
        Fit
      </span>
      <select
        className="mt-0.5 w-full rounded-sm border border-ink-border bg-ink-bg px-2 py-1 text-sm"
        value={el.objectFit}
        onChange={(e) =>
          onChange(el.id, {
            objectFit: e.target.value as ImageElement["objectFit"],
          })
        }
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="fill">Fill</option>
      </select>
    </label>
  );
}

