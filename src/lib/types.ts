export type ElementType =
  | "text"
  | "rect"
  | "circle"
  | "image"
  | "group"
  | "component";

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  parentId: string | null;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fill: string;
  align: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
}

export interface RectElement extends BaseElement {
  type: "rect";
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface CircleElement extends BaseElement {
  type: "circle";
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string; // data URL or blob key
  objectFit: "cover" | "contain" | "fill";
  assetId?: string;
}

export interface GroupElement extends BaseElement {
  type: "group";
  childIds: string[];
}

export interface ComponentElement extends BaseElement {
  type: "component";
  componentId: string;
  childIds: string[];
}

export type CanvasElement =
  | TextElement
  | RectElement
  | CircleElement
  | ImageElement
  | GroupElement
  | ComponentElement;

export interface CanvasSize {
  width: number;
  height: number;
  label: string;
}

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ProjectDocument {
  meta: ProjectMeta;
  canvas: CanvasSize;
  elements: CanvasElement[];
  layerOrder: string[]; // bottom → top
  background: string;
}

export interface PortableProject {
  format: "forgeink-project";
  version: 1;
  document: ProjectDocument;
  assets?: Record<string, string>; // assetId → data URL
}

export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export interface AlignGuide {
  orientation: "x" | "y";
  position: number;
}

export type Tool =
  | "select"
  | "text"
  | "rect"
  | "circle"
  | "image"
  | "hand";

export type AppStatus =
  | "idle"
  | "loading"
  | "saving"
  | "exporting"
  | "success"
  | "error";
