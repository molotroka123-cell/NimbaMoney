/**
 * STATIC_EXPORT=1 builds a fully static site into `out/` (used for GitHub
 * Pages). NEXT_PUBLIC_BASE_PATH is the sub-path the site is served from,
 * e.g. "/NimbaMoney" for https://<user>.github.io/NimbaMoney.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: basePath || undefined,
      }
    : {
        async redirects() {
          // Legacy routes from the single-marketplace prototype.
          return [
            { source: "/find", destination: "/marketplace", permanent: false },
            { source: "/providers", destination: "/marketplace/providers", permanent: false },
            { source: "/providers/:slug", destination: "/marketplace/providers/:slug", permanent: false },
            { source: "/requests", destination: "/marketplace/requests", permanent: false },
            { source: "/requests/:id", destination: "/marketplace/request/:id", permanent: false },
          ];
        },
      }),
};
export default nextConfig;
