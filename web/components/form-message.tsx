import { Glyph } from "./glyph";

/** Success or error banner for a form's action state. */
export function FormMessage({
  state,
  className = "",
}: {
  state: { status: string; message?: string };
  className?: string;
}) {
  if (!state.message) return null;
  return state.status === "success" ? (
    <p role="status" className={`flex items-center gap-2 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-800 ${className}`}>
      <Glyph name="check" className="h-4 w-4" />
      {state.message}
    </p>
  ) : (
    <p role="alert" className={`rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}>
      {state.message}
    </p>
  );
}
