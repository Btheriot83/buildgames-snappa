import { openDB, type IDBPDatabase } from "idb";
import type { PortableProject, ProjectDocument } from "../types";
import { assertIndexedDbAvailable } from "../validation";

const DB_NAME = "forgeink-snappa";
const DB_VERSION = 1;

export interface StoredAsset {
  id: string;
  dataUrl: string;
  createdAt: string;
}

export interface AppMeta {
  key: string;
  value: unknown;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  assertIndexedDbAvailable();
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "meta.id" });
        }
        if (!db.objectStoreNames.contains("assets")) {
          db.createObjectStore("assets", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveProject(doc: ProjectDocument): Promise<void> {
  const db = await getDb();
  await db.put("projects", doc);
}

export async function loadProject(id: string): Promise<ProjectDocument | undefined> {
  const db = await getDb();
  return db.get("projects", id);
}

export async function listProjects(): Promise<ProjectDocument[]> {
  const db = await getDb();
  return db.getAll("projects");
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("projects", id);
}

export async function saveAsset(asset: StoredAsset): Promise<void> {
  const db = await getDb();
  await db.put("assets", asset);
}

export async function loadAsset(id: string): Promise<StoredAsset | undefined> {
  const db = await getDb();
  return db.get("assets", id);
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.put("meta", { key, value });
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const row = await db.get("meta", key);
  return row?.value as T | undefined;
}

export async function exportPortable(
  doc: ProjectDocument,
  assetIds: string[]
): Promise<PortableProject> {
  const assets: Record<string, string> = {};
  for (const id of assetIds) {
    const a = await loadAsset(id);
    if (a) assets[id] = a.dataUrl;
  }
  return {
    format: "forgeink-project",
    version: 1,
    document: doc,
    assets,
  };
}

export const DATA_LOCATION =
  "Browser IndexedDB database `forgeink-snappa` (projects, assets, meta). Cleared if you wipe site data.";
