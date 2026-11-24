import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { STORAGE_DIR } from "./db";
import { integrationEnv } from "./env";

/**
 * Uploaded files go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production),
 * otherwise to storage/uploads (local development), served by app/media/[...path].
 *
 * A stored value is either a Blob URL (https://…) or a path relative to the uploads directory.
 */

export const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");

export function blobToken() {
  return integrationEnv("BLOB_READ_WRITE_TOKEN");
}

export function blobEnabled() {
  return Boolean(blobToken());
}

export type Collection = "advertisements" | "companies" | "events" | "photos" | "company-profile";
export type FileKind = "image" | "pdf";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

export const ALLOWED_CONTENT_TYPES = Object.keys(EXTENSIONS);

export const MIME_TYPES: Record<string, string> = {
  ...Object.fromEntries(Object.entries(EXTENSIONS).map(([mime, ext]) => [ext, mime])),
  ".jpeg": "image/jpeg",
};

export function isFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && value.size > 0;
}

export function fileMatchesKind(file: File, kind: FileKind) {
  return kind === "pdf" ? file.type === "application/pdf" : file.type.startsWith("image/") && file.type in EXTENSIONS;
}

/**
 * True for a URL of a file the browser already uploaded straight to this project's
 * public Blob store (used for admin uploads larger than Vercel's 4.5 MB request limit).
 */
export function isUploadedBlobUrl(value: FormDataEntryValue | null, kind: FileKind): value is string {
  if (typeof value !== "string" || !blobEnabled()) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com")) return false;
  // The store id is the first label of the hostname and also appears in the token.
  const storeId = url.hostname.split(".")[0];
  if (!blobToken()!.toLowerCase().includes(storeId.toLowerCase())) return false;
  const type = MIME_TYPES[path.extname(url.pathname).toLowerCase()];
  return kind === "pdf" ? type === "application/pdf" : Boolean(type?.startsWith("image/"));
}

/** Saves a file and returns the value to store: a Blob URL, or a relative path locally. */
export async function saveUpload(file: File, collection: Collection): Promise<string> {
  const ext = EXTENSIONS[file.type] ?? ".bin";
  const relative = `${collection}/${randomUUID()}${ext}`;

  if (blobEnabled()) {
    const blob = await put(relative, file, { access: "public", contentType: file.type, token: blobToken() });
    return blob.url;
  }

  const target = path.join(UPLOADS_DIR, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
  return relative;
}

/** Resolves a stored local path to an absolute one, refusing anything outside the uploads directory. */
export function resolveUpload(relative: string): string | null {
  if (isRemote(relative)) return null;
  const target = path.resolve(UPLOADS_DIR, relative);
  return target.startsWith(UPLOADS_DIR + path.sep) ? target : null;
}

export function isRemote(stored: string) {
  return /^https?:\/\//.test(stored);
}

/** Removes one uploaded file (a Blob, or a single file inside the uploads directory). */
export async function deleteUpload(stored: string | null | undefined) {
  if (!stored) return;
  if (isRemote(stored)) {
    if (blobEnabled()) await del(stored, { token: blobToken() }).catch((e) => console.error("Blob delete failed", stored, e));
    return;
  }
  const target = resolveUpload(stored);
  if (target) await fs.unlink(target).catch(() => {});
}
