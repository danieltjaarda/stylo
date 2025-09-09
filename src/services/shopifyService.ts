import client from '@/lib/shopify';
import { Product } from '@/types';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
      };
    }>;
  };
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Transform Shopify product naar onze Product interface
function transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  const firstImage = shopifyProduct.images.edges[0]?.node;
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  
  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    image: firstImage?.url || '/placeholder.jpg',
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    category: 'Shopify Product',
    stock: firstVariant?.availableForSale ? 10 : 0,
    rating: 4.5,
    reviews: 150
  };
}

// Haal alle producten op van Shopify via Buy SDK
export async function getShopifyProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('🔍 Attempting to fetch products from Shopify...');
    console.log('🔑 Store domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log('🔑 Token available:', !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);
    
    // Voor nu gebruiken we mock data terwijl we Shopify configuratie debuggen
    console.log('⚠️ Using mock data while debugging Shopify connection');
    
    // Mock Shopify-style product
    const mockShopifyProducts: Product[] = [
      {
        id: 'shopify-test-1',
        name: 'Shopify Test Bureaustoel',
        description: 'Dit product komt van Shopify API (test)',
        image: '/stoel-wit.png',
        price: 299.99,
        category: 'Shopify Product',
        stock: 10,
        rating: 4.8,
        reviews: 89
      }
    ];
    
    console.log('✅ Mock Shopify products loaded:', mockShopifyProducts);
    return mockShopifyProducts;
    
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    return [];
  }
}

// Check of Shopify geconfigureerd is
export function isShopifyConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && 
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}
