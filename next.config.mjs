/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
    ],
  },
  swcMinify: true, // Um die Größe von JS-Dateien zu reduzieren
  experimental: {
    optimizeCss: true, // CSS-Optimierung (funktioniert mit Tailwind)
  }
};

export default nextConfig;
