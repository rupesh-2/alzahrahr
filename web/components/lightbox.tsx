"use client";

import { useEffect, useState } from "react";

type Item = { src: string; alt: string; title?: string };

/**
 * An image grid; clicking an image shows it full screen until the overlay is
 * clicked or Escape is pressed.
 */
export function Lightbox({ items, variant }: { items: Item[]; variant: "certificates" | "photos" }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  return (
    <>
      {variant === "certificates" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setPreview(item.src)}
              className="group card overflow-hidden text-left transition hover:border-ink/30"
            >
              <div className="aspect-[3/4] overflow-hidden bg-sand p-4">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full rounded-lg object-contain transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <p className="border-t border-line px-5 py-4 text-sm font-medium">{item.title}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setPreview(item.src)}
              className="mb-4 block w-full overflow-hidden rounded-md"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full transition duration-500 hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/85 p-6 backdrop-blur-sm"
        >
          <img src={preview} alt="" className="max-h-full max-w-full rounded shadow-2xl" />
        </div>
      )}
    </>
  );
}
