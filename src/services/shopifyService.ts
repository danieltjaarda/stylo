import { shopifyFetch, PRODUCT_QUERY, SINGLE_PRODUCT_QUERY, COLLECTION_QUERY } from '@/lib/shopify';
import { 
  ShopifyProduct, 
  ShopifyProductsResponse, 
  ShopifyProductResponse, 
  ShopifyCollectionResponse,
  Product,
  ShopifyVariant,
  ShopifyImage
} from '@/types';

// Helper functie om Shopify product om te zetten naar legacy Product interface
export function transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  const firstImage = shopifyProduct.images.edges[0]?.node;
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  
  return {
    id: shopifyProduct.id,
    shopifyId: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    image: firstImage?.url || '/placeholder.jpg',
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    category: shopifyProduct.productType || 'Uncategorized',
    stock: shopifyProduct.variants.edges.filter(v => v.node.availableForSale).length,
    rating: 4.5, // Default rating - je kunt dit later vervangen met echte reviews
    reviews: 1200, // Default reviews count
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    tags: shopifyProduct.tags,
    variants: shopifyProduct.variants.edges.map(edge => edge.node),
    images: shopifyProduct.images.edges.map(edge => edge.node)
  };
}

// Haal alle producten op
export async function getAllProducts(limit: number = 50): Promise<Product[]> {
  try {
    const response = await shopifyFetch<ShopifyProductsResponse>({
      query: PRODUCT_QUERY,
      variables: { first: limit }
    });

    return response.data.products.edges.map(edge => 
      transformShopifyProduct(edge.node)
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Haal een enkel product op via handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const response = await shopifyFetch<ShopifyProductResponse>({
      query: SINGLE_PRODUCT_QUERY,
      variables: { handle }
    });

    if (!response.data.productByHandle) {
      return null;
    }

    return transformShopifyProduct(response.data.productByHandle);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Haal producten op uit een specifieke collectie
export async function getProductsFromCollection(collectionHandle: string, limit: number = 20): Promise<Product[]> {
  try {
    const response = await shopifyFetch<ShopifyCollectionResponse>({
      query: COLLECTION_QUERY,
      variables: { handle: collectionHandle, first: limit }
    });

    if (!response.data.collectionByHandle) {
      return [];
    }

    return response.data.collectionByHandle.products.edges.map(edge => 
      transformShopifyProduct(edge.node)
    );
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
}

// Haal featured/bestseller producten op (bijvoorbeeld uit een "featured" collectie)
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  // Je kunt dit aanpassen naar een specifieke collectie handle
  // Bijvoorbeeld: 'featured', 'bestsellers', 'hardlopers', etc.
  return await getProductsFromCollection('featured', limit);
}

// Haal product varianten op
export function getProductVariants(product: Product): ShopifyVariant[] {
  return product.variants || [];
}

// Haal product afbeeldingen op
export function getProductImages(product: Product): ShopifyImage[] {
  return product.images || [];
}

// Helper functie om prijs te formatteren
export function formatPrice(amount: string | number, currencyCode: string = 'EUR'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

// Helper functie om korting te berekenen
export function calculateDiscount(price: ShopifyPrice, compareAtPrice?: ShopifyPrice): number {
  if (!compareAtPrice) return 0;
  
  const currentPrice = parseFloat(price.amount);
  const originalPrice = parseFloat(compareAtPrice.amount);
  
  if (originalPrice <= currentPrice) return 0;
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Search functionaliteit (basis implementatie)
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  // Dit is een basis implementatie - Shopify heeft meer geavanceerde search mogelijkheden
  const allProducts = await getAllProducts(100);
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, limit);
}
