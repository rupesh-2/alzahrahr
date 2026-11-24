import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { getCurrentUser } from "@/lib/session";
import { ALLOWED_CONTENT_TYPES, issueUploadToken, MAX_UPLOAD_BYTES } from "@/lib/storage";

/**
 * Signs short-lived upload URLs so the admin's browser can upload files straight
 * to Vercel Blob, bypassing Vercel's 4.5 MB request limit for Server Actions.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadPresignedBody;
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        if (!(await getCurrentUser())) throw new Error("Not signed in");
        if (!/^uploads\/[^/]+$/.test(pathname)) throw new Error("Invalid upload path");
        return {
          token: await issueUploadToken(pathname),
          urlOptions: {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            addRandomSuffix: true,
          },
        };
      },
      // The record is saved by the form's Server Action once the upload finishes.
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
