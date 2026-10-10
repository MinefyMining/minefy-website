import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Static home bundle (public/assets/optimized/*): every file name
        // carries a content hash (see the bundle's PERFORMANCE.md), so a
        // long immutable cache is safe — a new asset is a new URL. Mirrors
        // the bundle's own `_headers` rule (Cloudflare format, not read by
        // Vercel), made PUBLIC because the site is public.
        source: "/assets/optimized/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
