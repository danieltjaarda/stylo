/**
 * Meta Pixel Helper Library
 * 
 * Hybride setup voor headless Shopify checkout:
 * - Next.js handelt: PageView, ViewContent, AddToCart, InitiateCheckout
 * - Shopify handelt: Purchase (via Facebook & Instagram app + Conversions API)
 */

import { useCallback } from 'react';

// Meta Pixel Event Types
export interface MetaPixelProduct {
  content_id: string;
  content_name: string;
  content_type: 'product';
  content_category?: string;
  value: number;
  currency: string;
  quantity?: number;
}

export interface ViewContentParams {
  content_type: 'product';
  content_ids: string[];
  content_name: string;
  content_category?: string;
  value: number;
  currency: string;
}

export interface AddToCartParams {
  content_type: 'product';
  content_ids: string[];
  content_name: string;
  content_category?: string;
  value: number;
  currency: string;
  quantity: number;
}

export interface InitiateCheckoutParams {
  content_type: 'product';
  content_ids: string[];
  contents: MetaPixelProduct[];
  value: number;
  currency: string;
  num_items: number;
}

// Event deduplication tracking
const trackedEvents = new Set<string>();

/**
 * Check if Meta Pixel is loaded and user has marketing consent
 */
function canTrack(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if fbq is available
  if (typeof window.fbq !== 'function') {
    console.warn('Meta Pixel not loaded yet, event tracking skipped');
    return false;
  }

  // Note: Cookie consent check should be done in the calling component
  // since we don't have direct access to the context here
  return true;
}

/**
 * Generate unique key for event deduplication
 */
function generateEventKey(eventName: string, params?: any): string {
  // For PageView, ignore variant parameters to prevent duplicate tracking
  if (eventName === 'PageView') {
    return `${eventName}_${window.location.pathname}`;
  }
  
  if (eventName === 'ViewContent' && params?.content_ids) {
    // ViewContent should be unique per product, not per variant
    return `ViewContent_${window.location.pathname}_${params.content_ids[0]}`;
  }
  
  if (eventName === 'AddToCart' && params?.content_ids) {
    return `${eventName}_${params.content_ids[0]}_${Date.now()}`;
  }
  
  if (eventName === 'InitiateCheckout') {
    return `${eventName}_${Date.now()}`;
  }
  
  return `${eventName}_${window.location.pathname}`;
}

/**
 * Check if event was already tracked to prevent duplicates
 */
function wasEventTracked(eventKey: string): boolean {
  return trackedEvents.has(eventKey);
}

/**
 * Mark event as tracked
 */
function markEventTracked(eventKey: string): void {
  trackedEvents.add(eventKey);
  
  // Clean up old events after 5 minutes to prevent memory leaks
  setTimeout(() => {
    trackedEvents.delete(eventKey);
  }, 5 * 60 * 1000);
}

/**
 * Track PageView event
 * Automatically called by MetaPixel component on page load
 * Only tracks once per pathname (ignores query parameters like ?variant=...)
 */
export function trackPageView(): void {
  if (!canTrack()) return;
  
  // Use pathname only (ignore query parameters) for deduplication
  const pathname = window.location.pathname;
  const eventKey = `PageView_${pathname}`;
  
  // Check if we already tracked PageView for this pathname
  if ((window as any)[eventKey]) {
    console.log(`Meta Pixel: PageView already tracked for ${pathname}, skipping`);
    return;
  }
  
  window.fbq('track', 'PageView');
  
  // Mark this pathname as tracked (persists during session)
  (window as any)[eventKey] = true;
  console.log(`Meta Pixel: PageView tracked for ${pathname}`);
}

/**
 * Track ViewContent event
 * Use on Product Detail Pages (PDP)
 * 
 * @param params - Product viewing parameters
 */
export function trackViewContent(params: ViewContentParams): void {
  if (!canTrack()) return;

  const eventKey = generateEventKey('ViewContent', params);
  
  if (wasEventTracked(eventKey)) {
    console.log('Meta Pixel: ViewContent already tracked for this product, skipping');
    return;
  }

  window.fbq('track', 'ViewContent', {
    content_type: params.content_type,
    content_ids: params.content_ids,
    content_name: params.content_name,
    content_category: params.content_category,
    value: params.value,
    currency: params.currency,
  });

  markEventTracked(eventKey);
  console.log('Meta Pixel: ViewContent tracked', params);
}

/**
 * Track AddToCart event
 * Use when user adds product to cart
 * 
 * @param params - Add to cart parameters
 */
export function trackAddToCart(params: AddToCartParams): void {
  if (!canTrack()) return;

  // AddToCart can happen multiple times (different products or quantities)
  // so we use timestamp for uniqueness
  const eventKey = generateEventKey('AddToCart', params);

  window.fbq('track', 'AddToCart', {
    content_type: params.content_type,
    content_ids: params.content_ids,
    content_name: params.content_name,
    content_category: params.content_category,
    value: params.value,
    currency: params.currency,
    quantity: params.quantity,
  });

  markEventTracked(eventKey);
  console.log('Meta Pixel: AddToCart tracked', params);
}

/**
 * Track InitiateCheckout event
 * Use when user clicks checkout button (before Shopify redirect)
 * 
 * @param params - Checkout initiation parameters
 */
export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  if (!canTrack()) return;

  // InitiateCheckout can happen multiple times, use timestamp for uniqueness
  const eventKey = generateEventKey('InitiateCheckout', params);

  window.fbq('track', 'InitiateCheckout', {
    content_type: params.content_type,
    content_ids: params.content_ids,
    contents: params.contents,
    value: params.value,
    currency: params.currency,
    num_items: params.num_items,
  });

  markEventTracked(eventKey);
  console.log('Meta Pixel: InitiateCheckout tracked', params);
}

/**
 * React Hook for Meta Pixel tracking with consent check
 * Use this in your components for automatic consent checking
 */
export function useMetaPixelTracking(hasMarketingConsent: boolean) {
  const trackViewContentWithConsent = useCallback((params: ViewContentParams) => {
    if (hasMarketingConsent) {
      trackViewContent(params);
    }
  }, [hasMarketingConsent]);

  const trackAddToCartWithConsent = useCallback((params: AddToCartParams) => {
    if (hasMarketingConsent) {
      trackAddToCart(params);
    }
  }, [hasMarketingConsent]);

  const trackInitiateCheckoutWithConsent = useCallback((params: InitiateCheckoutParams) => {
    if (hasMarketingConsent) {
      trackInitiateCheckout(params);
    }
  }, [hasMarketingConsent]);

  return {
    trackViewContent: trackViewContentWithConsent,
    trackAddToCart: trackAddToCartWithConsent,
    trackInitiateCheckout: trackInitiateCheckoutWithConsent,
    hasConsent: hasMarketingConsent,
  };
}

/**
 * Utility function to convert Shopify product to Meta Pixel format
 */
export function shopifyProductToMetaPixel(product: any, quantity: number = 1): MetaPixelProduct {
  return {
    content_id: product.id?.toString() || product.handle,
    content_name: product.title,
    content_type: 'product',
    content_category: product.productType || product.product_type,
    value: parseFloat(product.priceRange?.minVariantPrice?.amount || product.price || '0'),
    currency: product.priceRange?.minVariantPrice?.currencyCode || 'EUR',
    quantity,
  };
}

/**
 * Utility function to convert cart items to Meta Pixel format
 */
export function cartItemsToMetaPixel(cartItems: any[]): {
  content_ids: string[];
  contents: MetaPixelProduct[];
  value: number;
  num_items: number;
} {
  const contents = cartItems.map(item => ({
    content_id: item.merchandise?.product?.id?.toString() || item.id?.toString(),
    content_name: item.merchandise?.product?.title || item.title,
    content_type: 'product' as const,
    content_category: item.merchandise?.product?.productType,
    value: parseFloat(item.merchandise?.price?.amount || item.price || '0'),
    currency: item.merchandise?.price?.currencyCode || 'EUR',
    quantity: item.quantity || 1,
  }));

  const content_ids = contents.map(item => item.content_id);
  const value = contents.reduce((sum, item) => sum + (item.value * item.quantity), 0);
  const num_items = contents.reduce((sum, item) => sum + item.quantity, 0);

  return {
    content_ids,
    contents,
    value,
    num_items,
  };
}
