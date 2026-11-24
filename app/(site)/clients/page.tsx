import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getClientsWithCompanies } from "@/lib/data";
import { mediaUrl, plural } from "@/lib/format";

export const metadata: Metadata = { title: "Our clients" };

export default async function ClientsPage() {
  const clients = await getClientsWithCompanies();

  return (
    <div>
      <PageHeader title="Our clients" eyebrow="Our prestigious clients">
        Employers we proudly supply, grouped by country.
      </PageHeader>

      <section className="container space-y-14 py-20">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id}>
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <h2 className="text-2xl font-medium">{client.country_name}</h2>
                <span className="text-sm text-muted">{plural(client.companies.length, "client")}</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {client.companies.map((company) => (
                  <div
                    key={company.id}
                    className="card grid aspect-[3/2] place-items-center p-5 transition hover:border-brand-200"
                  >
                    <img
                      src={mediaUrl(company.logo)!}
                      alt="Client logo"
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="card p-10 text-center text-muted">Client list coming soon.</p>
        )}
      </section>
    </div>
  );
}
