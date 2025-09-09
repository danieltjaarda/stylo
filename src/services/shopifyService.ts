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

// Haal alle producten op van Shopify via server-side API
export async function getShopifyProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('🔍 Fetching products from server-side Shopify API...');
    
    const response = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('❌ API route error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('📦 Server API response:', data);

    if (data.products && data.products.length > 0) {
      console.log('✅ Real Shopify products loaded:', data.products);
      return data.products.slice(0, limit);
    } else {
      console.log('⚠️ No Shopify products found, using fallback');
      // Fallback to mock data if no Shopify products
      return [{
        id: 'fallback-1',
        name: 'Voeg producten toe in Shopify',
        description: 'Ga naar je Shopify Admin → Products → Add product',
        image: '/stoel-wit.png',
        price: 0,
        category: 'Info',
        stock: 0,
        rating: 0,
        reviews: 0
      }];
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
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
