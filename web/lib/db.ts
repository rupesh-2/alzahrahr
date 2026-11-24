import "server-only";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

/**
 * SQLite database, opened lazily on first use.
 *
 * The schema mirrors the Laravel migrations, except that each record stores its
 * uploaded file path in a column instead of in Spatie's polymorphic `media` table.
 */

const SCHEMA = `
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

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
const DB_PATH = path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH ?? path.join(STORAGE_DIR, "app.sqlite"));

let db: DatabaseSync | undefined;

function open(): DatabaseSync {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const conn = new DatabaseSync(DB_PATH);
  conn.exec(SCHEMA);
  seedAdmin(conn);
  return conn;
}

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no user exists yet. */
function seedAdmin(conn: DatabaseSync) {
  const { count } = conn.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (count > 0 || !email || !password) return;
  conn
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
    .run(process.env.ADMIN_NAME ?? "Administrator", email.toLowerCase(), hashPassword(password));
}

export function getDb(): DatabaseSync {
  // Reuse one connection across hot reloads in development.
  const g = globalThis as { __alzahraDb?: DatabaseSync };
  if (!db) db = g.__alzahraDb ?? open();
  g.__alzahraDb = db;
  return db;
}

/** node:sqlite returns null-prototype rows; copy them so they can cross to Client Components. */
function plain<T>(row: unknown): T {
  return { ...(row as object) } as T;
}

export function all<T>(sql: string, ...params: SQLInputValue[]): T[] {
  return getDb()
    .prepare(sql)
    .all(...params)
    .map((r) => plain<T>(r));
}

export function get<T>(sql: string, ...params: SQLInputValue[]): T | undefined {
  const row = getDb()
    .prepare(sql)
    .get(...params);
  return row ? plain<T>(row) : undefined;
}

export function run(sql: string, ...params: SQLInputValue[]) {
  const result = getDb()
    .prepare(sql)
    .run(...params);
  return { changes: Number(result.changes), id: Number(result.lastInsertRowid) };
}

export function transaction<T>(fn: () => T): T {
  const conn = getDb();
  conn.exec("BEGIN");
  try {
    const out = fn();
    conn.exec("COMMIT");
    return out;
  } catch (e) {
    conn.exec("ROLLBACK");
    throw e;
  }
}
