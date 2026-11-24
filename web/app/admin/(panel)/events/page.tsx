import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, EmptyRow, NewButton } from "@/components/admin/admin-page";
import { getEvents } from "@/lib/data";
import { mediaUrl, plural } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Events" };

export default async function EventsAdminPage() {
  await requireAdmin();
  const events = await getEvents();

  return (
    <AdminPage title="Events" actions={<NewButton href="/admin/events/new" label="New event" />}>
      {events.length === 0 ? (
        <EmptyRow>No events yet.</EmptyRow>
      ) : (
        <ul className="card divide-y divide-line">
          {events.map((e) => (
            <li key={e.id}>
              <Link href={`/admin/events/${e.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-mist/60">
                {e.cover_image ? (
                  <img src={mediaUrl(e.cover_image)!} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
                ) : (
                  <span className="h-12 w-16 shrink-0 rounded bg-grey" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{e.name}</span>
                  {e.description && <span className="block truncate text-sm text-muted">{e.description}</span>}
                </span>
                <span className="shrink-0 text-sm text-muted">{plural(e.photo_count, "photo")}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
