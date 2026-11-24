import fs from "node:fs/promises";
import { getCompanyProfile } from "@/lib/data";
import { getDownloadUrl } from "@vercel/blob";
import { isRemote, parseBlobUrl, presignedReadUrl, resolveUpload } from "@/lib/storage";

/** Sends the company profile PDF uploaded in the admin panel. */
export async function GET() {
  const profile = await getCompanyProfile();
  // On Vercel the file is in Blob storage: redirect to its download URL rather than
  // proxying ~20 MB through a function.
  if (profile?.profile_pdf && isRemote(profile.profile_pdf)) {
    const blob = parseBlobUrl(profile.profile_pdf);
    if (!blob) return new Response("PDF not found", { status: 404 });
    const target = blob.access === "private" ? await presignedReadUrl(blob.pathname, 10) : getDownloadUrl(profile.profile_pdf);
    return Response.redirect(target, 307);
  }
  const file = profile?.profile_pdf ? resolveUpload(profile.profile_pdf) : null;
  if (!file) return new Response("PDF not found", { status: 404 });

  try {
    const data = await fs.readFile(file);
    return new Response(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Company Profile.pdf"',
        "Content-Length": String(data.length),
      },
    });
  } catch {
    return new Response("PDF not found", { status: 404 });
  }
}
