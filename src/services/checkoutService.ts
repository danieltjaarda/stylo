import Client from 'shopify-buy';
import { CartItem } from '@/types';

// Initialize Shopify Buy SDK client
const client = Client.buildClient({
  domain: 'shaa16-zi.myshopify.com', // Use the correct domain directly
  storefrontAccessToken: 'b1f59b8d8c3532330b6de85a4c728d59', // Use the correct token directly
  apiVersion: '2023-07', // Revert to known working API version
});

// Create a new checkout - simplified version
export async function createCheckout() {
  try {
    console.log('🚀 Creating checkout with basic parameters...');
    // Use the most basic checkout creation - no extra parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.create() as any;
    console.log('✅ Checkout created successfully:', {
      id: checkout.id,
      webUrl: checkout.webUrl,
      ready: checkout.ready
    });
    return checkout;
  } catch (error: any) {
    console.error('❌ Error creating checkout:', {
      message: error?.message,
      details: error?.graphQLErrors || error?.networkError || error
    });
    throw error;
  }
}

// Add items to checkout
export async function addToCheckout(checkoutId: string, lineItems: any[]) {
  try {
    console.log('🔄 Adding items to checkout:', {
      checkoutId,
      lineItemsCount: lineItems.length,
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    });
    
    // Validate line items before sending
    const validLineItems = lineItems.filter(item => 
      item.variantId && 
      item.quantity > 0 && 
      typeof item.variantId === 'string' &&
      item.variantId.includes('gid://shopify/ProductVariant/')
    );
    
    if (validLineItems.length === 0) {
      throw new Error('No valid line items found');
    }
    
    console.log('📦 Valid line items:', validLineItems);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.addLineItems(checkoutId, validLineItems) as any;
    console.log('✅ Items added to checkout successfully:', {
      totalPrice: checkout.totalPrice,
      lineItemsCount: checkout.lineItems?.length
    });
    return checkout;
  } catch (error: any) {
    console.error('❌ Add to checkout error:', {
      message: error?.message,
      graphQLErrors: error?.graphQLErrors,
      networkError: error?.networkError,
      userErrors: error?.userErrors
    });
    
    throw error;
  }
}

// Update checkout with new items
export async function updateCheckout(checkoutId: string, lineItems: any[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.updateLineItems(checkoutId, lineItems) as any;
    console.log('✅ Checkout updated');
    return checkout;
  } catch (error) {
    console.error('❌ Error updating checkout:', error);
    throw error;
  }
}

// Remove items from checkout
export async function removeFromCheckout(checkoutId: string, lineItemIds: string[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.removeLineItems(checkoutId, lineItemIds) as any;
    console.log('✅ Items removed from checkout');
    return checkout;
  } catch (error) {
    console.error('❌ Error removing from checkout:', error);
    throw error;
  }
}

// Get checkout details
export async function getCheckout(checkoutId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.fetch(checkoutId) as any;
    return checkout;
  } catch (error) {
    console.error('❌ Error fetching checkout:', error);
    throw error;
  }
}

// Convert cart items to Shopify line items format
export function cartItemsToLineItems(cartItems: CartItem[]) {
  console.log('🔄 Converting cart items to line items:', cartItems.length);
  
  const lineItems = cartItems.map((item, index) => {
    console.log(`📦 Processing cart item ${index + 1}:`, {
      productId: item.product.id,
      productName: (item.product as any).title || item.product.name,
      quantity: item.quantity,
      rawProduct: item.product
    });
    
    // Get the variant ID from the product - try multiple sources
    let variantId = (item.product as any).variantId;
    
    // If no variantId available, try to get it from variants array
    if (!variantId && (item.product as any).variants && (item.product as any).variants.length > 0) {
      const firstVariant = (item.product as any).variants[0];
      variantId = firstVariant.id;
      console.log('📦 Using first variant ID:', variantId);
    }
    
    // Try to get it from selectedVariant if available
    if (!variantId && (item.product as any).selectedVariant) {
      variantId = (item.product as any).selectedVariant.id;
      console.log('📦 Using selected variant ID:', variantId);
    }
    
    // If still no variantId, try to construct from product ID
    if (!variantId && item.product.id.includes('gid://shopify/Product/')) {
      console.error('❌ No variant ID found for Shopify product:', {
        productId: item.product.id,
        productName: (item.product as any).title || item.product.name
      });
      return null;
    }
    
    // Validate variant ID format
    if (!variantId || typeof variantId !== 'string') {
      console.error('❌ Invalid variant ID (not a string):', {
        productId: item.product.id,
        variantId,
        type: typeof variantId
      });
      return null;
    }
    
    // Check if it's a proper Shopify variant ID format
    if (!variantId.includes('gid://shopify/ProductVariant/')) {
      console.error('❌ Invalid variant ID format:', {
        productId: item.product.id,
        variantId,
        expected: 'gid://shopify/ProductVariant/...'
      });
      return null;
    }
    
    console.log('✅ Valid line item created:', { 
      productId: item.product.id, 
      variantId, 
      quantity: item.quantity,
      productName: (item.product as any).title || item.product.name
    });
    
    return {
      variantId,
      quantity: item.quantity,
    };
  }).filter(Boolean); // Remove null entries
  
  console.log(`📦 Final line items: ${lineItems.length}/${cartItems.length} valid`);
  return lineItems;
}

// Get the checkout URL for redirect
export function getCheckoutUrl(checkout: any): string {
  console.log('🔍 Checkout object:', checkout);
  console.log('🔗 Available URLs:', {
    webUrl: checkout.webUrl,
    checkoutUrl: checkout.checkoutUrl,
    url: checkout.url
  });
  
  let checkoutUrl = checkout.webUrl || checkout.checkoutUrl || checkout.url;
  
  // Fix channel parameter issue - remove buy_button channel and add correct one
  if (checkoutUrl) {
    try {
      const url = new URL(checkoutUrl);
      
      // Remove the problematic channel parameter
      url.searchParams.delete('channel');
      
      // Add the correct channel for web checkout
      url.searchParams.set('channel', 'online_store');
      
      checkoutUrl = url.toString();
      console.log('🔗 Fixed checkout URL with correct channel:', checkoutUrl);
    } catch (error) {
      console.error('❌ Failed to fix checkout URL:', error);
    }
  }
  
  // Use custom checkout domain if configured
  if (process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN && checkoutUrl) {
    try {
      const url = new URL(checkoutUrl);
      url.hostname = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN;
      checkoutUrl = url.toString();
      console.log('🔗 Using custom checkout domain:', checkoutUrl);
    } catch (error) {
      console.error('❌ Failed to apply custom checkout domain:', error);
    }
  }
  
  return checkoutUrl;
}
