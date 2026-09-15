import { describe, it, expect } from "vitest";
import {
  rotatePoint,
  snapValue,
  snapPosition,
  alignElements,
  safeFilename,
  screenToCanvas,
  canvasToScreen,
  resizeElement,
  getCenter,
  getBounds,
} from "../src/lib/transforms";
import type { CanvasElement } from "../src/lib/types";

function rect(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number
): CanvasElement {
  return {
    id,
    type: "rect",
    name: id,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    parentId: null,
    fill: "#000",
    stroke: "transparent",
    strokeWidth: 0,
    cornerRadius: 0,
  };
}

describe("transforms core", () => {
  it("rotates a point 90 degrees around origin", () => {
    const p = rotatePoint({ x: 2, y: 0 }, { x: 0, y: 0 }, 90);
    expect(p.x).toBeCloseTo(0, 5);
    expect(p.y).toBeCloseTo(2, 5);
  });

  it("snaps values to grid", () => {
    expect(snapValue(13, 8)).toBe(16);
    expect(snapValue(11, 8)).toBe(8);
    expect(snapValue(10, 0)).toBe(10);
  });

  it("snaps position to peer center within threshold", () => {
    const result = snapPosition(
      { x: 98, y: 10 },
      { width: 40, height: 20 },
      [{ x: 0, y: 0, width: 100, height: 100 }],
      { grid: 1, threshold: 8 }
    );
    // moving center x ≈ 98+20=118 vs peer center 50 — not that
    // left edge 98 vs peer right 100 → snap x to 100-40? wait left to right: x = 100 - 40? 
    // Actually left edge 98 near peer right 100 → apply x = 100 (left align to peer.right means x = peer.right for left edge? 
    // Looking at code: peer right applies x = v - size.width when aligning right edges... 
    // left edge near peer.right: edge=98, value=100, delta=2, x = 98+2 = 100
    expect(result.x).toBe(100);
    expect(result.guides.some((g) => g.orientation === "x")).toBe(true);
  });

  it("aligns elements to the left", () => {
    const els = [rect("a", 10, 0, 20, 20), rect("b", 40, 5, 20, 20)];
    const aligned = alignElements(els, "left");
    expect(aligned.every((e) => e.x === 10)).toBe(true);
  });

  it("distributes horizontally", () => {
    const els = [
      rect("a", 0, 0, 10, 10),
      rect("b", 20, 0, 10, 10),
      rect("c", 80, 0, 10, 10),
    ];
    const aligned = alignElements(els, "distribute-h");
    const sorted = [...aligned].sort((a, b) => a.x - b.x);
    const gap1 = sorted[1].x - (sorted[0].x + sorted[0].width);
    const gap2 = sorted[2].x - (sorted[1].x + sorted[1].width);
    expect(gap1).toBeCloseTo(gap2, 5);
  });

  it("converts screen ↔ canvas with zoom and pan", () => {
    const viewport = { zoom: 2, panX: 10, panY: 20 };
    const offset = { x: 0, y: 0 };
    const screen = canvasToScreen({ x: 50, y: 40 }, viewport, offset);
    expect(screen).toEqual({ x: 110, y: 100 });
    const back = screenToCanvas(screen, viewport, offset);
    expect(back.x).toBeCloseTo(50);
    expect(back.y).toBeCloseTo(40);
  });

  it("resizes from SE handle", () => {
    const el = rect("a", 0, 0, 100, 50);
    const next = resizeElement(el, "se", { x: 150, y: 80 });
    expect(next.width).toBe(150);
    expect(next.height).toBe(80);
  });

  it("produces safe filenames", () => {
    expect(safeFilename("My Cool Graphic!!", "svg")).toBe("my-cool-graphic.svg");
    expect(safeFilename("   ", "pdf")).toBe("export.pdf");
  });

  it("computes bounds and center", () => {
    const b = getBounds(rect("a", 10, 20, 30, 40));
    expect(getCenter(b)).toEqual({ x: 25, y: 40 });
  });
});
