import { Product } from '@/types';

// Haal alle producten op van Shopify via server-side API
export async function getShopifyProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('🔍 Fetching products from server-side Shopify API...');
    
    const response = await fetch('/api/products-test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 API route status:', response.status);

    if (!response.ok) {
      console.log('❌ API route error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('📦 Server API response:', data);

    if (data.error) {
      console.log('❌ Server API error:', data.error);
      if (data.details) {
        console.log('📝 Error details:', data.details);
      }
      return [];
    }

    if (data.success && data.products && data.products.length > 0) {
      console.log(`✅ ${data.products.length} real Shopify products loaded!`);
      // Transform to our Product interface
      const transformedProducts = data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        category: 'Shopify Product',
        stock: 10,
        rating: 4.5,
        reviews: 150
      }));
      return transformedProducts.slice(0, limit);
    } else {
      console.log('⚠️ No Shopify products found - add products in Shopify Admin');
      // Helpful fallback message
      return [{
        id: 'no-products',
        name: 'Geen producten gevonden',
        description: 'Voeg producten toe in je Shopify Admin → Products → Add product',
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
