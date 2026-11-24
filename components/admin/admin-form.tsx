import type { ComponentProps } from "react";
import { blobAccess, blobEnabled } from "@/lib/storage";
import { AdminForm as AdminFormClient } from "./admin-form-client";

export type { FieldSpec } from "./admin-form-client";

/** Admin form; uploads go straight from the browser to Vercel Blob when it is configured. */
export function AdminForm(props: Omit<ComponentProps<typeof AdminFormClient>, "directUpload" | "blobAccess">) {
  return <AdminFormClient {...props} directUpload={blobEnabled()} blobAccess={blobAccess()} />;
}
