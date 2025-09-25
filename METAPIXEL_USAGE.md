# Meta Pixel Hybride Setup - Usage Guide

Deze guide laat zien hoe je de Meta Pixel helpers gebruikt in je Next.js componenten voor een hybride setup met Shopify checkout.

## Setup Overview

- **Next.js handelt**: PageView, ViewContent, AddToCart, InitiateCheckout
- **Shopify handelt**: Purchase (via Facebook & Instagram app + Conversions API)

## Environment Variable

Zorg ervoor dat je Meta Pixel ID is ingesteld in je `.env.local`:

```bash
NEXT_PUBLIC_META_PIXEL_ID=593923060471624
```

## 1. Product Detail Page (PDP) - ViewContent

```tsx
// src/app/products/[handle]/page.tsx of src/components/ProductPage.tsx
'use client';

import { useEffect } from 'react';
import { useMarketingConsent } from '@/contexts/CookieConsentContext';
import { useMetaPixelTracking, shopifyProductToMetaPixel } from '@/lib/metaPixel';

export default function ProductPage({ product }: { product: any }) {
  const hasMarketingConsent = useMarketingConsent();
  const { trackViewContent } = useMetaPixelTracking(hasMarketingConsent);

  useEffect(() => {
    if (product && hasMarketingConsent) {
      // Track ViewContent when product page loads
      trackViewContent({
        content_type: 'product',
        content_ids: [product.id?.toString() || product.handle],
        content_name: product.title,
        content_category: product.productType,
        value: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
        currency: product.priceRange?.minVariantPrice?.currencyCode || 'EUR',
      });
    }
  }, [product, hasMarketingConsent, trackViewContent]);

  return (
    <div>
      <h1>{product.title}</h1>
      {/* Rest of your product page */}
    </div>
  );
}
```

## 2. Add to Cart Button - AddToCart

```tsx
// src/components/AddToCartButton.tsx
'use client';

import { useMarketingConsent } from '@/contexts/CookieConsentContext';
import { useMetaPixelTracking } from '@/lib/metaPixel';

interface AddToCartButtonProps {
  product: any;
  variant: any;
  quantity: number;
  onAddToCart: () => void;
}

export default function AddToCartButton({ 
  product, 
  variant, 
  quantity, 
  onAddToCart 
}: AddToCartButtonProps) {
  const hasMarketingConsent = useMarketingConsent();
  const { trackAddToCart } = useMetaPixelTracking(hasMarketingConsent);

  const handleAddToCart = () => {
    // First add to cart
    onAddToCart();

    // Then track the event
    if (hasMarketingConsent) {
      trackAddToCart({
        content_type: 'product',
        content_ids: [product.id?.toString() || product.handle],
        content_name: product.title,
        content_category: product.productType,
        value: parseFloat(variant.price?.amount || product.priceRange?.minVariantPrice?.amount || '0'),
        currency: variant.price?.currencyCode || 'EUR',
        quantity: quantity,
      });
    }
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
    >
      Toevoegen aan winkelwagen
    </button>
  );
}
```

## 3. Checkout Button - InitiateCheckout

```tsx
// src/components/Cart.tsx of src/components/CheckoutButton.tsx
'use client';

import { useMarketingConsent } from '@/contexts/CookieConsentContext';
import { useMetaPixelTracking, cartItemsToMetaPixel } from '@/lib/metaPixel';

interface CheckoutButtonProps {
  cartItems: any[];
  onCheckout: () => void;
}

export default function CheckoutButton({ cartItems, onCheckout }: CheckoutButtonProps) {
  const hasMarketingConsent = useMarketingConsent();
  const { trackInitiateCheckout } = useMetaPixelTracking(hasMarketingConsent);

  const handleCheckout = () => {
    // Track InitiateCheckout before redirecting to Shopify
    if (hasMarketingConsent && cartItems.length > 0) {
      const { content_ids, contents, value, num_items } = cartItemsToMetaPixel(cartItems);
      
      trackInitiateCheckout({
        content_type: 'product',
        content_ids,
        contents,
        value,
        currency: 'EUR',
        num_items,
      });
    }

    // Then proceed with checkout (redirect to Shopify)
    onCheckout();
  };

  return (
    <button 
      onClick={handleCheckout}
      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      disabled={cartItems.length === 0}
    >
      Afrekenen
    </button>
  );
}
```

## 4. Using with Cart Store (Zustand/Context)

```tsx
// src/store/useCartStore.ts (als je Zustand gebruikt)
import { create } from 'zustand';
import { trackAddToCart } from '@/lib/metaPixel';

interface CartStore {
  items: any[];
  addItem: (product: any, variant: any, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, variant, quantity) => {
    // Add to cart logic
    set((state) => ({
      items: [...state.items, { product, variant, quantity }]
    }));

    // Track Meta Pixel event
    // Note: Je moet de consent check hier ook doen
    if (typeof window !== 'undefined' && window.fbq) {
      trackAddToCart({
        content_type: 'product',
        content_ids: [product.id?.toString() || product.handle],
        content_name: product.title,
        content_category: product.productType,
        value: parseFloat(variant.price?.amount || '0'),
        currency: variant.price?.currencyCode || 'EUR',
        quantity: quantity,
      });
    }
  },
}));
```

## 5. Testing met Meta Pixel Helper

1. **Installeer Meta Pixel Helper** browser extension
2. **Open je website** en check de console
3. **Test alle events**:
   - **PageView**: Automatisch bij elke pagina
   - **ViewContent**: Ga naar een product pagina
   - **AddToCart**: Klik op "Toevoegen aan winkelwagen"
   - **InitiateCheckout**: Klik op "Afrekenen" knop

## 6. Shopify Purchase Tracking

Zorg ervoor dat in je Shopify admin:

1. **Facebook & Instagram app** is geïnstalleerd
2. **Meta Pixel ID** is ingesteld: `593923060471624`
3. **Conversions API** is geconfigureerd
4. **Purchase events** worden automatisch verstuurd bij succesvolle bestellingen

## Debug Tips

- Check browser console voor Meta Pixel logs
- Use Meta Pixel Helper extension
- Verify events in Meta Events Manager
- Test with cookie banner: events should only fire after marketing consent

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_META_PIXEL_ID=593923060471624
```

Deze setup zorgt voor optimale tracking zonder dubbele Purchase events!
