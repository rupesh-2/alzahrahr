import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PURPOSE } from "@/lib/content";

export const metadata: Metadata = { title: "About us" };

const FACTS = [
  ["Licence", "Recruitment licence no. 1657/080/081, Government of Nepal"],
  ["Head office", "Kathmandu, Nepal"],
  ["Recruiting for", "Saudi Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman, Malaysia and Europe"],
  ["Experience", "Recruiting workers for over 10 years"],
] as const;

export default function AboutUsPage() {
  return (
    <div>
      <PageHeader title="About us" eyebrow="Who we are" />

      <section className="container grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <img
            src="/image/about.jpg"
            alt="Workers fixing steel beams on a construction site"
            className="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </div>

        <div className="lg:col-span-7 lg:pt-4">
          <h2 className="text-[1.75rem] leading-snug sm:text-[2rem]">Quality services, at the right time</h2>
          <div className="prose-body mt-6 text-[17px] leading-relaxed text-ink/85">
            <p>
              We are Alzahra Human Resources Consultancy Ltd, holding Recruitment License No. 1657/080/081 from the
              Government of Nepal, located in Kathmandu, Nepal.
            </p>
            <p>
              Owing to our specialized, strict, diligent and responsible working attitude, highly effective teamwork
              spirit, experience and network throughout the Gulf countries, we are confident in providing quality
              services. We have been recruiting workers for Saudi Arabia, Dubai, Qatar, Bahrain, Kuwait, Oman, Malaysia
              and Europe for the last 10 years.
            </p>
            <p>
              We can supply workers as per your requirements, and we assure you that we can provide good services at
              the right time.
            </p>
          </div>

          <dl className="mt-10 grid border-t border-line sm:grid-cols-2">
            {FACTS.map(([term, detail], i) => (
              <div key={term} className={`border-b border-line py-5 ${i % 2 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}>
                <dt className="font-display text-xs font-medium tracking-[0.14em] text-brand-700 uppercase">{term}</dt>
                <dd className="mt-2 text-[15px]">{detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contacts" className="btn-primary">
              Contact us
            </Link>
            <Link href="/our-certificates" className="btn-ghost">
              Our certificates
            </Link>
          </div>
        </div>
      </section>

      <section className="panel py-16 sm:py-20">
        <div className="container">
          <p className="eyebrow">Why we are here</p>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {PURPOSE.map(([heading, text]) => (
              <div key={heading} className="border-t-2 border-accent-tertiary/70 pt-6">
                <h2 className="text-lg">{heading}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
