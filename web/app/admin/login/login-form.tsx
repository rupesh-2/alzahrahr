"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/form-message";
import { Glyph } from "@/components/glyph";
import type { FormState } from "@/lib/form-state";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { status: "idle" } as FormState);

  return (
    <form action={action} className="mt-6 space-y-5">
      <FormMessage state={state} />
      <div>
        <label htmlFor="email" className="label">
          Email address
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" defaultValue={state.values?.email} className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending && <Glyph name="spinner" className="h-4 w-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
