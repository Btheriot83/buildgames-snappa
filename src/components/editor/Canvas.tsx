"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { CanvasElement, TextElement } from "@/lib/types";
import { createId } from "@/lib/id";
import {
  hitTest,
  screenToCanvas,
  snapPosition,
  getBounds,
} from "@/lib/transforms";
import { fontStack } from "@/lib/fonts";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const doc = useEditorStore((s) => s.document);
  const viewport = useEditorStore((s) => s.viewport);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const tool = useEditorStore((s) => s.tool);
  const guides = useEditorStore((s) => s.guides);
  const select = useEditorStore((s) => s.select);
  const setViewport = useEditorStore((s) => s.setViewport);
  const setGuides = useEditorStore((s) => s.setGuides);
  const updateDocument = useEditorStore((s) => s.updateDocument);
  const addElement = useEditorStore((s) => s.addElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const dragRef = useRef<{
    mode: "pan" | "move" | "draw";
    startScreen: { x: number; y: number };
    startPan?: { x: number; y: number };
    originEls?: Map<string, { x: number; y: number }>;
    drawId?: string;
  } | null>(null);

  const [spaceDown, setSpaceDown] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (e.type === "keydown") setSpaceDown(true);
        else setSpaceDown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  const getOffset = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    return { x: rect?.left ?? 0, y: rect?.top ?? 0 };
  }, []);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * 0.0015;
      const next = Math.min(3, Math.max(0.15, viewport.zoom * (1 + delta)));
      setViewport({ zoom: next });
    } else {
      setViewport({
        panX: viewport.panX - e.deltaX,
        panY: viewport.panY - e.deltaY,
      });
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const offset = getOffset();
    const canvasPt = screenToCanvas(
      { x: e.clientX, y: e.clientY },
      viewport,
      offset
    );
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    if (tool === "hand" || spaceDown || e.button === 1) {
      dragRef.current = {
        mode: "pan",
        startScreen: { x: e.clientX, y: e.clientY },
        startPan: { x: viewport.panX, y: viewport.panY },
      };
      return;
    }

    if (tool === "text" || tool === "rect" || tool === "circle") {
      pushHistory();
      const id = createId("el");
      const base = {
        id,
        name: tool,
        x: canvasPt.x,
        y: canvasPt.y,
        width: 8,
        height: 8,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        parentId: null as string | null,
      };
      let el: CanvasElement;
      if (tool === "text") {
        el = {
          ...base,
          type: "text",
          name: "Text",
          width: 320,
          height: 80,
          text: "Your headline",
          fontFamily: "Archivo Black",
          fontSize: 48,
          fontWeight: 700,
          fill: "#F4F7F2",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0,
        };
        addElement(el);
        dragRef.current = null;
        return;
      } else if (tool === "circle") {
        el = {
          ...base,
          type: "circle",
          name: "Circle",
          fill: "#9FE870",
          stroke: "transparent",
          strokeWidth: 0,
        };
      } else {
        el = {
          ...base,
          type: "rect",
          name: "Rectangle",
          fill: "#E8A54B",
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
        };
      }
      addElement(el);
      dragRef.current = {
        mode: "draw",
        startScreen: { x: e.clientX, y: e.clientY },
        drawId: id,
      };
      return;
    }

    // select / move
    const hit = hitTest(doc.elements, doc.layerOrder, canvasPt);
    if (hit) {
      const ids = e.shiftKey
        ? selectedIds.includes(hit.id)
          ? selectedIds.filter((id) => id !== hit.id)
          : [...selectedIds, hit.id]
        : selectedIds.includes(hit.id)
          ? selectedIds
          : [hit.id];
      select(ids);
      pushHistory();
      const origin = new Map<string, { x: number; y: number }>();
      for (const id of ids) {
        const el = doc.elements.find((x) => x.id === id);
        if (el) origin.set(id, { x: el.x, y: el.y });
      }
      dragRef.current = {
        mode: "move",
        startScreen: { x: e.clientX, y: e.clientY },
        originEls: origin,
      };
    } else {
      select([]);
      dragRef.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const offset = getOffset();

    if (drag.mode === "pan" && drag.startPan) {
      setViewport({
        panX: drag.startPan.x + (e.clientX - drag.startScreen.x),
        panY: drag.startPan.y + (e.clientY - drag.startScreen.y),
      });
      return;
    }

    const start = screenToCanvas(drag.startScreen, viewport, offset);
    const cur = screenToCanvas({ x: e.clientX, y: e.clientY }, viewport, offset);
    const dx = cur.x - start.x;
    const dy = cur.y - start.y;

    if (drag.mode === "draw" && drag.drawId) {
      updateDocument((d) => {
        const el = d.elements.find((x) => x.id === drag.drawId);
        if (!el) return;
        el.width = Math.max(8, Math.abs(dx));
        el.height = Math.max(8, Math.abs(dy));
        el.x = dx < 0 ? start.x + dx : start.x;
        el.y = dy < 0 ? start.y + dy : start.y;
      }, false);
      return;
    }

    if (drag.mode === "move" && drag.originEls) {
      const movingIds = Array.from(drag.originEls.keys());
      const primaryId = movingIds[0];
      const primary = doc.elements.find((x) => x.id === primaryId);
      const origin = drag.originEls.get(primaryId);
      if (!primary || !origin) return;

      const peers = doc.elements
        .filter((el) => !movingIds.includes(el.id) && el.visible)
        .map(getBounds);

      const snapped = snapPosition(
        { x: origin.x + dx, y: origin.y + dy },
        { width: primary.width, height: primary.height },
        peers,
        {
          grid: 8,
          threshold: 6,
          canvasWidth: doc.canvas.width,
          canvasHeight: doc.canvas.height,
        }
      );
      setGuides(snapped.guides);
      const adjX = snapped.x - origin.x;
      const adjY = snapped.y - origin.y;

      updateDocument((d) => {
        for (const [id, o] of drag.originEls!) {
          const el = d.elements.find((x) => x.id === id);
          if (el && !el.locked) {
            el.x = o.x + adjX;
            el.y = o.y + adjY;
          }
        }
      }, false);
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setGuides([]);
  };

  const byId = new Map(doc.elements.map((e) => [e.id, e]));
  const ordered = doc.layerOrder.map((id) => byId.get(id)).filter(Boolean) as CanvasElement[];

  return (
    <div
      ref={containerRef}
      className="canvas-well relative h-full w-full overflow-hidden"
      style={{
        cursor:
          tool === "hand" || spaceDown
            ? "grab"
            : tool === "select"
              ? "default"
              : "crosshair",
      }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-testid="canvas-stage"
    >
      <div
        className="canvas-stage absolute origin-top-left"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          width: doc.canvas.width,
          height: doc.canvas.height,
        }}
      >
        <svg
          width={doc.canvas.width}
          height={doc.canvas.height}
          viewBox={`0 0 ${doc.canvas.width} ${doc.canvas.height}`}
          className="block"
          style={{ background: doc.background }}
          data-testid="design-canvas"
        >
          {ordered.map((el) => (
            <ElementNode key={el.id} el={el} selected={selectedIds.includes(el.id)} />
          ))}
          {guides.map((g, i) =>
            g.orientation === "x" ? (
              <line
                key={`gx-${i}`}
                x1={g.position}
                y1={0}
                x2={g.position}
                y2={doc.canvas.height}
                stroke="#A8E86A"
                strokeWidth={1 / viewport.zoom}
                strokeDasharray={`${4 / viewport.zoom} ${4 / viewport.zoom}`}
                opacity={0.85}
              />
            ) : (
              <line
                key={`gy-${i}`}
                x1={0}
                y1={g.position}
                x2={doc.canvas.width}
                y2={g.position}
                stroke="#A8E86A"
                strokeWidth={1 / viewport.zoom}
                strokeDasharray={`${4 / viewport.zoom} ${4 / viewport.zoom}`}
                opacity={0.85}
              />
            )
          )}
        </svg>
      </div>
    </div>
  );
}

function ElementNode({
  el,
  selected,
}: {
  el: CanvasElement;
  selected: boolean;
}) {
  if (!el.visible) return null;
  const transform =
    el.rotation !== 0
      ? `rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})`
      : undefined;

  let node: React.ReactNode = null;
  switch (el.type) {
    case "rect":
      node = (
        <rect
          x={el.x}
          y={el.y}
          width={el.width}
          height={el.height}
          rx={el.cornerRadius}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          opacity={el.opacity}
        />
      );
      break;
    case "circle":
      node = (
        <ellipse
          cx={el.x + el.width / 2}
          cy={el.y + el.height / 2}
          rx={el.width / 2}
          ry={el.height / 2}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
          opacity={el.opacity}
        />
      );
      break;
    case "image":
      node = (
        <image
          href={el.src}
          x={el.x}
          y={el.y}
          width={el.width}
          height={el.height}
          opacity={el.opacity}
          preserveAspectRatio={
            el.objectFit === "cover"
              ? "xMidYMid slice"
              : el.objectFit === "contain"
                ? "xMidYMid meet"
                : "none"
          }
        />
      );
      break;
    case "text":
      node = <TextNode el={el} />;
      break;
    default:
      node = null;
  }

  return (
    <g transform={transform}>
      {node}
      {selected && (
        <g pointerEvents="none">
          <rect
            x={el.x}
            y={el.y}
            width={el.width}
            height={el.height}
            fill="none"
            stroke="#A8E86A"
            strokeWidth={2 / 1}
            strokeDasharray="6 4"
          />
          {[
            [el.x, el.y],
            [el.x + el.width, el.y],
            [el.x, el.y + el.height],
            [el.x + el.width, el.y + el.height],
          ].map(([hx, hy], i) => (
            <rect
              key={i}
              x={hx - 6}
              y={hy - 6}
              width={12}
              height={12}
              fill="#A8E86A"
              stroke="#0e1210"
              strokeWidth={2}
            />
          ))}
        </g>
      )}
    </g>
  );
}

function TextNode({ el }: { el: TextElement }) {
  const lines = el.text.split("\n");
  const lh = el.fontSize * el.lineHeight;
  const anchor =
    el.align === "center" ? "middle" : el.align === "right" ? "end" : "start";
  const tx =
    el.align === "center"
      ? el.x + el.width / 2
      : el.align === "right"
        ? el.x + el.width
        : el.x;

  return (
    <text
      x={tx}
      y={el.y + el.fontSize}
      fill={el.fill}
      fontFamily={fontStack(el.fontFamily)}
      fontSize={el.fontSize}
      fontWeight={el.fontWeight}
      textAnchor={anchor}
      letterSpacing={el.letterSpacing}
      opacity={el.opacity}
      style={{ whiteSpace: "pre" }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={tx} dy={i === 0 ? 0 : lh}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
