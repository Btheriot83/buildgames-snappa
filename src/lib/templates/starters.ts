import { createId } from "../id";
import type { CanvasElement, ProjectDocument } from "../types";

function baseMeta(name: string): ProjectDocument["meta"] {
  const now = new Date().toISOString();
  return {
    id: createId("proj"),
    name,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/** Procedural ink-wash SVG data URL used as local image assets in templates. */
export function inkWashDataUrl(
  w: number,
  h: number,
  ink = "#9FE870",
  paper = "#1a211c"
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.35 0"/></filter>
    <radialGradient id="g" cx="30%" cy="20%" r="80%"><stop offset="0%" stop-color="${ink}" stop-opacity="0.55"/><stop offset="55%" stop-color="${paper}" stop-opacity="0"/><stop offset="100%" stop-color="#0c0f0d" stop-opacity="0.9"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${paper}"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" filter="url(#n)" opacity="0.45"/>
  <circle cx="${w * 0.78}" cy="${h * 0.72}" r="${Math.min(w, h) * 0.22}" fill="${ink}" opacity="0.18"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function igSquare(name: string, elements: CanvasElement[], bg: string): ProjectDocument {
  return {
    meta: baseMeta(name),
    canvas: { width: 1080, height: 1080, label: "Instagram Post" },
    elements,
    layerOrder: elements.map((e) => e.id),
    background: bg,
  };
}

export function createEmptyProject(
  size: { width: number; height: number; label: string } = {
    width: 1080,
    height: 1080,
    label: "Instagram Post",
  }
): ProjectDocument {
  return {
    meta: baseMeta("Untitled graphic"),
    canvas: size,
    elements: [],
    layerOrder: [],
    background: "#121612",
  };
}

export const CANVAS_PRESETS = [
  { width: 1080, height: 1080, label: "Instagram Post" },
  { width: 1080, height: 1920, label: "Instagram Story" },
  { width: 1200, height: 627, label: "LinkedIn / OG" },
  { width: 1500, height: 500, label: "X Header" },
  { width: 1080, height: 1350, label: "Portrait Post" },
] as const;

export type StarterId =
  | "launch-poster"
  | "quote-card"
  | "story-countdown"
  | "event-flyer"
  | "product-drop";

export interface StarterTemplate {
  id: StarterId;
  name: string;
  blurb: string;
  category: string;
  build: () => ProjectDocument;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "launch-poster",
    name: "Launch Poster",
    blurb: "Bold product drop on charcoal with lime strike.",
    category: "Social",
    build: () => {
      const wash = inkWashDataUrl(1080, 1080, "#9FE870", "#141a15");
      const imgId = createId("el");
      const barId = createId("el");
      const titleId = createId("el");
      const subId = createId("el");
      const tagId = createId("el");
      const elements: CanvasElement[] = [
        {
          id: imgId,
          type: "image",
          name: "Ink wash",
          x: 0,
          y: 0,
          width: 1080,
          height: 1080,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          src: wash,
          objectFit: "cover",
        },
        {
          id: barId,
          type: "rect",
          name: "Strike bar",
          x: 72,
          y: 720,
          width: 220,
          height: 14,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "#9FE870",
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
        },
        {
          id: titleId,
          type: "text",
          name: "Headline",
          x: 72,
          y: 760,
          width: 900,
          height: 140,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "SHIP LOUD.",
          fontFamily: "Archivo Black",
          fontSize: 96,
          fontWeight: 400,
          fill: "#F4F7F2",
          align: "left",
          lineHeight: 1.05,
          letterSpacing: -2,
        },
        {
          id: subId,
          type: "text",
          name: "Subhead",
          x: 72,
          y: 920,
          width: 700,
          height: 60,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "Forge Ink · week one drop",
          fontFamily: "IBM Plex Mono",
          fontSize: 28,
          fontWeight: 500,
          fill: "#E8A54B",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 1,
        },
        {
          id: tagId,
          type: "text",
          name: "Corner mark",
          x: 72,
          y: 64,
          width: 400,
          height: 40,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "FORGE / 01",
          fontFamily: "IBM Plex Mono",
          fontSize: 22,
          fontWeight: 500,
          fill: "#9FE870",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 4,
        },
      ];
      return igSquare("Launch Poster", elements, "#141a15");
    },
  },
  {
    id: "quote-card",
    name: "Quote Card",
    blurb: "Editorial pull-quote with amber rule.",
    category: "Social",
    build: () => {
      const ruleId = createId("el");
      const quoteId = createId("el");
      const attrId = createId("el");
      const frameId = createId("el");
      const elements: CanvasElement[] = [
        {
          id: frameId,
          type: "rect",
          name: "Frame",
          x: 48,
          y: 48,
          width: 984,
          height: 984,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "transparent",
          stroke: "#2a332c",
          strokeWidth: 3,
          cornerRadius: 0,
        },
        {
          id: ruleId,
          type: "rect",
          name: "Amber rule",
          x: 120,
          y: 280,
          width: 96,
          height: 8,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "#E8A54B",
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
        },
        {
          id: quoteId,
          type: "text",
          name: "Quote",
          x: 120,
          y: 320,
          width: 840,
          height: 420,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "“Clarity is a design decision, not a feature.”",
          fontFamily: "Playfair Display",
          fontSize: 64,
          fontWeight: 700,
          fill: "#F4F7F2",
          align: "left",
          lineHeight: 1.25,
          letterSpacing: -0.5,
        },
        {
          id: attrId,
          type: "text",
          name: "Attribution",
          x: 120,
          y: 820,
          width: 600,
          height: 48,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "— Studio notes",
          fontFamily: "IBM Plex Sans",
          fontSize: 28,
          fontWeight: 500,
          fill: "#8a948c",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      ];
      return igSquare("Quote Card", elements, "#0f1310");
    },
  },
  {
    id: "story-countdown",
    name: "Story Countdown",
    blurb: "Vertical hype story with big number.",
    category: "Story",
    build: () => {
      const now = new Date().toISOString();
      const circleId = createId("el");
      const numId = createId("el");
      const labelId = createId("el");
      const ctaId = createId("el");
      const elements: CanvasElement[] = [
        {
          id: circleId,
          type: "circle",
          name: "Glow disc",
          x: 190,
          y: 520,
          width: 700,
          height: 700,
          rotation: 0,
          opacity: 0.2,
          locked: false,
          visible: true,
          parentId: null,
          fill: "#9FE870",
          stroke: "transparent",
          strokeWidth: 0,
        },
        {
          id: numId,
          type: "text",
          name: "Countdown",
          x: 80,
          y: 640,
          width: 920,
          height: 280,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "03",
          fontFamily: "Archivo Black",
          fontSize: 280,
          fontWeight: 400,
          fill: "#F4F7F2",
          align: "center",
          lineHeight: 0.9,
          letterSpacing: -8,
        },
        {
          id: labelId,
          type: "text",
          name: "Label",
          x: 80,
          y: 960,
          width: 920,
          height: 60,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "DAYS TO OPEN STUDIO",
          fontFamily: "IBM Plex Mono",
          fontSize: 32,
          fontWeight: 600,
          fill: "#9FE870",
          align: "center",
          lineHeight: 1.2,
          letterSpacing: 6,
        },
        {
          id: ctaId,
          type: "text",
          name: "Top mark",
          x: 80,
          y: 160,
          width: 920,
          height: 80,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "SAVE THE DATE",
          fontFamily: "Syne",
          fontSize: 42,
          fontWeight: 700,
          fill: "#E8A54B",
          align: "center",
          lineHeight: 1.1,
          letterSpacing: 2,
        },
      ];
      return {
        meta: { id: createId("proj"), name: "Story Countdown", createdAt: now, updatedAt: now, version: 1 },
        canvas: { width: 1080, height: 1920, label: "Instagram Story" },
        elements,
        layerOrder: elements.map((e) => e.id),
        background: "#0c0f0d",
      };
    },
  },
  {
    id: "event-flyer",
    name: "Event Flyer",
    blurb: "Night market flyer with stamp circle.",
    category: "Print-ish",
    build: () => {
      const stampId = createId("el");
      const titleId = createId("el");
      const whenId = createId("el");
      const whereId = createId("el");
      const bandId = createId("el");
      const elements: CanvasElement[] = [
        {
          id: bandId,
          type: "rect",
          name: "Bottom band",
          x: 0,
          y: 860,
          width: 1080,
          height: 220,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "#9FE870",
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 0,
        },
        {
          id: stampId,
          type: "circle",
          name: "Stamp",
          x: 720,
          y: 80,
          width: 260,
          height: 260,
          rotation: -12,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "transparent",
          stroke: "#E8A54B",
          strokeWidth: 8,
        },
        {
          id: titleId,
          type: "text",
          name: "Title",
          x: 64,
          y: 320,
          width: 900,
          height: 200,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "NIGHT\nMARKET",
          fontFamily: "Syne",
          fontSize: 110,
          fontWeight: 800,
          fill: "#F4F7F2",
          align: "left",
          lineHeight: 0.95,
          letterSpacing: -3,
        },
        {
          id: whenId,
          type: "text",
          name: "When",
          x: 64,
          y: 900,
          width: 500,
          height: 80,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "SAT 21 · 7PM",
          fontFamily: "Archivo Black",
          fontSize: 42,
          fontWeight: 400,
          fill: "#0c0f0d",
          align: "left",
          lineHeight: 1.1,
          letterSpacing: 1,
        },
        {
          id: whereId,
          type: "text",
          name: "Where",
          x: 64,
          y: 970,
          width: 700,
          height: 50,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "River Lot · free entry",
          fontFamily: "IBM Plex Sans",
          fontSize: 28,
          fontWeight: 600,
          fill: "#0c0f0d",
          align: "left",
          lineHeight: 1.2,
          letterSpacing: 0,
        },
      ];
      return igSquare("Event Flyer", elements, "#161c18");
    },
  },
  {
    id: "product-drop",
    name: "Product Drop",
    blurb: "OG / LinkedIn wide promo strip.",
    category: "Wide",
    build: () => {
      const now = new Date().toISOString();
      const wash = inkWashDataUrl(1200, 627, "#E8A54B", "#121812");
      const imgId = createId("el");
      const titleId = createId("el");
      const subId = createId("el");
      const chipId = createId("el");
      const elements: CanvasElement[] = [
        {
          id: imgId,
          type: "image",
          name: "Backdrop",
          x: 0,
          y: 0,
          width: 1200,
          height: 627,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          src: wash,
          objectFit: "cover",
        },
        {
          id: chipId,
          type: "rect",
          name: "Chip",
          x: 64,
          y: 72,
          width: 160,
          height: 40,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          fill: "#9FE870",
          stroke: "transparent",
          strokeWidth: 0,
          cornerRadius: 2,
        },
        {
          id: titleId,
          type: "text",
          name: "Title",
          x: 64,
          y: 220,
          width: 900,
          height: 120,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "New ink. Same grit.",
          fontFamily: "Syne",
          fontSize: 64,
          fontWeight: 700,
          fill: "#F4F7F2",
          align: "left",
          lineHeight: 1.1,
          letterSpacing: -1,
        },
        {
          id: subId,
          type: "text",
          name: "Sub",
          x: 64,
          y: 360,
          width: 700,
          height: 60,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          parentId: null,
          text: "Local-first graphics. Export SVG & PDF.",
          fontFamily: "IBM Plex Sans",
          fontSize: 28,
          fontWeight: 400,
          fill: "#b8c0b6",
          align: "left",
          lineHeight: 1.3,
          letterSpacing: 0,
        },
      ];
      // chip label as text on top
      const chipTextId = createId("el");
      elements.push({
        id: chipTextId,
        type: "text",
        name: "Chip label",
        x: 76,
        y: 78,
        width: 140,
        height: 32,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        parentId: null,
        text: "DROP 04",
        fontFamily: "IBM Plex Mono",
        fontSize: 18,
        fontWeight: 700,
        fill: "#0c0f0d",
        align: "left",
        lineHeight: 1.2,
        letterSpacing: 2,
      });
      return {
        meta: { id: createId("proj"), name: "Product Drop", createdAt: now, updatedAt: now, version: 1 },
        canvas: { width: 1200, height: 627, label: "LinkedIn / OG" },
        elements,
        layerOrder: elements.map((e) => e.id),
        background: "#121812",
      };
    },
  },
];

export function getStarter(id: StarterId): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id);
}
