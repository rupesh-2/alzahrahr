import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page reads live data from SQLite, so pages render per request
  // instead of being prerendered with Cache Components.
  cacheComponents: false,
  // libSQL loads a native SQLite binding for local file databases.
  serverExternalPackages: ["@libsql/client", "libsql"],
  experimental: {
    serverActions: {
      // Locally, admin uploads (e.g. the ~20 MB company profile PDF) go through
      // Server Actions. On Vercel (4.5 MB request cap) the browser uploads files
      // to Blob directly instead. The public apply form limits each file to 1 MB.
      bodySizeLimit: "25mb",
    },
  },
  turbopack: {
    // Keep Turbopack scoped to this folder even if a parent folder has its own lockfile.
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
