/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // حذف appDir که در Next.js 14 deprecated شده
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
