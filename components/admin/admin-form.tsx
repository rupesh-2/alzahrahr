import type { ComponentProps } from "react";
import { blobEnabled } from "@/lib/storage";
import { AdminForm as AdminFormClient } from "./admin-form-client";

export type { FieldSpec } from "./admin-form-client";

/** Admin form; uploads go straight from the browser to Vercel Blob when it is configured. */
export function AdminForm(props: Omit<ComponentProps<typeof AdminFormClient>, "directUpload">) {
  return <AdminFormClient {...props} directUpload={blobEnabled()} />;
}
