"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glyph } from "./glyph";
import { telHref } from "@/lib/format";

/** "Ready to get started?" band above the footer, hidden on the two form pages. */
export function EnquiryBand({ primaryContact }: { primaryContact?: string }) {
  const pathname = usePathname();
  if (pathname === "/apply-now" || pathname === "/contacts") return null;

  return (
    <section className="bg-grey">
      <div className="container grid items-center gap-8 py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Get in touch with us</p>
          <h2 className="section-title">Ready to get started?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <div className="rounded-lg bg-white p-6">
            <p className="font-display text-[15px] font-medium">Employers</p>
            <p className="mt-1 text-sm text-muted">Send us your requirement and our team will respond.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/contacts" className="btn-primary">
                Send an enquiry
              </Link>
              {primaryContact && (
                <a
                  href={telHref(primaryContact)}
                  className="flex items-center gap-2 font-display text-sm font-medium text-ink hover:text-brand-700"
                >
                  <Glyph name="phone" className="h-4 w-4" />
                  {primaryContact}
                </a>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6">
            <p className="font-display text-[15px] font-medium">Job seekers</p>
            <p className="mt-1 text-sm text-muted">Apply online with your CV, passport and photo.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/apply-now" className="btn-primary">
                Apply now
              </Link>
              <Link href="/vacancies" className="btn-ghost">
                Vacancies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
