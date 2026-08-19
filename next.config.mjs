/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};
export default nextConfig;
