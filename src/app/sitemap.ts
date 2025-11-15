<<<<<<< HEAD
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://deskna.nl'
  
  // Known product handles (manually maintained or fetched from Shopify at build)
  const productHandles = [
    'deskone-bureau',
    'deskpro', 
    'seatpro-ergonomische-bureau-stoel',
    'monitorarm-enkel',
    // Add more product handles as needed
  ]

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/bureaustoelen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
=======
import { MetadataRoute } from 'next';
import { getShopifyProducts } from '@/services/shopifyService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://deskna.se';
  
  // Fetch all products from Shopify
  let products: any[] = [];
  try {
    products = await getShopifyProducts(100); // Get up to 100 products
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop-alles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bureaustoelen`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
      priority: 0.9,
    },
    {
      url: `${baseUrl}/verstelbare-bureaus`,
      lastModified: new Date(),
<<<<<<< HEAD
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop-alles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kortingen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
=======
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
<<<<<<< HEAD
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
=======
      changeFrequency: 'monthly' as const,
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
      priority: 0.7,
    },
    {
      url: `${baseUrl}/b2b`,
      lastModified: new Date(),
<<<<<<< HEAD
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/vergelijking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
=======
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kortingen`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
      priority: 0.5,
    },
    {
      url: `${baseUrl}/montagehandleidingen`,
      lastModified: new Date(),
<<<<<<< HEAD
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/herroepingsrecht`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
=======
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
<<<<<<< HEAD
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/colofon`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Generate product pages from known handles
  const productPages: MetadataRoute.Sitemap = productHandles.map((handle) => ({
    url: `${baseUrl}/products/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}

=======
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Product pages - dynamically generated from Shopify
  const productPages = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.handle || product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dutch language versions of main pages
  const dutchPages = [
    {
      url: `${baseUrl}?lang=nl`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop-alles?lang=nl`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bureaustoelen?lang=nl`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/verstelbare-bureaus?lang=nl`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Swedish language versions of main pages
  const swedishPages = [
    {
      url: `${baseUrl}?lang=sv`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop-alles?lang=sv`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bureaustoelen?lang=sv`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/verstelbare-bureaus?lang=sv`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...productPages, ...dutchPages, ...swedishPages];
}
>>>>>>> bc2de36bea2326e7e2bb9a9413c983a360f3ff8c
