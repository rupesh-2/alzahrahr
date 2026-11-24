import Link from "next/link";
import type { ReactNode } from "react";
import { Glyph } from "@/components/glyph";

/** Title row for an admin page, with optional back link and actions. */
export function AdminPage({
  title,
  back,
  actions,
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-brand-700">
          <Glyph name="chevron-right" className="h-3.5 w-3.5 rotate-180" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl">{title}</h1>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      {title && <h2 className="mb-5 text-lg">{title}</h2>}
      {children}
    </section>
  );
}

export function NewButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-primary">
      <Glyph name="plus" className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return <p className="card p-8 text-center text-muted">{children}</p>;
}
