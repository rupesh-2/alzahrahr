"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Glyph } from "./glyph";
import { telHref } from "@/lib/format";

const LINKS = [
  { label: "Home", url: "/" },
  { label: "Vacancies", url: "/vacancies" },
  { label: "Clients", url: "/clients" },
  { label: "Events", url: "/events" },
  { label: "Contacts", url: "/contacts" },
];

const ABOUT = [
  { label: "About us", url: "/about-us", desc: "Our licence, experience and reach" },
  { label: "Message from our expertise", url: "/expertise-saying", desc: "A welcome from our executive team" },
  { label: "Why Nepali workforce", url: "/nepali-workers", desc: "Why employers choose Nepali workers" },
  { label: "Our certificates", url: "/our-certificates", desc: "Registration and licences" },
];

export function SiteHeader({ location, contact }: { location?: string; contact?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));
  const aboutActive = ABOUT.some((a) => isActive(a.url));

  // Close menus after navigating and on Escape.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setDrop(false);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDrop(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tel = telHref(contact);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden bg-brand-800 text-[13px] text-white/85 md:block">
        <div className="container flex h-10 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {location && (
              <span className="flex items-center gap-2">
                <Glyph name="pin" className="h-4 w-4 text-leaf" />
                {location}
              </span>
            )}
            {contact && (
              <a href={tel} className="flex items-center gap-2 hover:text-white">
                <Glyph name="phone" className="h-4 w-4 text-leaf" />
                {contact}
              </a>
            )}
            <span className="hidden items-center gap-2 lg:flex">
              <Glyph name="clock" className="h-4 w-4 text-leaf" />
              Sunday – Friday, 10 am – 6 pm
            </span>
          </div>
          <a href="/download-pdf" className="flex items-center gap-2 font-display font-medium text-white hover:text-leaf">
            <Glyph name="download" className="h-4 w-4" />
            Company profile
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-line bg-white">
        <div className="container flex h-[72px] items-center justify-between gap-8 lg:h-[84px]">
          <Link href="/" className="shrink-0">
            <img
              src="/image/AdminPanelLogo-removebg-preview.png"
              alt="Al Zahra Human Resource Consultancy"
              className="h-9 w-auto lg:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((link, i) => (
              <span key={link.url} className="contents">
                <Link
                  href={link.url}
                  className={`relative px-3 py-2 font-display text-[15px] transition ${
                    isActive(link.url)
                      ? "text-brand-700 after:absolute after:inset-x-3 after:-bottom-[23px] after:h-0.5 after:bg-brand-700"
                      : "text-ink hover:text-brand-700"
                  }`}
                >
                  {link.label}
                </Link>

                {i === 0 && (
                  <div className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                    <button
                      type="button"
                      onClick={() => setDrop((d) => !d)}
                      aria-expanded={drop}
                      className={`flex items-center gap-1 px-3 py-2 font-display text-[15px] transition hover:text-brand-700 ${
                        aboutActive ? "text-brand-700" : "text-ink"
                      }`}
                    >
                      Who we are
                      <Glyph name="chevron-down" className={`h-4 w-4 transition ${drop ? "rotate-180" : ""}`} />
                    </button>
                    {drop && (
                      <div className="absolute top-full left-0 w-80 pt-[22px]">
                        <div className="rounded-lg border border-line bg-white p-2 shadow-float">
                          {ABOUT.map((item) => (
                            <Link
                              key={item.url}
                              href={item.url}
                              className="block rounded-md px-4 py-3 transition hover:bg-mist"
                            >
                              <span className="block font-display text-[15px] font-medium text-ink">{item.label}</span>
                              <span className="block text-[13px] text-muted">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/apply-now" className="btn-primary hidden sm:inline-flex">
              Apply now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="grid h-11 w-11 place-items-center rounded-md border border-line lg:hidden"
            >
              <Glyph name={open ? "x" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-line lg:hidden">
            <nav className="container grid gap-1 py-4" aria-label="Mobile">
              {LINKS.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className={`rounded-md px-3 py-2.5 font-display text-[15px] ${
                    isActive(link.url) ? "bg-mist text-brand-700" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-3 px-3 text-xs font-medium tracking-[0.14em] text-secondary uppercase">Who we are</p>
              {ABOUT.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className={`rounded-md px-3 py-2.5 font-display text-[15px] ${
                    isActive(link.url) ? "bg-mist text-brand-700" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 grid gap-2 border-t border-line px-3 pt-4 text-sm text-muted">
                {location && (
                  <span className="flex items-center gap-2">
                    <Glyph name="pin" className="h-4 w-4" />
                    {location}
                  </span>
                )}
                {contact && (
                  <a href={tel} className="flex items-center gap-2">
                    <Glyph name="phone" className="h-4 w-4" />
                    {contact}
                  </a>
                )}
                <a href="/download-pdf" className="flex items-center gap-2">
                  <Glyph name="download" className="h-4 w-4" />
                  Company profile
                </a>
              </div>
              <Link href="/apply-now" className="btn-primary mt-4">
                Apply now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
