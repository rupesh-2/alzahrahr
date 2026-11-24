import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { all, get } from "@/lib/db";
import type { Client, Company } from "@/lib/data";
import { parseId } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { addCompanies, deleteClient, deleteCompany, saveClient } from "../../../actions";

export const metadata: Metadata = { title: "Edit client country" };

export default async function EditClientPage({ params }: PageProps<"/admin/clients/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const client = id === null ? undefined : get<Client>("SELECT id, country_name FROM clients WHERE id = ?", id);
  if (!client) notFound();
  const companies = all<Company>("SELECT * FROM companies WHERE client_id = ? ORDER BY id", client.id);

  return (
    <AdminPage
      title={client.country_name}
      back={{ href: "/admin/clients", label: "Clients" }}
      actions={
        <DeleteButton
          action={deleteClient.bind(null, client.id)}
          label="Delete country"
          confirmText={`Delete ${client.country_name} and all of its ${companies.length} logos?`}
        />
      }
    >
      <Panel title="Country">
        <AdminForm
          action={saveClient.bind(null, client.id)}
          fields={[{ name: "country_name", label: "Country name", required: true }]}
          defaults={client}
          columns={1}
          submitLabel="Save changes"
        />
      </Panel>

      <Panel title={`Company logos (${companies.length})`}>
        {companies.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {companies.map((co) => (
              <li key={co.id} className="relative grid aspect-[3/2] place-items-center rounded-md border border-line bg-white p-4">
                <img src={mediaUrl(co.logo)!} alt="Client logo" className="max-h-full max-w-full object-contain" />
                <div className="absolute top-2 right-2">
                  <DeleteButton action={deleteCompany.bind(null, co.id)} label="Remove logo" confirmText="Remove this logo?" compact />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No logos yet.</p>
        )}
        <div className="mt-6 border-t border-line pt-6">
          <AdminForm
            action={addCompanies.bind(null, client.id)}
            fields={[
              {
                name: "logos",
                label: "Add logos",
                type: "file",
                accept: "image/*",
                multiple: true,
                help: "You can select several images at once. Each image becomes one client.",
              },
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
