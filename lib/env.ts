/**
 * Reads an environment variable that a Vercel storage integration may have
 * created with a custom prefix (e.g. `STORAGE_TURSO_DATABASE_URL`).
 * The exact name wins; otherwise the first variable ending in `_<name>`.
 */
export function integrationEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  const key = Object.keys(process.env)
    .sort()
    .find((k) => k.endsWith(`_${name}`) && process.env[k]);
  return key ? process.env[key] : undefined;
}
