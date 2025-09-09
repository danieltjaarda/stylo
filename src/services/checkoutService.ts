import Client from 'shopify-buy';
import { CartItem } from '@/types';

// Initialize Shopify Buy SDK client
const client = Client.buildClient({
  domain: 'shaa16-zi.myshopify.com', // Use the correct domain directly
  storefrontAccessToken: 'b1f59b8d8c3532330b6de85a4c728d59', // Use the correct token directly
});

// Create a new checkout
export async function createCheckout() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.create() as any;
    console.log('✅ Checkout created:', checkout.id);
    return checkout;
  } catch (error) {
    console.error('❌ Error creating checkout:', error);
    throw error;
  }
}

// Add items to checkout
export async function addToCheckout(checkoutId: string, lineItems: any[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems) as any;
    console.log('✅ Items added to checkout');
    return checkout;
  } catch (error) {
    console.error('❌ Error adding to checkout:', error);
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
  return cartItems.map(item => {
    // Use variantId if available, otherwise try to construct one from product ID
    let variantId = (item.product as any).variantId || item.product.id;
    
    // If it's a Shopify product ID, we need to get the first variant
    // For now, we'll use a hardcoded variant ID for the test product
    if (item.product.id.includes('gid://shopify/Product/15272235729220')) {
      variantId = 'gid://shopify/ProductVariant/55603319374148'; // First variant of test product
    }
    
    console.log('🔄 Converting cart item:', { 
      productId: item.product.id, 
      variantId, 
      quantity: item.quantity 
    });
    
    return {
      variantId,
      quantity: item.quantity,
    };
  });
}

// Get the checkout URL for redirect
export function getCheckoutUrl(checkout: any): string {
  console.log('🔍 Checkout object:', checkout);
  console.log('🔗 Available URLs:', {
    webUrl: checkout.webUrl,
    checkoutUrl: checkout.checkoutUrl,
    url: checkout.url
  });
  
  return checkout.webUrl || checkout.checkoutUrl || checkout.url;
}
