import type { NextConfig } from "next";

/**
 * Two build targets:
 *  - default: full Next.js server (Vercel, Node) — language switch, APIs.
 *  - NEXT_PUBLIC_STATIC_EXPORT=1: static files for the GitHub Pages demo.
 *    NEXT_PUBLIC_BASE_PATH is the repo sub-path, e.g. "/Chat-practice-121".
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = isStatic
  ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
  : {
      // Hidden Diwali page: reachable only by direct link, never indexed or listed.
      async rewrites() {
        return [
          { source: "/diwali", destination: "/diwali/index.html" },
          { source: "/w/:name", destination: "/diwali/index.html" },
        ];
      },
      async headers() {
        return [
          { source: "/diwali/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
          { source: "/w/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
        ];
      },
    };

export default nextConfig;
