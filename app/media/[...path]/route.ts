import fs from "node:fs/promises";
import path from "node:path";
import { blobEnabled, MIME_TYPES, presignedReadUrl, resolveUpload } from "@/lib/storage";

const BLOB_PATH = /^(advertisements|companies|events|photos|company-profile|uploads)\/[^/]+$/;

/**
 * Serves uploaded files: local files from storage/uploads, or (under /media/blob/…)
 * a redirect to a short-lived link for a file in a private Blob store.
 */
export async function GET(_req: Request, ctx: RouteContext<"/media/[...path]">) {
  const segments = (await ctx.params).path;

  if (segments[0] === "blob") {
    const pathname = segments.slice(1).join("/");
    if (!blobEnabled() || !BLOB_PATH.test(pathname)) return new Response("Not found", { status: 404 });
    const url = await presignedReadUrl(pathname);
    return new Response(null, { status: 307, headers: { Location: url, "Cache-Control": "private, max-age=300" } });
  }

  const file = resolveUpload(segments.join("/"));
  const type = file ? MIME_TYPES[path.extname(file).toLowerCase()] : undefined;
  if (!file || !type) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(file);
    return new Response(data, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(data.length),
        // File names are random UUIDs and never reused, so they can be cached for good.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
