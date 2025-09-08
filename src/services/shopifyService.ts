import { shopifyFetch, GET_PRODUCTS_QUERY } from '@/lib/shopify';
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

// Haal alle producten op van Shopify
export async function getShopifyProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('🔍 Attempting to fetch products from Shopify...');
    console.log('🔑 Store domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
    console.log('🔑 Token available:', !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);
    
    const response = await shopifyFetch<ShopifyProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: limit }
    });

    console.log('📦 Shopify API response:', response);

    if (response.data?.products?.edges) {
      const products = response.data.products.edges.map(edge => 
        transformShopifyProduct(edge.node)
      );
      console.log('✅ Transformed products:', products);
      return products;
    }
    
    console.log('⚠️ No products in response');
    return [];
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
