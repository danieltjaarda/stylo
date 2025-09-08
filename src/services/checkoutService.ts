import client from '@/lib/shopify';
import { CartItem, ShopifyVariant } from '@/types';

export interface CheckoutLineItem {
  variantId: string;
  quantity: number;
}

export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        variant: ShopifyVariant;
      };
    }>;
  };
}

// Maak een nieuwe checkout aan
export async function createCheckout(): Promise<ShopifyCheckout | null> {
  try {
    const checkout = await client.checkout.create();
    return checkout as ShopifyCheckout; // Type casting vanwege Shopify SDK types
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}

// Voeg items toe aan checkout
export async function addToCheckout(
  checkoutId: string, 
  lineItems: CheckoutLineItem[]
): Promise<ShopifyCheckout | null> {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error adding items to checkout:', error);
    return null;
  }
}

// Update checkout items
export async function updateCheckout(
  checkoutId: string,
  lineItems: Array<{ id: string; quantity: number; variantId: string }>
): Promise<ShopifyCheckout | null> {
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, lineItems);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error updating checkout:', error);
    return null;
  }
}

// Verwijder items van checkout
export async function removeFromCheckout(
  checkoutId: string,
  lineItemIds: string[]
): Promise<ShopifyCheckout | null> {
  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, lineItemIds);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error removing items from checkout:', error);
    return null;
  }
}

// Haal checkout op via ID
export async function getCheckout(checkoutId: string): Promise<ShopifyCheckout | null> {
  try {
    const checkout = await client.checkout.fetch(checkoutId);
    return checkout as ShopifyCheckout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    return null;
  }
}

// Helper functie om cart items om te zetten naar checkout line items
export function cartItemsToLineItems(cartItems: CartItem[]): CheckoutLineItem[] {
  return cartItems
    .filter(item => item.shopifyVariantId) // Alleen items met Shopify variant ID
    .map(item => ({
      variantId: item.shopifyVariantId!,
      quantity: item.quantity
    }));
}

// Helper functie om checkout URL te genereren
export function getCheckoutUrl(checkout: ShopifyCheckout): string {
  return checkout.webUrl;
}

// Helper functie om prijs te formatteren
export function formatCheckoutPrice(price: { amount: string; currencyCode: string }): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
}
