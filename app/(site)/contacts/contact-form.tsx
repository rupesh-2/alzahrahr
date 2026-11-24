"use client";

import { useActionState } from "react";
import { Glyph } from "@/components/glyph";
import { FormMessage } from "@/components/form-message";
import { contactUs, type ContactField } from "../actions";
import type { FormState } from "@/lib/form-state";

const initial: FormState<ContactField> = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(contactUs, initial);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={action} noValidate className="rounded-lg border border-line p-6 sm:p-10 lg:col-span-7">
      <h2 className="text-[1.6rem]">Ready to get started?</h2>
      <p className="mt-2 text-muted">Send us a message and our team will respond.</p>

      <FormMessage state={state} className="mt-6" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" name="name" type="text" defaultValue={v.name} className="field" placeholder="Your name" autoComplete="name" aria-invalid={!!e.name} />
          {e.name && <span className="error">{e.name}</span>}
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" defaultValue={v.email} className="field" placeholder="Your email address" autoComplete="email" aria-invalid={!!e.email} />
          {e.email && <span className="error">{e.email}</span>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="label">
            Message
          </label>
          <textarea id="message" name="message" rows={6} defaultValue={v.message} className="field resize-none" placeholder="Write your message..." aria-invalid={!!e.message} />
          {e.message && <span className="error">{e.message}</span>}
        </div>
      </div>

      <button type="submit" disabled={pending} className="btn-primary mt-8 w-full sm:w-auto">
        {pending && <Glyph name="spinner" className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}
