import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site vitrine 100 % statique : pas besoin de Cache Components. Le désactiver garde le
  // comportement classique (les pages quittées sont démontées), ce dont dépendent les
  // transitions de page et la lecture des sections pour la scène 3D.
  cacheComponents: false,
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
