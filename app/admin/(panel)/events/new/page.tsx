import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { requireAdmin } from "@/lib/session";
import { saveEvent } from "../../../actions";

export const metadata: Metadata = { title: "New event" };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <AdminPage title="New event" back={{ href: "/admin/events", label: "Events" }}>
      <Panel>
        <AdminForm
          action={saveEvent.bind(null, null)}
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "description", label: "Description" },
            { name: "cover_image", label: "Event photo (cover)", type: "file", accept: "image/*", required: true },
          ]}
          submitLabel="Create"
        />
        <p className="mt-4 text-sm text-muted">You can add gallery photos after creating the event.</p>
      </Panel>
    </AdminPage>
  );
}
