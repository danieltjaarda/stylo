import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://deskna.nl'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/feed-checker',
          '/api/validate-feed',
          '/api/shopify-debug',
          '/api/products-test',
          '/test-*',
          '/checkout',
          '/order-confirmation',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/api/google-feed', // Allow Google Merchant feed
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}






