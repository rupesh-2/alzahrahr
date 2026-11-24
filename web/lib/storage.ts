import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { STORAGE_DIR } from "./db";

/** Uploaded files live outside /public so they can be added at runtime; /media serves them. */
export const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");

export type Collection = "advertisements" | "companies" | "events" | "photos" | "company-profile";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

export const MIME_TYPES: Record<string, string> = {
  ...Object.fromEntries(Object.entries(EXTENSIONS).map(([mime, ext]) => [ext, mime])),
  ".jpeg": "image/jpeg",
};

export function isFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && value.size > 0;
}

export function isImage(file: File) {
  return file.type.startsWith("image/") && file.type in EXTENSIONS;
}

/** Saves a file and returns its path relative to the uploads directory, e.g. `events/<uuid>.jpg`. */
export async function saveUpload(file: File, collection: Collection): Promise<string> {
  const ext = EXTENSIONS[file.type] ?? ".bin";
  const relative = `${collection}/${randomUUID()}${ext}`;
  const target = path.join(UPLOADS_DIR, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
  return relative;
}

/** Resolves a stored path to an absolute one, refusing anything outside the uploads directory. */
export function resolveUpload(relative: string): string | null {
  const target = path.resolve(UPLOADS_DIR, relative);
  return target.startsWith(UPLOADS_DIR + path.sep) ? target : null;
}

/** Removes one uploaded file (a single file inside the uploads directory, never a folder). */
export async function deleteUpload(relative: string | null | undefined) {
  if (!relative) return;
  const target = resolveUpload(relative);
  if (target) await fs.unlink(target).catch(() => {});
}
