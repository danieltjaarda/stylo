/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '*.cdn.shopify.com' },
      { protocol: 'https', hostname: 'shaa16-zi.myshopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 80, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
