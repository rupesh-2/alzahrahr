import type { Metadata } from "next";
import Link from "next/link";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { getAdvertisement, parseId } from "@/lib/data";
import { mediaUrl } from "@/lib/format";

const VACANCIES = { label: "Vacancies", href: "/vacancies" };

async function load(params: PageProps<"/vacancy/[vacancyId]">["params"]) {
  const id = parseId((await params).vacancyId);
  return id === null ? undefined : getAdvertisement(id);
}

export async function generateMetadata({ params }: PageProps<"/vacancy/[vacancyId]">): Promise<Metadata> {
  const job = await load(params);
  return { title: job ? job.job_title || "Job opening" : "Vacancy not found" };
}

export default async function VacancyPage({ params }: PageProps<"/vacancy/[vacancyId]">) {
  const job = await load(params);

  if (!job) {
    return (
      <PageHeader title="Vacancy not found" parent={VACANCIES}>
        This position may have been filled or removed.
      </PageHeader>
    );
  }

  const openings = job.male_required + job.female_required;
  const details = Object.entries({
    Location: job.location,
    "Company name": job.company_name,
    "Required total employees":
      openings > 0 ? `${openings} (Male ${job.male_required}, Female ${job.female_required})` : null,
    Salary: job.salary || null,
    "Min. qualification": job.minimum_qualification,
  }).filter(([, value]) => value);
  const points = job.job_description
    .split(/\r\n|\r|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const image = mediaUrl(job.image);

  return (
    <div>
      <PageHeader title={job.job_title || "Job opening"} parent={VACANCIES} />

      <section className="container grid gap-10 py-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {image && <img src={image} alt={job.job_title} className="w-full rounded-md border border-line" />}

          {points.length > 0 && (
            <>
              <h2 className={`${image ? "mt-12" : ""} text-2xl font-medium`}>Job description:</h2>
              <ul className="mt-5 space-y-3">
                {points.map((point, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-ink/85">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="lg:col-span-2">
          <div className="card sticky top-32 p-6">
            <h2 className="font-sans text-sm font-semibold tracking-wider text-muted uppercase">At a glance</h2>
            {details.length > 0 && (
              <dl className="mt-4 divide-y divide-line">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link href="/apply-now" className="btn-primary mt-6 w-full">
              Apply now
              <Glyph name="arrow-right" className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-muted">Mention the job title in your application.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
