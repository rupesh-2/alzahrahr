import Link from "next/link";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { get } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireAdmin();
  const tables = ["advertisements", "clients", "companies", "events", "photos"] as const;
  const counts = await Promise.all(tables.map((t) => get<{ n: number }>(`SELECT COUNT(*) AS n FROM ${t}`)));
  const count = Object.fromEntries(tables.map((t, i) => [t, Number(counts[i]?.n ?? 0)]));
  const n = (table: (typeof tables)[number]) => count[table];
  const profile = await get<{ id: number; profile_pdf: string | null }>("SELECT id, profile_pdf FROM company_profiles LIMIT 1");

  const tiles = [
    { label: "Vacancies", value: n("advertisements"), href: "/admin/advertisements", note: "Removed automatically 8 days after posting" },
    { label: "Client countries", value: n("clients"), href: "/admin/clients", note: `${n("companies")} client logos` },
    { label: "Events", value: n("events"), href: "/admin/events", note: `${n("photos")} photos` },
  ];

  return (
    <AdminPage title="Dashboard">
      <Panel>
        <p className="text-muted">
          Welcome back, <span className="font-medium text-ink">{user.name}</span>.
        </p>
      </Panel>

      {(!profile || !profile.profile_pdf) && (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The company profile is incomplete, so the contact and apply forms cannot send email and the PDF download is
          unavailable.{" "}
          <Link href="/admin/company-profile" className="font-medium underline">
            Complete it now
          </Link>
          .
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card p-5 transition hover:border-brand-700/40">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{t.value}</p>
            <p className="mt-2 text-xs text-muted">{t.note}</p>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
