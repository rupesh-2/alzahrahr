import type { Metadata } from "next";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { getCompanyProfile } from "@/lib/data";
import { telHref } from "@/lib/format";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const profile = await getCompanyProfile();

  return (
    <div>
      <PageHeader title="Get in touch with us" eyebrow="Al Zahra Human Resource Consultancy Pvt. Ltd welcomes you">
        At Al Zahra Human Resource Consultancy, we pride ourselves on delivering unparalleled expertise to our clients.
        We invite you to experience our services firsthand. Please do not hesitate to contact us to discuss how we can
        assist you in achieving your goals.
      </PageHeader>

      <section className="container grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <dl className="divide-y divide-line border-y border-line">
            {profile?.location && (
              <div className="flex gap-4 py-6">
                <Glyph name="pin" className="mt-1 h-5 w-5 text-brand-700" />
                <div>
                  <dt className="font-display font-medium">Our address</dt>
                  <dd className="mt-1 text-muted">{profile.location}</dd>
                </div>
              </div>
            )}
            <div className="flex gap-4 py-6">
              <Glyph name="phone" className="mt-1 h-5 w-5 text-brand-700" />
              <div>
                <dt className="font-display font-medium">Contact</dt>
                {profile?.primary_contact && (
                  <dd className="mt-1 text-muted">
                    Contact no:{" "}
                    <a href={telHref(profile.primary_contact)} className="text-ink hover:text-brand-700">
                      {profile.primary_contact}
                    </a>
                  </dd>
                )}
                {profile?.company_email && (
                  <dd className="mt-1 text-muted">
                    Mail:{" "}
                    <a href={`mailto:${profile.company_email}`} className="text-ink hover:text-brand-700">
                      {profile.company_email}
                    </a>
                  </dd>
                )}
              </div>
            </div>
            <div className="flex gap-4 py-6">
              <Glyph name="clock" className="mt-1 h-5 w-5 text-brand-700" />
              <div>
                <dt className="font-display font-medium">Working hours</dt>
                <dd className="mt-1 text-muted">Sunday – Friday (10 am – 6 pm)</dd>
              </div>
            </div>
          </dl>
          <img
            src="/image/AdminPanelLogo-removebg-preview.png"
            alt="Al Zahra Human Resource Consultancy"
            className="mt-10 h-12 w-auto opacity-90"
          />
        </div>

        <ContactForm />
      </section>
    </div>
  );
}
