import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { VacancyCard } from "@/components/vacancy-card";
import { getAdvertisements } from "@/lib/data";
import { plural } from "@/lib/format";

export const metadata: Metadata = { title: "Vacancies" };

export default async function VacanciesPage() {
  const jobs = await getAdvertisements();

  return (
    <div>
      <PageHeader title="Vacancies" eyebrow="Latest jobs">
        Current openings with our partner employers abroad. Don’t see a fit? Send us your CV anyway.
      </PageHeader>

      <section className="container py-20">
        {jobs.length > 0 ? (
          <>
            <p className="text-sm text-muted">{plural(jobs.length, "open position")}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <VacancyCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <div className="card p-10 text-center">
            <p className="font-display text-xl">No open vacancies right now</p>
            <p className="mt-2 text-sm text-muted">
              New roles are posted every week. Send us your CV and we’ll be in touch.
            </p>
            <Link href="/apply-now" className="btn-primary mt-6">
              Submit your CV
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
