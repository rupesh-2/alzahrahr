/** `tel:` link for a display phone number, keeping only digits and `+`. */
export function telHref(phone: string | null | undefined): string | undefined {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/** Public URL of an uploaded file: Blob URLs as-is, local paths via app/media/[...path]. */
export function mediaUrl(stored: string | null | undefined): string | null {
  if (!stored) return null;
  return /^https?:\/\//.test(stored) ? stored : `/media/${stored}`;
}
