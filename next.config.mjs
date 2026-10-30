import { getPublicHtmlRoutes } from "./scripts/public-html-routes.mjs";

const { rewrites: publicHtmlRewrites, redirects: publicHtmlRedirects } = getPublicHtmlRoutes();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid trailing-slash 301 → 404 chains (SEO recovery brief)
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      ...publicHtmlRedirects,
      // Legacy / leaked paths → real destinations (SEO recovery brief)
      { source: "/quotes", destination: "/quote", permanent: true },
      { source: "/failures/:slug*", destination: "/", permanent: true },
      { source: "/fault-diagnostic-calculator", destination: "/", permanent: true },
      { source: "/models/:slug*", destination: "/:slug*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Serve public/*.html at clean URLs before App Router catch-all routes run.
      beforeFiles: publicHtmlRewrites,
    };
  },
};

export default nextConfig;
