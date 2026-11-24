import Link from "next/link";
import { Glyph } from "./glyph";
import { EnquiryBand } from "./enquiry-band";
import type { CompanyProfile } from "@/lib/data";

const FOOTER_LINKS = [
  ["About us", "/about-us"],
  ["Vacancies", "/vacancies"],
  ["Our clients", "/clients"],
  ["Events", "/events"],
  ["Certificates", "/our-certificates"],
  ["Contacts", "/contacts"],
] as const;

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3532.5114777824447!2d85.34012922618014!3d27.70148997618596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x39eb199c57ba27b5%3A0xde93b6685bb60872!2sOld%20Baneshwor%2C%20Kathmandu!3m2!1d27.7024708!2d85.34140269999999!4m5!1s0x39eb190025b96a67%3A0xbf2daabad513b674!2sAl%20Zahra%20Human%20Resources%20Consultancy%20Pvt.%20Ltd.%2C%20P82V%2B5FH%2C%20Kathmandu%2044600!3m2!1d27.700432!2d85.3437495!5e0!3m2!1sen!2snp!4v1703860852990!5m2!1sen!2snp";

export function SiteFooter({ profile }: { profile?: CompanyProfile }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <EnquiryBand primaryContact={profile?.primary_contact} />

      <div className="panel">
        <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-3">
            <img
              src="/image/AdminPanelLogo-removebg-preview.png"
              alt="Al Zahra Human Resource Consultancy"
              className="h-10 w-auto rounded bg-white px-3 py-2"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Alzahra Human Resource Consultancy Pvt. Ltd. Recruitment licence no. 1657/080/081, Government of Nepal.
            </p>
            <nav className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80" aria-label="Footer">
              {FOOTER_LINKS.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-[15px] font-medium text-white">Nepal Office</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {profile?.location && (
                <li className="flex gap-3">
                  <Glyph name="pin" className="mt-0.5 h-4 w-4 text-leaf" />
                  {profile.location}
                </li>
              )}
              {profile?.primary_contact && (
                <li className="flex gap-3">
                  <Glyph name="phone" className="mt-0.5 h-4 w-4 text-leaf" />
                  <span>
                    {profile.primary_contact}
                    {profile.secondary_contact && (
                      <>
                        <br />
                        {profile.secondary_contact}
                      </>
                    )}
                  </span>
                </li>
              )}
              {profile?.company_email && (
                <li className="flex gap-3">
                  <Glyph name="mail" className="mt-0.5 h-4 w-4 text-leaf" />
                  <a href={`mailto:${profile.company_email}`} className="hover:text-white">
                    {profile.company_email}
                  </a>
                </li>
              )}
              <li className="flex gap-3">
                <Glyph name="clock" className="mt-0.5 h-4 w-4 text-leaf" />
                Sunday – Friday (10 am – 6 pm)
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-[15px] font-medium text-white">Dubai Office</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <Glyph name="pin" className="mt-0.5 h-4 w-4 text-leaf" />
                Tower, Business Bay, Dubai, United Arab Emirates
              </li>
              <li className="flex gap-3">
                <Glyph name="phone" className="mt-0.5 h-4 w-4 text-leaf" />
                +971 559 997 6543
              </li>
              <li className="flex gap-3">
                <Glyph name="mail" className="mt-0.5 h-4 w-4 text-leaf" />
                <a href="mailto:info@alzahrahr.com" className="hover:text-white">
                  info@alzahrahr.com
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="font-display text-[15px] font-medium text-white">Map</h3>
            <iframe
              title="Al Zahra office map"
              src={MAP_SRC}
              className="mt-4 h-40 w-full rounded-md border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="container py-6 text-xs text-white/55">
            &copy; {year} Alzahra Human Resource Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
