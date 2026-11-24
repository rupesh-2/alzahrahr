import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCompanyProfile } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCompanyProfile();
  return (
    <>
      <SiteHeader location={profile?.location} contact={profile?.primary_contact} />
      <main className="flex-1">{children}</main>
      <SiteFooter profile={profile} />
    </>
  );
}
