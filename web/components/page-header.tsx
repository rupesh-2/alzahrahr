import Link from "next/link";
import type { ReactNode } from "react";
import { Glyph } from "./glyph";

type Props = {
  title: string;
  eyebrow?: string;
  parent?: { label: string; href: string };
  children?: ReactNode;
};

export function PageHeader({ title, eyebrow, parent, children }: Props) {
  return (
    <section className="bg-grey">
      <div className="container py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          {parent && (
            <>
              <Glyph name="chevron-right" className="h-3.5 w-3.5" />
              <Link href={parent.href} className="hover:text-brand-700">
                {parent.label}
              </Link>
            </>
          )}
          <Glyph name="chevron-right" className="h-3.5 w-3.5" />
          <span className="text-ink" aria-current="page">
            {title}
          </span>
        </nav>
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-3" : "mt-8"} max-w-3xl text-[2.2rem] leading-[1.15] sm:text-[2.9rem]`}>
          {title}
        </h1>
        {children && <p className="lead mt-4 max-w-2xl">{children}</p>}
      </div>
    </section>
  );
}
