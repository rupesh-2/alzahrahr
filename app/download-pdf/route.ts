import fs from "node:fs/promises";
import { getCompanyProfile } from "@/lib/data";
import { resolveUpload } from "@/lib/storage";

/** Streams the company profile PDF uploaded in the admin panel. */
export async function GET() {
  const profile = await getCompanyProfile();
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
