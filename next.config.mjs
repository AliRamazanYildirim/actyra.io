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
      'img.clerk.com',     // Clerk-Bilder erlauben
      'images.clerk.dev',  // Alternative Clerk-Domain
      // ...andere Domains, die du möglicherweise bereits hast
    ],
  },
};

export default nextConfig;
