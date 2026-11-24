import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, EmptyRow, NewButton } from "@/components/admin/admin-page";
import { getAdvertisements } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Vacancies" };

export default async function AdvertisementsPage() {
  await requireAdmin();
  const ads = await getAdvertisements();

  return (
    <AdminPage title="Vacancies" actions={<NewButton href="/admin/advertisements/new" label="New vacancy" />}>
      <p className="text-sm text-muted">Vacancies are removed automatically 8 days after they are posted.</p>
      {ads.length === 0 ? (
        <EmptyRow>No vacancies yet.</EmptyRow>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Job title</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Male</th>
                <th className="px-4 py-3 font-medium">Female</th>
                <th className="px-4 py-3 font-medium">Qualification</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-mist/60">
                  <td className="px-4 py-2">
                    {ad.image ? <img src={mediaUrl(ad.image)!} alt="" className="h-10 w-10 rounded object-cover" /> : "—"}
                  </td>
                  <td className="px-4 py-2 font-medium">{ad.job_title || "—"}</td>
                  <td className="px-4 py-2">{ad.location}</td>
                  <td className="px-4 py-2">{ad.company_name}</td>
                  <td className="px-4 py-2">{ad.male_required}</td>
                  <td className="px-4 py-2">{ad.female_required}</td>
                  <td className="px-4 py-2">{ad.minimum_qualification}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-muted">{ad.created_at.slice(0, 10)}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/admin/advertisements/${ad.id}`} className="link text-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}
