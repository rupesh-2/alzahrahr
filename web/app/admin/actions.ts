"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { all, get, run, transaction } from "@/lib/db";
import type { FormState } from "@/lib/form-state";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession, requireAdmin } from "@/lib/session";
import { deleteUpload, isFile, isImage, saveUpload, type Collection } from "@/lib/storage";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Errors = Record<string, string>;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function values(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, text(formData, k)]));
}

function zodErrors(error: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of error.issues) out[String(issue.path[0])] ??= issue.message;
  return out;
}

const count = z.coerce.number().int("Enter a whole number.").min(0, "Must be 0 or more.");

/**
 * Validates an optional or required file input. Returns the file, null when none
 * was chosen, or an error message.
 */
function pickFile(formData: FormData, key: string, kind: "image" | "pdf", required: boolean): File | null | string {
  const file = formData.get(key);
  if (!isFile(file)) return required ? "Please choose a file." : null;
  if (kind === "image" && !isImage(file)) return "Please choose a JPG, PNG, WebP, GIF or AVIF image.";
  if (kind === "pdf" && file.type !== "application/pdf") return "Please choose a PDF file.";
  return file;
}

function pickImages(formData: FormData, key: string): File[] | string {
  const files = formData.getAll(key).filter(isFile);
  if (files.length === 0) return "Please choose at least one image.";
  if (files.some((f) => !isImage(f))) return "Only JPG, PNG, WebP, GIF or AVIF images can be uploaded.";
  return files;
}

/** Public pages read straight from the database; refresh the client router cache after edits. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = get<{ id: number; password_hash: string; role: string }>(
    "SELECT id, password_hash, role FROM users WHERE email = ?",
    email,
  );
  if (!user || user.role !== "admin" || !verifyPassword(password, user.password_hash)) {
    return { status: "error", message: "These credentials do not match our records.", values: { email } };
  }
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function updateAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireAdmin();
  const vals = values(formData, ["name", "email"]);
  const parsed = z
    .object({
      name: z.string().min(1, "The name field is required."),
      email: z.email("Enter a valid email address."),
    })
    .safeParse(vals);
  const errors: Errors = parsed.success ? {} : zodErrors(parsed.error);

  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirmation") ?? "");
  if (next) {
    if (next.length < 8) errors.password = "The new password must be at least 8 characters.";
    else if (next !== confirm) errors.password_confirmation = "The passwords do not match.";
  }
  const stored = get<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = ?", user.id)!;
  if (!verifyPassword(current, stored.password_hash)) errors.current_password = "Your current password is incorrect.";

  const email = vals.email.toLowerCase();
  if (!errors.email && get("SELECT id FROM users WHERE email = ? AND id != ?", email, user.id)) {
    errors.email = "This email is already used by another account.";
  }
  if (Object.keys(errors).length) return { status: "error", errors, values: vals };

  run("UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", vals.name, email, user.id);
  if (next) run("UPDATE users SET password_hash = ? WHERE id = ?", hashPassword(next), user.id);
  revalidatePath("/admin", "layout");
  return { status: "success", message: "Your account has been saved." };
}

/* ------------------------------------------------------------------ */
/* Advertisements (vacancies)                                          */
/* ------------------------------------------------------------------ */

const AD_FIELDS = [
  "job_title",
  "location",
  "company_name",
  "male_required",
  "female_required",
  "salary",
  "minimum_qualification",
  "job_description",
];

const adSchema = z.object({
  job_title: z.string(),
  location: z.string(),
  company_name: z.string(),
  male_required: count,
  female_required: count,
  salary: count,
  minimum_qualification: z.string(),
  job_description: z.string(),
});

export async function saveAdvertisement(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const vals = values(formData, AD_FIELDS);
  const parsed = adSchema.safeParse(vals);
  const errors: Errors = parsed.success ? {} : zodErrors(parsed.error);

  const existing = id ? get<{ image: string | null }>("SELECT image FROM advertisements WHERE id = ?", id) : undefined;
  if (id && !existing) return { status: "error", message: "This vacancy no longer exists." };

  const image = pickFile(formData, "image", "image", !existing?.image);
  if (typeof image === "string") errors.image = image;
  if (!parsed.success || Object.keys(errors).length) return { status: "error", errors, values: vals };

  const d = parsed.data;
  const newImage = image instanceof File ? await saveUpload(image, "advertisements") : null;
  const cols = [d.job_title, d.location, d.company_name, d.male_required, d.female_required, d.minimum_qualification, d.job_description, d.salary];

  if (id) {
    run(
      `UPDATE advertisements SET job_title = ?, location = ?, company_name = ?, male_required = ?, female_required = ?,
       minimum_qualification = ?, job_description = ?, salary = ?, image = COALESCE(?, image), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      ...cols,
      newImage,
      id,
    );
    if (newImage) await deleteUpload(existing!.image);
  } else {
    run(
      `INSERT INTO advertisements (job_title, location, company_name, male_required, female_required,
       minimum_qualification, job_description, salary, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ...cols,
      newImage,
    );
  }
  refreshSite();
  redirect("/admin/advertisements");
}

export async function deleteAdvertisement(id: number) {
  await requireAdmin();
  const row = get<{ image: string | null }>("SELECT image FROM advertisements WHERE id = ?", id);
  run("DELETE FROM advertisements WHERE id = ?", id);
  await deleteUpload(row?.image);
  refreshSite();
  redirect("/admin/advertisements");
}

/* ------------------------------------------------------------------ */
/* Clients (countries) and their companies (logos)                     */
/* ------------------------------------------------------------------ */

export async function saveClient(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const country_name = text(formData, "country_name");
  if (!country_name) {
    return { status: "error", errors: { country_name: "The country name field is required." }, values: { country_name } };
  }
  if (id) {
    run("UPDATE clients SET country_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", country_name, id);
    refreshSite();
    return { status: "success", message: "Saved.", values: { country_name } };
  }
  const { id: newId } = run("INSERT INTO clients (country_name) VALUES (?)", country_name);
  refreshSite();
  // Like Filament, continue to the edit page so logos can be added straight away.
  redirect(`/admin/clients/${newId}`);
}

export async function deleteClient(id: number) {
  await requireAdmin();
  const logos = all<{ logo: string }>("SELECT logo FROM companies WHERE client_id = ?", id);
  run("DELETE FROM clients WHERE id = ?", id);
  await Promise.all(logos.map((l) => deleteUpload(l.logo)));
  refreshSite();
  redirect("/admin/clients");
}

export async function addCompanies(clientId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const files = pickImages(formData, "logos");
  if (typeof files === "string") return { status: "error", errors: { logos: files } };
  const paths = await Promise.all(files.map((f) => saveUpload(f, "companies")));
  transaction(() => paths.forEach((p) => run("INSERT INTO companies (client_id, logo) VALUES (?, ?)", clientId, p)));
  refreshSite();
  return { status: "success", message: `${paths.length} logo${paths.length === 1 ? "" : "s"} added.` };
}

export async function deleteCompany(id: number) {
  await requireAdmin();
  const row = get<{ logo: string; client_id: number }>("SELECT logo, client_id FROM companies WHERE id = ?", id);
  if (!row) return;
  run("DELETE FROM companies WHERE id = ?", id);
  await deleteUpload(row.logo);
  refreshSite();
  revalidatePath(`/admin/clients/${row.client_id}`);
}

/* ------------------------------------------------------------------ */
/* Events and their photos                                             */
/* ------------------------------------------------------------------ */

export async function saveEvent(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const vals = values(formData, ["name", "description"]);
  const errors: Errors = {};
  if (!vals.name) errors.name = "The name field is required.";

  const existing = id ? get<{ cover_image: string | null }>("SELECT cover_image FROM events WHERE id = ?", id) : undefined;
  if (id && !existing) return { status: "error", message: "This event no longer exists." };

  const cover = pickFile(formData, "cover_image", "image", !existing?.cover_image);
  if (typeof cover === "string") errors.cover_image = cover;
  if (Object.keys(errors).length) return { status: "error", errors, values: vals };

  const newCover = cover instanceof File ? await saveUpload(cover, "events") : null;
  if (id) {
    run(
      "UPDATE events SET name = ?, description = ?, cover_image = COALESCE(?, cover_image), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      vals.name,
      vals.description || null,
      newCover,
      id,
    );
    if (newCover) await deleteUpload(existing!.cover_image);
    refreshSite();
    return { status: "success", message: "Saved.", values: vals };
  }
  const { id: newId } = run(
    "INSERT INTO events (name, description, cover_image) VALUES (?, ?, ?)",
    vals.name,
    vals.description || null,
    newCover,
  );
  refreshSite();
  redirect(`/admin/events/${newId}`);
}

export async function deleteEvent(id: number) {
  await requireAdmin();
  const event = get<{ cover_image: string | null }>("SELECT cover_image FROM events WHERE id = ?", id);
  const photos = all<{ path: string }>("SELECT path FROM photos WHERE event_id = ?", id);
  run("DELETE FROM events WHERE id = ?", id);
  await Promise.all([deleteUpload(event?.cover_image), ...photos.map((p) => deleteUpload(p.path))]);
  refreshSite();
  redirect("/admin/events");
}

export async function addPhotos(eventId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const files = pickImages(formData, "photos");
  if (typeof files === "string") return { status: "error", errors: { photos: files } };
  const paths = await Promise.all(files.map((f) => saveUpload(f, "photos")));
  transaction(() => paths.forEach((p) => run("INSERT INTO photos (event_id, path) VALUES (?, ?)", eventId, p)));
  refreshSite();
  return { status: "success", message: `${paths.length} photo${paths.length === 1 ? "" : "s"} added.` };
}

export async function deletePhoto(id: number) {
  await requireAdmin();
  const row = get<{ path: string; event_id: number }>("SELECT path, event_id FROM photos WHERE id = ?", id);
  if (!row) return;
  run("DELETE FROM photos WHERE id = ?", id);
  await deleteUpload(row.path);
  refreshSite();
  revalidatePath(`/admin/events/${row.event_id}`);
}

/* ------------------------------------------------------------------ */
/* Company profile (single record)                                     */
/* ------------------------------------------------------------------ */

const PROFILE_FIELDS = ["company_name", "company_email", "primary_contact", "secondary_contact", "location"];

const profileSchema = z.object({
  company_name: z.string().min(1, "The company name field is required."),
  company_email: z.string().min(1, "The company email field is required.").pipe(z.email("Enter a valid email address.")),
  primary_contact: z.string().min(1, "The primary contact field is required."),
  secondary_contact: z.string(),
  location: z.string().min(1, "The location field is required."),
});

export async function saveCompanyProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const vals = values(formData, PROFILE_FIELDS);
  const parsed = profileSchema.safeParse(vals);
  const errors: Errors = parsed.success ? {} : zodErrors(parsed.error);

  const existing = get<{ id: number; profile_pdf: string | null }>("SELECT id, profile_pdf FROM company_profiles ORDER BY id LIMIT 1");
  const pdf = pickFile(formData, "profile_pdf", "pdf", !existing?.profile_pdf);
  if (typeof pdf === "string") errors.profile_pdf = pdf;
  if (!parsed.success || Object.keys(errors).length) return { status: "error", errors, values: vals };

  const d = parsed.data;
  const newPdf = pdf instanceof File ? await saveUpload(pdf, "company-profile" satisfies Collection) : null;
  if (existing) {
    run(
      `UPDATE company_profiles SET company_name = ?, company_email = ?, primary_contact = ?, secondary_contact = ?,
       location = ?, profile_pdf = COALESCE(?, profile_pdf), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      d.company_name,
      d.company_email,
      d.primary_contact,
      d.secondary_contact || null,
      d.location,
      newPdf,
      existing.id,
    );
    if (newPdf) await deleteUpload(existing.profile_pdf);
  } else {
    run(
      `INSERT INTO company_profiles (company_name, company_email, primary_contact, secondary_contact, location, profile_pdf)
       VALUES (?, ?, ?, ?, ?, ?)`,
      d.company_name,
      d.company_email,
      d.primary_contact,
      d.secondary_contact || null,
      d.location,
      newPdf,
    );
  }
  refreshSite();
  return { status: "success", message: "Company profile saved.", values: vals };
}
