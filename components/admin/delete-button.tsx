"use client";

import { useFormStatus } from "react-dom";
import { Glyph } from "@/components/glyph";

function Submit({ label, confirmText, compact }: { label: string; confirmText: string; compact?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className={compact ? "grid h-8 w-8 place-items-center rounded-md bg-white/90 text-red-700 shadow hover:bg-red-50" : "btn-danger"}
      aria-label={label}
      title={label}
    >
      <Glyph name={pending ? "spinner" : "trash"} className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
      {!compact && label}
    </button>
  );
}

/** A form with one confirm-before-submit delete button. */
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this record? This cannot be undone.",
  compact,
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
  compact?: boolean;
}) {
  return (
    <form action={action}>
      <Submit label={label} confirmText={confirmText} compact={compact} />
    </form>
  );
}
