"use client";

import { useActionState, useState } from "react";
import { Glyph } from "@/components/glyph";
import { FormMessage } from "@/components/form-message";
import { applyNow, type ApplyField } from "../actions";
import type { FormState } from "@/lib/form-state";

// Sections and fields as in the original apply form.
const GROUPS: [string, [ApplyField, string, string, string, string][]][] = [
  [
    "User information",
    [
      ["userName", "Full name", "text", "name", "Full name"],
      ["email", "Email address", "email", "email", "Email"],
      ["firstName", "First name", "text", "given-name", "First name"],
      ["lastName", "Last name", "text", "family-name", "Last name"],
    ],
  ],
  [
    "Contact information",
    [
      ["address", "Address", "text", "street-address", "Address"],
      ["city", "City", "text", "address-level2", "City"],
      ["country", "Country", "text", "country-name", "Country"],
      ["phoneNumber", "Phone number", "tel", "tel", "+977-phone no"],
    ],
  ],
];

const UPLOADS = [
  ["cv", "Upload a C.V", ".pdf,.doc,.docx,image/*"],
  ["passport", "Upload scanned passport", ".pdf,image/*"],
  ["photo", "Upload your latest photo", "image/*"],
] as const;

type UploadKey = (typeof UPLOADS)[number][0];
const MAX_BYTES = 1024 * 1024;

const initial: FormState<ApplyField> = { status: "idle" };

export function ApplyForm() {
  const [state, action, pending] = useActionState(applyNow, initial);
  const [picked, setPicked] = useState<Partial<Record<UploadKey, string>>>({});
  const [sizeErrors, setSizeErrors] = useState<Partial<Record<UploadKey, string>>>({});

  // React resets the form after each submission, which empties the file inputs,
  // so forget the picked file names whenever a new result arrives.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setPicked({});
    setSizeErrors({});
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};

  function onPick(key: UploadKey, input: HTMLInputElement) {
    const file = input.files?.[0];
    if (file && file.size > MAX_BYTES) {
      input.value = "";
      setPicked((p) => ({ ...p, [key]: undefined }));
      setSizeErrors((s) => ({ ...s, [key]: `${file.name} is larger than 1 MB. Please choose a smaller file.` }));
      return;
    }
    setSizeErrors((s) => ({ ...s, [key]: undefined }));
    setPicked((p) => ({ ...p, [key]: file?.name }));
  }

  return (
    <form action={action} noValidate className="space-y-6 lg:col-span-8">
      <FormMessage state={state} />
      {state.status === "error" && !state.message && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Please correct the highlighted fields{Object.keys(e).some((k) => UPLOADS.some(([u]) => u === k)) ? " and attach your documents again" : ""}.
        </p>
      )}

      {GROUPS.map(([heading, fields]) => (
        <fieldset key={heading} className="rounded-lg border border-line p-6 sm:p-8">
          <legend className="sr-only">{heading}</legend>
          <h2 className="text-lg">{heading}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map(([name, label, type, autoComplete, placeholder]) => (
              <div key={name}>
                <label htmlFor={name} className="label">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  defaultValue={v[name]}
                  aria-invalid={!!e[name]}
                  className="field"
                />
                {e[name] && <span className="error">{e[name]}</span>}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="rounded-lg border border-line p-6 sm:p-8">
        <legend className="sr-only">Job description</legend>
        <h2 className="text-lg">Job description</h2>
        <label htmlFor="aboutMe" className="label mt-6">
          About yourself
        </label>
        <textarea
          id="aboutMe"
          name="aboutMe"
          rows={4}
          defaultValue={v.aboutMe}
          aria-invalid={!!e.aboutMe}
          className="field resize-none"
          placeholder="Please write company name and job title for which you want to apply"
        />
        {e.aboutMe && <span className="error">{e.aboutMe}</span>}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {UPLOADS.map(([key, label, accept]) => {
            const name = picked[key];
            const error = sizeErrors[key] ?? (name ? undefined : e[key]);
            return (
              <div key={key}>
                <label
                  htmlFor={key}
                  className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-7 text-center transition hover:border-brand-700 hover:bg-mist ${
                    name ? "border-brand-700 bg-mist" : "border-ink/25"
                  }`}
                >
                  <span className="text-brand-700">
                    <Glyph name={name ? "check" : "upload"} className="h-6 w-6" />
                  </span>
                  <span className="mt-3 font-display text-sm font-medium">{label}</span>
                  <span className="mt-1 w-full truncate text-xs text-muted">{name ?? "Choose a file, up to 1 MB"}</span>
                  <input
                    id={key}
                    name={key}
                    type="file"
                    accept={accept}
                    className="sr-only"
                    onChange={(ev) => onPick(key, ev.currentTarget)}
                  />
                </label>
                {error && <span className="error">{error}</span>}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="btn-primary w-full px-8 sm:w-auto">
          {pending && <Glyph name="spinner" className="h-4 w-4 animate-spin" />}
          {pending ? "Processing…" : "Apply now"}
        </button>
      </div>
    </form>
  );
}
