import type { CanvasElement, ProjectDocument, TextElement } from "../types";
import { fontStack } from "../fonts";
import { detectMissingFonts } from "../fonts";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderText(el: TextElement): string {
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
  const tspans = lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : lh;
      return `<tspan x="${tx}" dy="${dy}">${esc(line)}</tspan>`;
    })
    .join("");
  // baseline approx: first line at y + fontSize
  return `<text x="${tx}" y="${el.y + el.fontSize}" fill="${esc(el.fill)}" font-family="${esc(fontStack(el.fontFamily))}" font-size="${el.fontSize}" font-weight="${el.fontWeight}" text-anchor="${anchor}" letter-spacing="${el.letterSpacing}" opacity="${el.opacity}">${tspans}</text>`;
}

function renderElement(el: CanvasElement): string {
  if (!el.visible) return "";
  const transform =
    el.rotation !== 0
      ? ` transform="rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})"`
      : "";

  switch (el.type) {
    case "rect":
      return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.cornerRadius}" fill="${esc(el.fill)}" stroke="${esc(el.stroke)}" stroke-width="${el.strokeWidth}" opacity="${el.opacity}"${transform}/>`;
    case "circle":
      return `<ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${esc(el.fill)}" stroke="${esc(el.stroke)}" stroke-width="${el.strokeWidth}" opacity="${el.opacity}"${transform}/>`;
    case "image":
      return `<image href="${esc(el.src)}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" opacity="${el.opacity}" preserveAspectRatio="${el.objectFit === "cover" ? "xMidYMid slice" : el.objectFit === "contain" ? "xMidYMid meet" : "none"}"${transform}/>`;
    case "text":
      return `<g${transform}>${renderText(el)}</g>`;
    case "group":
    case "component":
      return "";
    default:
      return "";
  }
}

export async function buildSvgString(
  doc: ProjectDocument
): Promise<{ svg: string; missingFonts: string[] }> {
  const fonts = doc.elements
    .filter((e): e is TextElement => e.type === "text")
    .map((e) => e.fontFamily);
  const missingFonts = await detectMissingFonts(fonts);
  const byId = new Map(doc.elements.map((e) => [e.id, e]));
  const body = doc.layerOrder
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((el) => renderElement(el!))
    .join("\n  ");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${doc.canvas.width}" height="${doc.canvas.height}" viewBox="0 0 ${doc.canvas.width} ${doc.canvas.height}">
  <title>${esc(doc.meta.name)}</title>
  <rect width="100%" height="100%" fill="${esc(doc.background)}"/>
  ${body}
</svg>`;
  return { svg, missingFonts };
}
