import type { NextConfig } from "next";

/** Upstream API (no CORS needed: browser calls same-origin /api/v1, Next proxies here). */
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ?? "https://api.jubotaranews.com";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
