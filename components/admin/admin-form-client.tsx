"use client";

import { startTransition, useActionState, useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";
import { FormMessage } from "@/components/form-message";
import { Glyph } from "@/components/glyph";
import type { FormState } from "@/lib/form-state";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "password" | "textarea" | "file";
  required?: boolean;
  help?: string;
  placeholder?: string;
  autoComplete?: string;
  /** file inputs */
  accept?: string;
  multiple?: boolean;
  /** Current uploaded file, shown above a file input. */
  current?: { url: string; kind: "image" | "pdf" };
  /** Spans both columns of the grid. */
  wide?: boolean;
};

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: FieldSpec[];
  defaults?: Record<string, string | number | null | undefined>;
  submitLabel: string;
  /** Clear inputs after a successful submit (upload forms). */
  resetOnSuccess?: boolean;
  columns?: 1 | 2;
  /**
   * Upload chosen files from the browser straight to Vercel Blob and send only
   * their URLs to the Server Action (needed on Vercel, which caps requests at 4.5 MB).
   */
  directUpload?: boolean;
  blobAccess?: "public" | "private";
};

/** Replaces each chosen file with the URL of the same file uploaded to Vercel Blob. */
async function uploadFiles(
  formData: FormData,
  access: "public" | "private",
  onProgress: (text: string) => void,
): Promise<FormData> {
  const files = [...formData.entries()].filter((e): e is [string, File] => e[1] instanceof File && e[1].size > 0);
  const out = new FormData();
  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File)) out.append(key, value);
  }
  for (const [i, [key, file]] of files.entries()) {
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase().replace(/[^.a-z0-9]/g, "") : "";
    const blob = await uploadPresigned(`uploads/file${ext}`, file, {
      access,
      handleUploadUrl: "/api/blob-upload",
      contentType: file.type,
      multipart: file.size > 5 * 1024 * 1024,
      onUploadProgress: ({ percentage }) =>
        onProgress(`Uploading ${files.length > 1 ? `${i + 1} of ${files.length}` : file.name} — ${Math.round(percentage)}%`),
    });
    out.append(key, blob.url);
  }
  return out;
}

export function AdminForm({
  action,
  fields,
  defaults = {},
  submitLabel,
  resetOnSuccess,
  columns = 2,
  directUpload,
  blobAccess = "public",
}: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);
  const [progress, setProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const busy = pending || progress !== null;

  async function submit(formData: FormData) {
    setUploadError(null);
    let data = formData;
    if (directUpload) {
      try {
        setProgress("Uploading…");
        data = await uploadFiles(formData, blobAccess, setProgress);
      } catch (e) {
        setUploadError(`Upload failed: ${(e as Error).message}`);
        return;
      } finally {
        setProgress(null);
      }
    }
    startTransition(() => formAction(data));
  }

  const errors = state.errors ?? {};
  const keepValues = state.values && !(resetOnSuccess && state.status === "success");
  const valueOf = (name: string) => (keepValues ? state.values?.[name] : (defaults[name] ?? undefined)) ?? undefined;

  return (
    <form action={directUpload ? submit : formAction} noValidate className="space-y-6">
      <FormMessage state={uploadError ? { status: "error", message: uploadError } : state} />
      <div className={`grid gap-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {fields.map((f) => {
          const id = `f-${f.name}`;
          const error = errors[f.name];
          const wide = f.wide || f.type === "textarea" || f.type === "file" || columns === 1;
          return (
            <div key={f.name} className={wide && columns === 2 ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="label">
                {f.label}
                {f.required && <span className="text-red-600"> *</span>}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  id={id}
                  name={f.name}
                  rows={6}
                  defaultValue={valueOf(f.name) ?? ""}
                  placeholder={f.placeholder}
                  aria-invalid={!!error}
                  className="field"
                />
              ) : f.type === "file" ? (
                <>
                  {f.current &&
                    (f.current.kind === "image" ? (
                      <img src={f.current.url} alt="Current file" className="mb-3 h-32 w-auto rounded-md border border-line object-cover" />
                    ) : (
                      <a href={f.current.url} className="link mb-3 inline-flex items-center gap-2 text-sm" target="_blank" rel="noreferrer">
                        <Glyph name="file" className="h-4 w-4" />
                        View current file
                      </a>
                    ))}
                  <input
                    id={id}
                    name={f.name}
                    type="file"
                    accept={f.accept}
                    multiple={f.multiple}
                    aria-invalid={!!error}
                    className="block w-full rounded-md border border-dashed border-ink/25 bg-white px-4 py-3 text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:font-display file:text-sm file:font-medium file:text-brand-800 hover:border-brand-700"
                  />
                </>
              ) : (
                <input
                  id={id}
                  name={f.name}
                  type={f.type ?? "text"}
                  min={f.type === "number" ? 0 : undefined}
                  step={f.type === "number" ? 1 : undefined}
                  defaultValue={f.type === "password" ? undefined : (valueOf(f.name) ?? "")}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  aria-invalid={!!error}
                  className="field"
                />
              )}

              {f.help && !error && <p className="mt-1.5 text-xs text-muted">{f.help}</p>}
              {error && <span className="error">{error}</span>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy && <Glyph name="spinner" className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
        {progress && <span className="text-sm text-muted" aria-live="polite">{progress}</span>}
      </div>
    </form>
  );
}
