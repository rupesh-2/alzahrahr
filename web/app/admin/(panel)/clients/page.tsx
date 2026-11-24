import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, EmptyRow, NewButton } from "@/components/admin/admin-page";
import { getClientsWithCompanies } from "@/lib/data";
import { plural } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsAdminPage() {
  await requireAdmin();
  const clients = await getClientsWithCompanies();

  return (
    <AdminPage title="Clients" actions={<NewButton href="/admin/clients/new" label="New country" />}>
      <p className="text-sm text-muted">Clients are grouped by country. Open a country to add or remove company logos.</p>
      {clients.length === 0 ? (
        <EmptyRow>No client countries yet.</EmptyRow>
      ) : (
        <ul className="card divide-y divide-line">
          {clients.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/clients/${c.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-mist/60">
                <span className="font-medium">{c.country_name}</span>
                <span className="text-sm text-muted">{plural(c.companies.length, "logo")}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
