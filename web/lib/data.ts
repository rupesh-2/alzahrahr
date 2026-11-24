import "server-only";
import { connection } from "next/server";
import { all, get, run } from "./db";

export type CompanyProfile = {
  id: number;
  company_name: string;
  company_email: string;
  primary_contact: string;
  secondary_contact: string | null;
  location: string;
  profile_pdf: string | null;
};

export type Advertisement = {
  id: number;
  job_title: string;
  location: string;
  company_name: string;
  male_required: number;
  female_required: number;
  minimum_qualification: string;
  job_description: string;
  salary: number;
  image: string | null;
  created_at: string;
};

export type Client = { id: number; country_name: string };
export type Company = { id: number; client_id: number; logo: string };
export type ClientWithCompanies = Client & { companies: Company[] };

export type Event = {
  id: number;
  name: string;
  description: string | null;
  cover_image: string | null;
};
export type EventWithCount = Event & { photo_count: number };
export type Photo = { id: number; event_id: number; path: string };

// Every reader waits for a request, so pages always show current database contents.

export async function getCompanyProfile() {
  await connection();
  return get<CompanyProfile>("SELECT * FROM company_profiles ORDER BY id LIMIT 1");
}

/** Advertisements expire eight days after they are posted (same rule as the Laravel site). */
function deleteExpiredAdvertisements() {
  run("DELETE FROM advertisements WHERE created_at < datetime('now', '-8 days')");
}

export async function getAdvertisements(limit?: number) {
  await connection();
  deleteExpiredAdvertisements();
  return limit
    ? all<Advertisement>("SELECT * FROM advertisements ORDER BY id LIMIT ?", limit)
    : all<Advertisement>("SELECT * FROM advertisements ORDER BY id");
}

export async function getAdvertisement(id: number) {
  await connection();
  return get<Advertisement>("SELECT * FROM advertisements WHERE id = ?", id);
}

export async function getCompanies() {
  await connection();
  return all<Company>("SELECT * FROM companies ORDER BY id");
}

export async function getClientsWithCompanies(): Promise<ClientWithCompanies[]> {
  await connection();
  const clients = all<Client>("SELECT id, country_name FROM clients ORDER BY id");
  const companies = all<Company>("SELECT * FROM companies ORDER BY id");
  return clients.map((c) => ({ ...c, companies: companies.filter((co) => co.client_id === c.id) }));
}

export async function getEvents() {
  await connection();
  return all<EventWithCount>(
    `SELECT e.*, (SELECT COUNT(*) FROM photos p WHERE p.event_id = e.id) AS photo_count
     FROM events e ORDER BY e.id`,
  );
}

export async function getEvent(id: number) {
  await connection();
  return get<Event>("SELECT * FROM events WHERE id = ?", id);
}

export async function getEventPhotos(eventId: number) {
  await connection();
  return all<Photo>("SELECT * FROM photos WHERE event_id = ? ORDER BY id", eventId);
}

/** Parses a route segment as a positive integer id, or returns null. */
export function parseId(value: string): number | null {
  return /^\d+$/.test(value) ? Number(value) : null;
}
