import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · Admin", robots: { index: false } };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-12">
      <div className="w-full max-w-sm">
        <img src="/image/AdminPanelLogo-removebg-preview.png" alt="Al Zahra HR" className="mx-auto h-12 w-auto" />
        <div className="card mt-8 p-6 sm:p-8">
          <h1 className="text-xl">Sign in to your account</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
