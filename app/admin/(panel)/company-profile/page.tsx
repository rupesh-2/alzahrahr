import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { get } from "@/lib/db";
import type { CompanyProfile } from "@/lib/data";
import { requireAdmin } from "@/lib/session";
import { saveCompanyProfile } from "../../actions";

export const metadata: Metadata = { title: "Company profile" };

export default async function CompanyProfilePage() {
  await requireAdmin();
  const profile = await get<CompanyProfile>("SELECT * FROM company_profiles ORDER BY id LIMIT 1");

  return (
    <AdminPage title="Company profile">
      <p className="text-sm text-muted">
        Shown in the site header, footer and contact page. Contact and apply form submissions are emailed to the company
        email.
      </p>
      <Panel>
        <AdminForm
          action={saveCompanyProfile}
          fields={[
            { name: "company_name", label: "Company name", required: true },
            { name: "company_email", label: "Company email", type: "email", required: true },
            { name: "primary_contact", label: "Primary contact", required: true },
            { name: "secondary_contact", label: "Secondary contact" },
            { name: "location", label: "Location", required: true, wide: true },
            {
              name: "profile_pdf",
              label: profile?.profile_pdf ? "Replace company profile PDF" : "Company profile PDF",
              type: "file",
              accept: "application/pdf",
              required: !profile?.profile_pdf,
              current: profile?.profile_pdf ? { url: "/download-pdf", kind: "pdf" } : undefined,
              help: "Visitors download this from the “Company profile” link.",
            },
          ]}
          defaults={profile}
          submitLabel={profile ? "Save changes" : "Create"}
        />
      </Panel>
    </AdminPage>
  );
}
