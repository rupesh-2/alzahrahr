/** `tel:` link for a display phone number, keeping only digits and `+`. */
export function telHref(phone: string | null | undefined): string | undefined {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/**
 * URL to show an uploaded file: public Blob URLs as-is; private Blob files and
 * local files through app/media/[...path].
 */
export function mediaUrl(stored: string | null | undefined): string | null {
  if (!stored) return null;
  if (!/^https?:\/\//.test(stored)) return `/media/${stored}`;
  const url = new URL(stored);
  return url.hostname.includes(".private.blob.") ? `/media/blob${url.pathname}` : stored;
}
