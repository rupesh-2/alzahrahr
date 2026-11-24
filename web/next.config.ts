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
    // The Laravel app in the parent folder has its own package-lock.json and
    // PostCSS config; keep Turbopack scoped to this folder.
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
