import Link from "next/link";
import { Glyph } from "./glyph";
import { mediaUrl } from "@/lib/format";
import type { Advertisement } from "@/lib/data";

export function VacancyCard({ job }: { job: Advertisement }) {
  const openings = job.male_required + job.female_required;
  const image = mediaUrl(job.image);

  return (
    <Link
      href={`/vacancy/${job.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:border-brand-700/40 hover:shadow-float"
    >
      <div className="aspect-[4/3] overflow-hidden border-b border-line bg-grey">
        {image ? (
          <img
            src={image}
            alt={job.job_title || "Job advertisement"}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-brand-700/60">
            <Glyph name="briefcase" className="h-9 w-9" />
            <span className="font-display text-xs tracking-[0.14em] uppercase">{job.location || "Overseas"}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] leading-snug">{job.job_title || "Job opening"}</h3>
        <dl className="mt-3 grid gap-1.5 text-sm text-muted">
          {job.location && (
            <div className="flex items-center gap-2">
              <Glyph name="pin" className="h-4 w-4" />
              <dt className="sr-only">Location</dt>
              <dd>{job.location}</dd>
            </div>
          )}
          {openings > 0 && (
            <div className="flex items-center gap-2">
              <Glyph name="users" className="h-4 w-4" />
              <dt className="sr-only">Vacancies</dt>
              <dd>Vacancies: {openings}</dd>
            </div>
          )}
        </dl>
        <span className="mt-auto flex items-center gap-1.5 pt-5 font-display text-sm font-medium text-brand-700">
          Read more
          <Glyph name="arrow-right" className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
