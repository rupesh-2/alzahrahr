import fs from "node:fs/promises";
import path from "node:path";
import { MIME_TYPES, resolveUpload } from "@/lib/storage";

/** Serves files uploaded through the admin panel from storage/uploads. */
export async function GET(_req: Request, ctx: RouteContext<"/media/[...path]">) {
  const segments = (await ctx.params).path;
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
