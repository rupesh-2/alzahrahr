import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { Glyph } from "@/components/glyph";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Al Zahra HR" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/image/AdminPanelLogo-removebg-preview.png" alt="Al Zahra HR" className="h-8 w-auto" />
            <span className="hidden font-display text-sm text-muted sm:inline">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hidden text-muted hover:text-brand-700 sm:inline" target="_blank">
              View site
            </Link>
            <span className="hidden text-ink md:inline">{user.name}</span>
            <form action={logout}>
              <button type="submit" className="btn-ghost px-3 py-2 text-sm">
                <Glyph name="logout" className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="lg:grid lg:grid-cols-[14rem_1fr]">
        <aside className="border-b border-line bg-white p-3 lg:min-h-[calc(100vh-4rem)] lg:border-r lg:border-b-0 lg:p-4">
          <AdminNav />
        </aside>
        <main className="min-w-0 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
