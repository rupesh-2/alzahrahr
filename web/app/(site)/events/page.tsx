import type { Metadata } from "next";
import Link from "next/link";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { getEvents } from "@/lib/data";
import { mediaUrl, plural } from "@/lib/format";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <PageHeader title="Latest events" eyebrow="Events">
        Photos from our events and activities.
      </PageHeader>

      <section className="container py-20">
        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const cover = mediaUrl(event.cover_image);
              return (
                <Link
                  key={event.id}
                  href={`/photos/${event.id}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-md bg-sand"
                >
                  {cover && (
                    <img
                      src={cover}
                      alt={event.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="flex items-center gap-1.5 text-xs text-white/70">
                      <Glyph name="image" className="h-3.5 w-3.5" />
                      {plural(event.photo_count, "photo")}
                    </p>
                    <h2 className="mt-1 font-sans text-lg font-semibold text-white">{event.name}</h2>
                    {event.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-white/80">{event.description}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="card p-10 text-center text-muted">No events to show yet.</p>
        )}
      </section>
    </div>
  );
}
