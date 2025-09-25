import { Product } from '@/types';

// Haal producten op van een specifieke Shopify collection
export async function getShopifyCollection(collectionHandle: string): Promise<Product[]> {
  try {
    console.log(`🔍 Fetching collection '${collectionHandle}' from Shopify...`);
    
    const response = await fetch(`/api/collections/${collectionHandle}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('❌ Collection API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('📦 Collection API response:', data);

    if (data.error) {
      console.log('❌ Collection API error:', data.error);
      return [];
    }

    if (data.success && data.products && data.products.length > 0) {
      console.log(`✅ ${data.products.length} products loaded from collection '${collectionHandle}'!`);
      return data.products;
    }

    return [];
  } catch (error) {
    console.error('❌ Error fetching collection:', error);
    return [];
  }
}

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
      const transformedProducts = data.products.map((product: any) => {
        const variants = (product.variants || []).map((v: any) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          available: v.available,
          availableForSale: v.available, // Add both properties for consistency
          selectedOptions: v.selectedOptions,
          image: v.image ? {
            url: v.image.url || v.imageUrl,
            altText: v.image.altText
          } : null,
          imageUrl: v.imageUrl || v.image?.url, // Keep legacy property
        }));
        const options = (product.options || []).map((o: any) => ({ name: o.name, values: o.values }));
        const firstVariantId = variants[0]?.id;
        return {
          id: product.id,
          handle: product.handle,
          variantId: firstVariantId,
          name: product.name,
          description: product.description,
          image: product.image,
          images: (product.images || []).map((img: any) => ({ url: img.url, altText: img.altText })),
          price: product.price,
          category: 'Shopify Product',
          stock: 10,
          rating: 4.5,
          reviews: 150,
          variants,
          options,
          isDeskOne: product.isDeskOne,
          isSeatPro: product.isSeatPro,
          addOns: product.addOns || null,
        } as Product;
      });
      return transformedProducts.slice(0, limit);
    } else {
      console.log('⚠️ No Shopify products found - add products in Shopify Admin');
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

// Haal een specifiek product op van Shopify
export async function getShopifyProduct(handle: string): Promise<Product | null> {
  try {
    console.log(`🔍 Fetching product '${handle}' from Shopify...`);
    
    const response = await fetch(`/api/products/${handle}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('❌ Product API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('📦 Product API response:', data);

    if (data.error) {
      console.log('❌ Product API error:', data.error);
      return null;
    }

    if (data.success && data.product) {
      console.log(`✅ Product loaded: ${data.product.title}`);
      
      // Transform to match our Product type
      const product = data.product;
      const transformedProduct: Product = {
        id: product.id,
        handle: product.handle,
        variantId: product.variants[0]?.id,
        name: product.title,
        description: product.description,
        image: product.images[0]?.url || '/stoel-wit.png',
        images: product.images?.map((img: any) => img.url) || [],
        price: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
        category: product.productType || 'Product',
        stock: product.variants?.some((v: any) => v.availableForSale) ? 10 : 0,
        rating: 4.5,
        reviews: 150,
        variants: product.variants?.map((variant: any) => ({
          id: variant.id,
          title: variant.title,
          price: parseFloat(variant.price?.amount || '0'),
          compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
          availableForSale: variant.availableForSale,
          selectedOptions: variant.selectedOptions,
          image: variant.image ? {
            url: variant.image.url,
            altText: variant.image.altText
          } : null,
          imageUrl: variant.image?.url, // Keep legacy property for backwards compatibility
        })) || [],
        options: product.options || [],
      };
      
      return transformedProduct;
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

// Check of Shopify geconfigureerd is
export function isShopifyConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && 
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}
