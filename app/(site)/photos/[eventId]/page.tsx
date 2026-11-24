import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lightbox } from "@/components/lightbox";
import { PageHeader } from "@/components/page-header";
import { getEvent, getEventPhotos, parseId } from "@/lib/data";
import { mediaUrl } from "@/lib/format";

async function load(params: PageProps<"/photos/[eventId]">["params"]) {
  const id = parseId((await params).eventId);
  const event = id === null ? undefined : await getEvent(id);
  if (!event) notFound();
  return event;
}

export async function generateMetadata({ params }: PageProps<"/photos/[eventId]">): Promise<Metadata> {
  return { title: (await load(params)).name };
}

export default async function PhotosPage({ params }: PageProps<"/photos/[eventId]">) {
  const event = await load(params);
  const photos = await getEventPhotos(event.id);

  return (
    <div>
      <PageHeader title={event.name} eyebrow="Event gallery" parent={{ label: "Events", href: "/events" }} />

      <section className="container py-20">
        {photos.length > 0 ? (
          <Lightbox
            variant="photos"
            items={photos.map((p) => ({ src: mediaUrl(p.path)!, alt: `${event.name} photo` }))}
          />
        ) : (
          <p className="card p-10 text-center text-muted">No photos in this event yet.</p>
        )}
      </section>
    </div>
  );
}
