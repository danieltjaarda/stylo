import { Product } from '@/types';

// Fallback mock data voor development (als Shopify nog niet geconfigureerd is)
// Deze data wordt vervangen door echte Shopify data zodra de API is geconfigureerd
export const mockShopifyProducts: Product[] = [
  {
    id: "gid://shopify/Product/1",
    shopifyId: "gid://shopify/Product/1",
    handle: "ergonomische-bureaustoel-pro",
    name: "Ergonomische Bureaustoel Pro",
    description: "Premium ergonomische bureaustoel met verstelbare lendensteuning en armleuningen. Perfect voor lange werkdagen.",
    image: "/stoel-wit.png",
    price: 299.99,
    category: "Bureaustoelen",
    stock: 15,
    rating: 4.8,
    reviews: 156,
    vendor: "ErgoComfort",
    productType: "Bureaustoel",
    tags: ["ergonomisch", "premium", "verstelbaar", "lendensteuning"],
    variants: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "Zwart",
        availableForSale: true,
        selectedOptions: [{ name: "Kleur", value: "Zwart" }],
        price: { amount: "299.99", currencyCode: "EUR" },
        compareAtPrice: { amount: "399.99", currencyCode: "EUR" }
      },
      {
        id: "gid://shopify/ProductVariant/2", 
        title: "Wit",
        availableForSale: true,
        selectedOptions: [{ name: "Kleur", value: "Wit" }],
        price: { amount: "299.99", currencyCode: "EUR" },
        compareAtPrice: { amount: "399.99", currencyCode: "EUR" }
      }
    ],
    images: [
      {
        id: "1",
        url: "/stoel-wit.png",
        altText: "Ergonomische Bureaustoel Pro - Wit",
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: "gid://shopify/Product/2",
    shopifyId: "gid://shopify/Product/2",
    handle: "sta-bureau-elektrisch",
    name: "Elektrisch Verstelbaar Sta-bureau",
    description: "Hoogwaardig elektrisch verstelbaar bureau met geheugen presets. Ideaal voor een gezonde werkhouding.",
    image: "/stoel 3.png",
    price: 599.99,
    category: "Bureaus",
    stock: 8,
    rating: 4.9,
    reviews: 89,
    vendor: "DeskTech",
    productType: "Bureau",
    tags: ["elektrisch", "verstelbaar", "sta-bureau", "ergonomisch"],
    variants: [
      {
        id: "gid://shopify/ProductVariant/3",
        title: "120cm x 80cm",
        availableForSale: true,
        selectedOptions: [{ name: "Afmeting", value: "120cm x 80cm" }],
        price: { amount: "599.99", currencyCode: "EUR" },
        compareAtPrice: { amount: "799.99", currencyCode: "EUR" }
      },
      {
        id: "gid://shopify/ProductVariant/4",
        title: "140cm x 80cm", 
        availableForSale: true,
        selectedOptions: [{ name: "Afmeting", value: "140cm x 80cm" }],
        price: { amount: "699.99", currencyCode: "EUR" },
        compareAtPrice: { amount: "899.99", currencyCode: "EUR" }
      }
    ],
    images: [
      {
        id: "2",
        url: "/stoel 3.png",
        altText: "Elektrisch Verstelbaar Sta-bureau",
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: "gid://shopify/Product/3",
    shopifyId: "gid://shopify/Product/3", 
    handle: "gaming-stoel-rgb",
    name: "Gaming Stoel met RGB Verlichting",
    description: "Professionele gaming stoel met RGB verlichting en premium materialen. Perfect voor lange gaming sessies.",
    image: "/stoel-wit.png",
    price: 449.99,
    category: "Gaming Stoelen",
    stock: 12,
    rating: 4.7,
    reviews: 234,
    vendor: "GameComfort",
    productType: "Gaming Stoel",
    tags: ["gaming", "rgb", "verlichting", "premium"],
    variants: [
      {
        id: "gid://shopify/ProductVariant/5",
        title: "RGB - Zwart/Rood",
        availableForSale: true,
        selectedOptions: [{ name: "Kleur", value: "Zwart/Rood" }],
        price: { amount: "449.99", currencyCode: "EUR" },
        compareAtPrice: { amount: "599.99", currencyCode: "EUR" }
      }
    ],
    images: [
      {
        id: "3",
        url: "/stoel-wit.png", 
        altText: "Gaming Stoel met RGB Verlichting",
        width: 800,
        height: 800
      }
    ]
  }
];

// Functie om te checken of Shopify geconfigureerd is
export function isShopifyConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && 
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}

// Helper functie om product collections te simuleren
export const mockCollections = {
  featured: mockShopifyProducts.slice(0, 3),
  bestsellers: mockShopifyProducts,
  bureaustoelen: mockShopifyProducts.filter(p => p.category === 'Bureaustoelen'),
  bureaus: mockShopifyProducts.filter(p => p.category === 'Bureaus'),
  gaming: mockShopifyProducts.filter(p => p.category === 'Gaming Stoelen')
};
