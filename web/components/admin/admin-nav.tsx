"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/advertisements", label: "Vacancies" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/company-profile", label: "Company profile" },
  { href: "/admin/account", label: "My account" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-md px-3 py-2 font-display text-[15px] whitespace-nowrap transition ${
              active ? "bg-brand-50 font-medium text-brand-800" : "text-ink hover:bg-mist"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
