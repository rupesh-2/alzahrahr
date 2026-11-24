import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ApplyForm } from "./apply-form";

export const metadata: Metadata = { title: "Apply now" };

const NEEDS = [
  "Your personal and contact details",
  "The company name and job title you want to apply for",
  "Your C.V, a scanned passport and your latest photo — up to 1 MB each",
];

export default function ApplyNowPage() {
  return (
    <div>
      <PageHeader title="Apply form" eyebrow="Apply now">
        Fill in your details and upload your documents. We will respond soon after reviewing your application.
      </PageHeader>

      <section className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14">
        <aside className="lg:col-span-4">
          <div className="rounded-lg bg-grey p-6 sm:p-8 lg:sticky lg:top-40">
            <h2 className="text-lg">What you will need</h2>
            <ul className="mt-5 space-y-4 text-[15px]">
              {NEEDS.map((item, i) => (
                <li key={item} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
              Looking for a specific job?{" "}
              <Link href="/vacancies" className="link">
                See current vacancies
              </Link>
            </p>
          </div>
        </aside>

        <ApplyForm />
      </section>
    </div>
  );
}
