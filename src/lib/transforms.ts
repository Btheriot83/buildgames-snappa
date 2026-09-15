import type { CanvasElement, AlignGuide } from "./types";

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Rotate a point around an origin by degrees. */
export function rotatePoint(
  point: Point,
  origin: Point,
  degrees: number
): Point {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

/** Axis-aligned bounding box for an element (ignores rotation for snap/align). */
export function getBounds(el: Pick<CanvasElement, "x" | "y" | "width" | "height">): Bounds {
  return { x: el.x, y: el.y, width: el.width, height: el.height };
}

export function getCenter(bounds: Bounds): Point {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

export function getCorners(bounds: Bounds): Point[] {
  return [
    { x: bounds.x, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    { x: bounds.x, y: bounds.y + bounds.height },
  ];
}

/** Convert screen/client coords to canvas coords given viewport. */
export function screenToCanvas(
  screen: Point,
  viewport: { zoom: number; panX: number; panY: number },
  containerOffset: Point
): Point {
  return {
    x: (screen.x - containerOffset.x - viewport.panX) / viewport.zoom,
    y: (screen.y - containerOffset.y - viewport.panY) / viewport.zoom,
  };
}

export function canvasToScreen(
  canvas: Point,
  viewport: { zoom: number; panX: number; panY: number },
  containerOffset: Point
): Point {
  return {
    x: canvas.x * viewport.zoom + viewport.panX + containerOffset.x,
    y: canvas.y * viewport.zoom + viewport.panY + containerOffset.y,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function snapValue(value: number, grid: number): number {
  if (grid <= 0) return value;
  return Math.round(value / grid) * grid;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: AlignGuide[];
}

/**
 * Snap element position to grid and/or peer element edges/centers.
 */
export function snapPosition(
  proposed: Point,
  size: { width: number; height: number },
  peers: Bounds[],
  options: { grid?: number; threshold?: number; canvasWidth?: number; canvasHeight?: number } = {}
): SnapResult {
  const grid = options.grid ?? 8;
  const threshold = options.threshold ?? 6;
  let x = snapValue(proposed.x, grid);
  let y = snapValue(proposed.y, grid);
  const guides: AlignGuide[] = [];

  const moving = {
    left: x,
    right: x + size.width,
    top: y,
    bottom: y + size.height,
    cx: x + size.width / 2,
    cy: y + size.height / 2,
  };

  const targets: { orient: "x" | "y"; value: number; apply: (v: number) => void }[] = [];

  const addPeer = (b: Bounds) => {
    targets.push(
      { orient: "x", value: b.x, apply: (v) => { x = v; } },
      { orient: "x", value: b.x + b.width, apply: (v) => { x = v - size.width; } },
      { orient: "x", value: b.x + b.width / 2, apply: (v) => { x = v - size.width / 2; } },
      { orient: "y", value: b.y, apply: (v) => { y = v; } },
      { orient: "y", value: b.y + b.height, apply: (v) => { y = v - size.height; } },
      { orient: "y", value: b.y + b.height / 2, apply: (v) => { y = v - size.height / 2; } }
    );
  };

  peers.forEach(addPeer);

  if (options.canvasWidth != null) {
    targets.push(
      { orient: "x", value: 0, apply: (v) => { x = v; } },
      { orient: "x", value: options.canvasWidth, apply: (v) => { x = v - size.width; } },
      { orient: "x", value: options.canvasWidth / 2, apply: (v) => { x = v - size.width / 2; } }
    );
  }
  if (options.canvasHeight != null) {
    targets.push(
      { orient: "y", value: 0, apply: (v) => { y = v; } },
      { orient: "y", value: options.canvasHeight, apply: (v) => { y = v - size.height; } },
      { orient: "y", value: options.canvasHeight / 2, apply: (v) => { y = v - size.height / 2; } }
    );
  }

  let bestX = { dist: Infinity, value: x, guide: null as number | null };
  let bestY = { dist: Infinity, value: y, guide: null as number | null };

  for (const t of targets) {
    const movingEdges =
      t.orient === "x"
        ? [moving.left, moving.right, moving.cx]
        : [moving.top, moving.bottom, moving.cy];
    for (const edge of movingEdges) {
      const dist = Math.abs(edge - t.value);
      if (dist < threshold) {
        if (t.orient === "x" && dist < bestX.dist) {
          const delta = t.value - edge;
          bestX = { dist, value: x + delta, guide: t.value };
        }
        if (t.orient === "y" && dist < bestY.dist) {
          const delta = t.value - edge;
          bestY = { dist, value: y + delta, guide: t.value };
        }
      }
    }
  }

  if (bestX.guide != null) {
    x = bestX.value;
    guides.push({ orientation: "x", position: bestX.guide });
  }
  if (bestY.guide != null) {
    y = bestY.value;
    guides.push({ orientation: "y", position: bestY.guide });
  }

  return { x, y, guides };
}

export type AlignMode =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom"
  | "distribute-h"
  | "distribute-v";

/** Align multiple elements relative to their collective bounds. */
export function alignElements(
  elements: CanvasElement[],
  mode: AlignMode
): CanvasElement[] {
  if (elements.length < 2 && !mode.startsWith("distribute")) {
    return elements;
  }
  if (elements.length === 0) return elements;

  const bounds = elements.map(getBounds);
  const minX = Math.min(...bounds.map((b) => b.x));
  const maxX = Math.max(...bounds.map((b) => b.x + b.width));
  const minY = Math.min(...bounds.map((b) => b.y));
  const maxY = Math.max(...bounds.map((b) => b.y + b.height));
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  if (mode === "distribute-h") {
    const sorted = [...elements].sort((a, b) => a.x - b.x);
    if (sorted.length < 3) return elements;
    const totalWidth = sorted.reduce((s, e) => s + e.width, 0);
    const span = maxX - minX;
    const gap = (span - totalWidth) / (sorted.length - 1);
    let cursor = minX;
    const positions = new Map<string, number>();
    for (const el of sorted) {
      positions.set(el.id, cursor);
      cursor += el.width + gap;
    }
    return elements.map((el) =>
      positions.has(el.id) ? { ...el, x: positions.get(el.id)! } : el
    );
  }

  if (mode === "distribute-v") {
    const sorted = [...elements].sort((a, b) => a.y - b.y);
    if (sorted.length < 3) return elements;
    const totalHeight = sorted.reduce((s, e) => s + e.height, 0);
    const span = maxY - minY;
    const gap = (span - totalHeight) / (sorted.length - 1);
    let cursor = minY;
    const positions = new Map<string, number>();
    for (const el of sorted) {
      positions.set(el.id, cursor);
      cursor += el.height + gap;
    }
    return elements.map((el) =>
      positions.has(el.id) ? { ...el, y: positions.get(el.id)! } : el
    );
  }

  return elements.map((el) => {
    switch (mode) {
      case "left":
        return { ...el, x: minX };
      case "center":
        return { ...el, x: midX - el.width / 2 };
      case "right":
        return { ...el, x: maxX - el.width };
      case "top":
        return { ...el, y: minY };
      case "middle":
        return { ...el, y: midY - el.height / 2 };
      case "bottom":
        return { ...el, y: maxY - el.height };
      default:
        return el;
    }
  });
}

/** Resize keeping aspect ratio when lockAspect is true. */
export function resizeElement(
  el: CanvasElement,
  handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
  pointer: Point,
  lockAspect = false
): CanvasElement {
  const right = el.x + el.width;
  const bottom = el.y + el.height;
  let x = el.x;
  let y = el.y;
  let width = el.width;
  let height = el.height;
  const aspect = el.width / Math.max(el.height, 0.001);

  if (handle.includes("e")) {
    width = Math.max(8, pointer.x - el.x);
  }
  if (handle.includes("w")) {
    width = Math.max(8, right - pointer.x);
    x = right - width;
  }
  if (handle.includes("s")) {
    height = Math.max(8, pointer.y - el.y);
  }
  if (handle.includes("n")) {
    height = Math.max(8, bottom - pointer.y);
    y = bottom - height;
  }

  if (lockAspect && (handle === "nw" || handle === "ne" || handle === "sw" || handle === "se")) {
    if (width / height > aspect) {
      height = width / aspect;
      if (handle.includes("n")) y = bottom - height;
    } else {
      width = height * aspect;
      if (handle.includes("w")) x = right - width;
    }
  }

  return { ...el, x, y, width, height };
}

export function hitTest(
  elements: CanvasElement[],
  layerOrder: string[],
  point: Point
): CanvasElement | null {
  const byId = new Map(elements.map((e) => [e.id, e]));
  for (let i = layerOrder.length - 1; i >= 0; i--) {
    const el = byId.get(layerOrder[i]);
    if (!el || !el.visible || el.locked) continue;
    if (el.type === "group" || el.type === "component") continue;
    if (
      point.x >= el.x &&
      point.x <= el.x + el.width &&
      point.y >= el.y &&
      point.y <= el.y + el.height
    ) {
      return el;
    }
  }
  return null;
}

export function safeFilename(name: string, ext: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  const safe = base || "export";
  const cleanExt = ext.replace(/^\./, "").toLowerCase();
  return `${safe}.${cleanExt}`;
}
