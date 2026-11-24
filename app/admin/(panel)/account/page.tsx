import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPage, Panel } from "@/components/admin/admin-page";
import { requireAdmin } from "@/lib/session";
import { updateAccount } from "../../actions";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireAdmin();

  return (
    <AdminPage title="My account">
      <Panel>
        <AdminForm
          action={updateAccount}
          fields={[
            { name: "name", label: "Name", required: true, autoComplete: "name" },
            { name: "email", label: "Email address", type: "email", required: true, autoComplete: "username" },
            { name: "password", label: "New password", type: "password", autoComplete: "new-password", help: "Leave blank to keep your current password." },
            { name: "password_confirmation", label: "Confirm new password", type: "password", autoComplete: "new-password" },
            { name: "current_password", label: "Current password", type: "password", required: true, autoComplete: "current-password", help: "Required to save any change." },
          ]}
          defaults={user}
          submitLabel="Save changes"
        />
      </Panel>
    </AdminPage>
  );
}
