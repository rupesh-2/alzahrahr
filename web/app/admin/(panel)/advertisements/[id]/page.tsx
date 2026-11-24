import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdvertisement, parseId } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { deleteAdvertisement, saveAdvertisement } from "../../../actions";
import { advertisementFields } from "../fields";

export const metadata: Metadata = { title: "Edit vacancy" };

export default async function EditAdvertisementPage({ params }: PageProps<"/admin/advertisements/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const ad = id === null ? undefined : await getAdvertisement(id);
  if (!ad) notFound();

  return (
    <AdminPage
      title={`Edit ${ad.job_title || "vacancy"}`}
      back={{ href: "/admin/advertisements", label: "Vacancies" }}
      actions={<DeleteButton action={deleteAdvertisement.bind(null, ad.id)} confirmText="Delete this vacancy?" />}
    >
      <Panel>
        <AdminForm
          action={saveAdvertisement.bind(null, ad.id)}
          fields={advertisementFields(mediaUrl(ad.image))}
          defaults={ad}
          submitLabel="Save changes"
        />
      </Panel>
    </AdminPage>
  );
}
