/** `tel:` link for a display phone number, keeping only digits and `+`. */
export function telHref(phone: string | null | undefined): string | undefined {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/** Public URL for a file stored in the uploads directory (served by app/media/[...path]). */
export function mediaUrl(relative: string | null | undefined): string | null {
  return relative ? `/media/${relative}` : null;
}
