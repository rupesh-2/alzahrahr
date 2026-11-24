import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Why Nepali workforce" };

const REASONS = [
  [
    "Reliable and skilled",
    "Nepali workers are highly valued for their reliability, discipline, and skills, making them sought after in various industries. Factors like a strong work ethic, adaptability, and a reputation for dedication contribute to the demand for Nepali labor globally. Industries such as construction, hospitality, and security benefit from the qualities that Nepali workers bring to the workforce.",
  ],
  [
    "Trusted in security roles",
    "Nepali workers are also sought after for security-related roles. Many Nepali individuals are employed as security guards in the Middle East due to their reputation for discipline, reliability, and training received from the Gurkha regiment.",
  ],
  [
    "Quick to adapt",
    "Nepali workers often find it easier to adapt to the cultural and linguistic environment in the Middle East, making them preferable candidates for certain jobs.",
  ],
] as const;

export default function NepaliWorkersPage() {
  return (
    <div>
      <PageHeader title="Why Nepali work force?" eyebrow="Who we are" />

      <section className="container py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <img
            src="/image/Culture-in-Nepal.jpg"
            alt="Culture in Nepal"
            className="aspect-[16/10] w-full rounded-lg object-cover lg:col-span-7"
          />
          <div className="lg:col-span-5">
            <p className="eyebrow">Demand for Nepali workforce</p>
            <h2 className="section-title">Disciplined, dependable and in demand worldwide</h2>
            <Link href="/contacts" className="btn-primary mt-8">
              Hire Nepali workers
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {REASONS.map(([title, text], i) => (
            <div key={title} className="border-t-2 border-brand-700 pt-6">
              <span className="font-display text-sm text-secondary">0{i + 1}</span>
              <h3 className="mt-2 text-lg">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
