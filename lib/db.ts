import "server-only";
import { createClient, type Client, type InStatement, type InValue } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

/**
 * libSQL database: Turso in production (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN),
 * a local SQLite file in development.
 *
 * The schema mirrors the Laravel migrations, except that each record stores its
 * uploaded file (a Vercel Blob URL, or a path under storage/uploads locally) in a
 * column instead of in Spatie's polymorphic `media` table.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  primary_contact TEXT NOT NULL,
  secondary_contact TEXT,
  location TEXT NOT NULL,
  profile_pdf TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS advertisements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_title TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  male_required INTEGER NOT NULL DEFAULT 0,
  female_required INTEGER NOT NULL DEFAULT 0,
  minimum_qualification TEXT NOT NULL DEFAULT '',
  job_description TEXT NOT NULL DEFAULT '',
  salary INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  logo TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export const STORAGE_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.STORAGE_DIR ?? "storage");

function databaseUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) return url;
  if (process.env.VERCEL) {
    throw new Error("TURSO_DATABASE_URL is not set. Connect a Turso database to this Vercel project (see README).");
  }
  // Local development: a SQLite file under storage/.
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
  return `file:${path.join(STORAGE_DIR, "app.sqlite")}`;
}

type State = { client: Client; ready: Promise<void> };

async function prepare(client: Client) {
  await client.executeMultiple(SCHEMA);
  await seedAdmin(client);
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no user exists yet. */
async function seedAdmin(client: Client) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const rs = await client.execute("SELECT COUNT(*) AS count FROM users");
  if (Number(rs.rows[0].count) > 0) return;
  await client.execute({
    sql: "INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    args: [process.env.ADMIN_NAME ?? "Administrator", email.toLowerCase(), hashPassword(password)],
  });
}

function state(): State {
  // One client per server instance, reused across hot reloads in development.
  const g = globalThis as { __alzahraDb?: State };
  if (!g.__alzahraDb) {
    const client = createClient({ url: databaseUrl(), authToken: process.env.TURSO_AUTH_TOKEN });
    const ready = prepare(client);
    // Retry setup on the next request if it failed (for example, a network blip).
    ready.catch(() => {
      if (g.__alzahraDb?.ready === ready) g.__alzahraDb = undefined;
    });
    g.__alzahraDb = { client, ready };
  }
  return g.__alzahraDb;
}

async function db(): Promise<Client> {
  const s = state();
  await s.ready;
  return s.client;
}

function toObjects<T>(rs: { columns: string[]; rows: ArrayLike<unknown>[] }): T[] {
  return rs.rows.map((row) => Object.fromEntries(rs.columns.map((c, i) => [c, row[i]])) as T);
}

export async function all<T>(sql: string, ...args: InValue[]): Promise<T[]> {
  const rs = await (await db()).execute({ sql, args });
  return toObjects<T>(rs);
}

export async function get<T>(sql: string, ...args: InValue[]): Promise<T | undefined> {
  return (await all<T>(sql, ...args))[0];
}

export async function run(sql: string, ...args: InValue[]) {
  const rs = await (await db()).execute({ sql, args });
  return { changes: rs.rowsAffected, id: Number(rs.lastInsertRowid ?? 0) };
}

/** Runs several statements atomically. */
export async function batch(statements: InStatement[]) {
  if (statements.length) await (await db()).batch(statements, "write");
}
