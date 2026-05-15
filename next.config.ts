import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during Vercel build (legacy eslint-config-next import resolution
  // mismatch in the flat config); local lint script remains usable.
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
