/** Result of a form Server Action, consumed with useActionState. */
export type FormState<K extends string = string> = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<K, string>>;
  values?: Partial<Record<K, string>>;
};

export const idle = { status: "idle" } as const;
