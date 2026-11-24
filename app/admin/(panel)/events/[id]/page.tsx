import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { getEvent, getEventPhotos, parseId } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { addPhotos, deleteEvent, deletePhoto, saveEvent } from "../../../actions";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: PageProps<"/admin/events/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const event = id === null ? undefined : await getEvent(id);
  if (!event) notFound();
  const photos = await getEventPhotos(event.id);
  const cover = mediaUrl(event.cover_image);

  return (
    <AdminPage
      title={event.name}
      back={{ href: "/admin/events", label: "Events" }}
      actions={
        <DeleteButton
          action={deleteEvent.bind(null, event.id)}
          label="Delete event"
          confirmText={`Delete this event and its ${photos.length} photos?`}
        />
      }
    >
      <Panel title="Event">
        <AdminForm
          action={saveEvent.bind(null, event.id)}
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "description", label: "Description" },
            {
              name: "cover_image",
              label: cover ? "Replace event photo (cover)" : "Event photo (cover)",
              type: "file",
              accept: "image/*",
              required: !cover,
              current: cover ? { url: cover, kind: "image" } : undefined,
            },
          ]}
          defaults={event}
          submitLabel="Save changes"
        />
      </Panel>

      <Panel title={`Gallery photos (${photos.length})`}>
        {photos.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <li key={p.id} className="relative overflow-hidden rounded-md bg-grey">
                <img src={mediaUrl(p.path)!} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="absolute top-2 right-2">
                  <DeleteButton action={deletePhoto.bind(null, p.id)} label="Remove photo" confirmText="Remove this photo?" compact />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No gallery photos yet.</p>
        )}
        <div className="mt-6 border-t border-line pt-6">
          <AdminForm
            action={addPhotos.bind(null, event.id)}
            fields={[
              { name: "photos", label: "Add photos", type: "file", accept: "image/*", multiple: true, help: "You can select several images at once." },
            ]}
            columns={1}
            resetOnSuccess
            submitLabel="Upload"
          />
        </div>
      </Panel>
    </AdminPage>
  );
}
