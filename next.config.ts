import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page reads live data from SQLite, so pages render per request
  // instead of being prerendered with Cache Components.
  cacheComponents: false,
  experimental: {
    serverActions: {
      // Admin uploads include the company profile PDF (around 20 MB).
      // The public apply form still limits each file to 1 MB itself.
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
