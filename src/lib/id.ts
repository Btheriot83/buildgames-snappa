import { nanoid } from "nanoid";

export function createId(prefix = "el"): string {
  return `${prefix}_${nanoid(10)}`;
}
