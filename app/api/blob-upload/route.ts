import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentUser } from "@/lib/session";
import { ALLOWED_CONTENT_TYPES } from "@/lib/storage";

const MAX_BYTES = 50 * 1024 * 1024;

/**
 * Issues short-lived tokens so the admin's browser can upload files straight to
 * Vercel Blob, bypassing Vercel's 4.5 MB request limit for Server Actions.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await getCurrentUser())) throw new Error("Not signed in");
        return { allowedContentTypes: ALLOWED_CONTENT_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      // The record is saved by the form's Server Action once the upload finishes.
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
