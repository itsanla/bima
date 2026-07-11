import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images from public/ directory (all subdirectories)
    localPatterns: [
      { pathname: "/naxos_assets/**" },
      { pathname: "/images/**" },
    ],
    // Allow unoptimized for local template assets to avoid layout shifts
    unoptimized: false,
  },
  output: "standalone",
};

export default nextConfig;
