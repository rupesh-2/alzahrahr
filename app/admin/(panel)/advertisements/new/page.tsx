import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { requireAdmin } from "@/lib/session";
import { saveAdvertisement } from "../../../actions";
import { advertisementFields } from "../fields";

export const metadata: Metadata = { title: "New vacancy" };

export default async function NewAdvertisementPage() {
  await requireAdmin();
  return (
    <AdminPage title="New vacancy" back={{ href: "/admin/advertisements", label: "Vacancies" }}>
      <Panel>
        <AdminForm
          action={saveAdvertisement.bind(null, null)}
          fields={advertisementFields(null)}
          defaults={{ male_required: 0, female_required: 0, salary: 0 }}
          submitLabel="Create"
        />
      </Panel>
    </AdminPage>
  );
}
