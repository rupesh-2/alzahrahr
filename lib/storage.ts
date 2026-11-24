import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, issueSignedToken, presignUrl, put } from "@vercel/blob";
import { STORAGE_DIR } from "./db";
import { integrationEnv } from "./env";

/**
 * Uploaded files go to Vercel Blob when a Blob store is connected (production),
 * otherwise to storage/uploads (local development), served by app/media/[...path].
 *
 * A stored value is either a Blob URL (https://…) or a path relative to the uploads directory.
 *
 * Blob credentials: a connected store provides BLOB_STORE_ID (the SDK then authenticates
 * with the deployment's OIDC token), or an older connection provides BLOB_READ_WRITE_TOKEN.
 */

export const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");

/** A read-write token, if the store was connected that way (possibly with a prefixed name). */
function readWriteToken() {
  return integrationEnv("BLOB_READ_WRITE_TOKEN");
}

/** Lower-case store id as it appears in Blob hostnames, e.g. `abc123` in abc123.public.blob.vercel-storage.com. */
function storeId(): string | undefined {
  const fromEnv = integrationEnv("BLOB_STORE_ID");
  if (fromEnv) return fromEnv.replace(/^store_/, "").toLowerCase();
  const token = readWriteToken();
  return token?.split("_")[3]?.toLowerCase();
}

export function blobEnabled() {
  return Boolean(storeId());
}

/** Access level of the connected store. Set BLOB_ACCESS=private for a private store. */
export function blobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

/** Explicit credentials only when a (possibly prefixed) read-write token exists; otherwise the SDK uses OIDC. */
function credentials() {
  const token = readWriteToken();
  return token ? { token } : {};
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
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

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

/** Parses a URL in this project's Blob store; null for anything else. */
export function parseBlobUrl(value: string): { url: URL; access: "public" | "private"; pathname: string } | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const match = /^([a-z0-9]+)\.(public|private)\.blob\.vercel-storage\.com$/.exec(url.hostname);
  if (url.protocol !== "https:" || !match || match[1] !== storeId()) return null;
  return { url, access: match[2] as "public" | "private", pathname: decodeURIComponent(url.pathname.slice(1)) };
}

/**
 * True for the URL of a file the browser already uploaded straight to this project's
 * Blob store (admin uploads, which can exceed Vercel's 4.5 MB request limit).
 */
export function isUploadedBlobUrl(value: FormDataEntryValue | null, kind: FileKind): value is string {
  if (typeof value !== "string" || !blobEnabled()) return false;
  const blob = parseBlobUrl(value);
  if (!blob) return false;
  const type = MIME_TYPES[path.extname(blob.pathname).toLowerCase()];
  return kind === "pdf" ? type === "application/pdf" : Boolean(type?.startsWith("image/"));
}

/** Saves a file and returns the value to store: a Blob URL, or a relative path locally. */
export async function saveUpload(file: File, collection: Collection): Promise<string> {
  const ext = EXTENSIONS[file.type] ?? ".bin";
  const relative = `${collection}/${randomUUID()}${ext}`;

  if (blobEnabled()) {
    const blob = await put(relative, file, { access: blobAccess(), contentType: file.type, ...credentials() });
    return blob.url;
  }

  const target = path.join(UPLOADS_DIR, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
  return relative;
}

/** Short-lived signed token allowing one browser upload to `pathname` (used by app/api/blob-upload). */
export async function issueUploadToken(pathname: string) {
  return issueSignedToken({
    pathname,
    operations: ["put"],
    allowedContentTypes: ALLOWED_CONTENT_TYPES,
    maximumSizeInBytes: MAX_UPLOAD_BYTES,
    validUntil: Date.now() + 15 * 60 * 1000,
    ...credentials(),
  });
}

/** A temporary link to read a file in a private store. */
export async function presignedReadUrl(pathname: string, validMinutes = 60): Promise<string> {
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil: Date.now() + validMinutes * 60 * 1000,
    ...credentials(),
  });
  const { presignedUrl } = await presignUrl(token, { operation: "get", pathname, access: "private" });
  return presignedUrl;
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
    if (blobEnabled()) await del(stored, credentials()).catch((e) => console.error("Blob delete failed", stored, e));
    return;
  }
  const target = resolveUpload(stored);
  if (target) await fs.unlink(target).catch(() => {});
}
