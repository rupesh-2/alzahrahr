import type { Metadata } from "next";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { EXECUTIVES } from "@/lib/content";

export const metadata: Metadata = { title: "Message from our expertise" };

export default function ExpertiseSayingPage() {
  return (
    <div>
      <PageHeader title="Message from our expertise" eyebrow="Meet our executive team" />

      <section className="container grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <article className="lg:col-span-7">
          <Glyph name="quote" className="h-9 w-9 text-brand-700/40" />
          <div className="prose-body mt-6 text-[17px] leading-[1.8] text-ink/85">
            <p className="font-display text-xl font-medium text-ink">Dear Valued Guests,</p>
            <p>
              As the administrators of Alzahra Human Resources, we are honored to reach out to you and share a few words
              about our shared journey toward new horizons.
            </p>
            <p>
              At Alzahra, we recognize the dreams and aspirations that fuel your desire to explore employment
              opportunities in the Middle East and Europe. Your courage and determination to seek new experiences and
              contribute your skills to the global workforce are truly commendable.
            </p>
            <p>
              Our commitment goes beyond just facilitating job placements; we are dedicated to ensuring a supportive and
              transparent process that prioritizes your well-being and success. Alzahra is driven by ethical recruitment
              practices, focusing on creating opportunities that empower individuals like yourself to build a brighter
              future.
            </p>
            <p>
              As you embark on this journey, rest assured that you are not alone. Our team is here to guide you every
              step of the way, providing assistance, resources, and a commitment to your personal and professional
              growth. Your success is our success, and we take pride in being a part of your transformative journey.
            </p>
            <p>
              Thank you for choosing Alzahra Human Resources as your partner in this endeavor. Together, let’s make your
              dreams a reality and pave the way for a promising future.
            </p>
            <p>Wishing you all the best,</p>
          </div>
        </article>

        <aside className="lg:col-span-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-40 lg:grid-cols-1">
            {EXECUTIVES.map((exec) => (
              <figure
                key={exec.name}
                className="grid grid-cols-[7rem_1fr] items-center gap-5 rounded-lg border border-line p-4"
              >
                <img
                  src={exec.img}
                  alt={exec.name}
                  className="aspect-square w-full rounded-md object-cover object-top"
                />
                <figcaption>
                  <p className="font-display text-xs font-medium tracking-[0.14em] text-brand-700 uppercase">
                    {exec.role}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">{exec.name}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
