/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
    // Lokal dosyalar için unoptimized: true seçeneği
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true, // CSS-Optimierung (funktioniert mit Tailwind)
  },
};

export default nextConfig;
