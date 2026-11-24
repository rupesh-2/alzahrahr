import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { requireAdmin } from "@/lib/session";
import { saveClient } from "../../../actions";

export const metadata: Metadata = { title: "New client country" };

export default async function NewClientPage() {
  await requireAdmin();
  return (
    <AdminPage title="New client country" back={{ href: "/admin/clients", label: "Clients" }}>
      <Panel>
        <AdminForm
          action={saveClient.bind(null, null)}
          fields={[{ name: "country_name", label: "Country name", required: true }]}
          columns={1}
          submitLabel="Create"
        />
      </Panel>
    </AdminPage>
  );
}
