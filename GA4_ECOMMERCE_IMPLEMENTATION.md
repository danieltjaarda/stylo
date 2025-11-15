# Google Analytics 4 E-commerce Events Implementatie

Deze documentatie beschrijft hoe Google Analytics 4 e-commerce events zijn geïmplementeerd in de Next.js webshop met Google Tag Manager.

## 🎯 Geïmplementeerde Events

### 1. view_item Event
**Trigger:** Automatisch wanneer iemand een productpagina opent  
**Locatie:** `src/app/products/[id]/page.tsx`  
**Data:** item_id, item_name, price, currency, quantity

### 2. add_to_cart Event  
**Trigger:** Wanneer iemand op "Toevoegen aan winkelwagen" klikt  
**Locatie:** `src/app/products/[id]/page.tsx`  
**Data:** item_id, item_name, price, currency, quantity

### 3. begin_checkout Event
**Trigger:** Wanneer iemand naar Shopify checkout gaat  
**Locatie:** `src/components/Cart.tsx`  
**Data:** Alle producten in winkelwagen + totaalbedrag

## 🔧 Technische Implementatie

### GTM Hook (`src/components/GoogleTagManager.tsx`)

```typescript
export function useGTMDataLayer() {
  const hasStatisticsConsent = useStatisticsConsent();

  const pushViewItem = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_item',
        currency: currency,
        value: value,
        items: items,
      });
    }
  };

  const pushAddToCart = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'add_to_cart',
        currency: currency,
        value: value,
        items: items,
      });
    }
  };

  const pushBeginCheckout = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'begin_checkout',
        currency: currency,
        value: value,
        items: items,
      });
    }
  };

  return {
    pushViewItem,
    pushAddToCart,
    pushBeginCheckout,
    hasConsent: hasStatisticsConsent,
  };
}
```

### Product Pagina Implementatie

```typescript
// src/app/products/[id]/page.tsx
import { useGTMDataLayer } from '@/components/GoogleTagManager';

export default function ProductPage() {
  const { pushViewItem, pushAddToCart } = useGTMDataLayer();

  // view_item event - automatisch bij product laden
  useEffect(() => {
    if (product) {
      const selectedVariant = product.variants?.find(/* ... */) || product.variants?.[0];
      
      const gtmItems = [{
        item_id: product.id?.toString() || product.handle || '',
        item_name: (product as any).title || product.handle || 'Product',
        item_category: (product as any).productType || 'Product',
        price: parseFloat((selectedVariant?.price as any)?.amount || /* ... */),
        quantity: 1,
      }];

      pushViewItem(
        (selectedVariant?.price as any)?.currencyCode || 'EUR',
        parseFloat((selectedVariant?.price as any)?.amount || /* ... */),
        gtmItems
      );
    }
  }, [product, selectedOptions, pushViewItem]);

  // add_to_cart event - bij klik op "Toevoegen aan winkelwagen"
  const handleAddToCart = () => {
    // ... bestaande cart logic ...
    
    // GTM add_to_cart event
    const gtmItems = [{
      item_id: product.id?.toString() || product.handle || '',
      item_name: (product as any).title || product.handle || 'Product',
      item_category: (product as any).productType || 'Product',
      price: parseFloat((selectedVariant?.price as any)?.amount || /* ... */),
      quantity: quantity,
    }];
    
    pushAddToCart(
      (selectedVariant?.price as any)?.currencyCode || 'EUR',
      parseFloat((selectedVariant?.price as any)?.amount || /* ... */),
      gtmItems
    );
  };
}
```

### Cart Checkout Implementatie

```typescript
// src/components/Cart.tsx
import { useGTMDataLayer } from '@/components/GoogleTagManager';

export default function Cart() {
  const { pushBeginCheckout } = useGTMDataLayer();

  const handleShopifyCheckout = async () => {
    // ... bestaande checkout logic ...
    
    // GTM begin_checkout event
    const gtmItems = items.map(item => ({
      item_id: item.id?.toString() || item.handle || '',
      item_name: item.name || item.handle || 'Product',
      item_category: item.category || 'Product',
      price: parseFloat(item.price?.toString() || '0'),
      quantity: item.quantity || 1,
    }));

    pushBeginCheckout(
      'EUR',
      finalTotal,
      gtmItems
    );
    
    // ... rest van checkout logic ...
  };
}
```

## 📊 Data Structure

### view_item & add_to_cart Events
```javascript
{
  event: "view_item" | "add_to_cart",
  currency: "EUR",
  value: 249.00,
  items: [{
    item_id: "gid://shopify/Product/123456789",
    item_name: "DeskOne Bureau",
    item_category: "Zit-Sta Bureaus",
    price: 249.00,
    quantity: 1
  }]
}
```

### begin_checkout Event
```javascript
{
  event: "begin_checkout",
  currency: "EUR",
  value: 448.00,
  items: [
    {
      item_id: "gid://shopify/Product/123456789",
      item_name: "DeskOne Bureau",
      item_category: "Zit-Sta Bureaus",
      price: 249.00,
      quantity: 1
    },
    {
      item_id: "gid://shopify/Product/987654321",
      item_name: "SeatPro Stoel",
      item_category: "Bureaustoelen",
      price: 199.00,
      quantity: 1
    }
  ]
}
```

## 🔒 Privacy & Consent

- Alle events respecteren de `useStatisticsConsent()` hook
- Events worden alleen getriggerd als gebruiker toestemming heeft gegeven
- `window` checks zorgen ervoor dat code alleen client-side draait
- GDPR compliant implementatie

## 🧪 Testing

Gebruik de `GA4EcommerceExample` component om events te testen:

```typescript
import GA4EcommerceExample from '@/components/GA4EcommerceExample';

// In je component
<GA4EcommerceExample />
```

## 🚀 Deployment

Events zijn automatisch actief op:
- **Development:** `http://localhost:3000`
- **Production:** `https://deskna.nl`

## 📈 GTM Configuration

In Google Tag Manager, configureer triggers voor:
- **Event:** `view_item`
- **Event:** `add_to_cart`  
- **Event:** `begin_checkout`

Deze events zijn nu beschikbaar in de dataLayer en kunnen worden gebruikt voor:
- Google Analytics 4 Enhanced E-commerce
- Facebook Pixel tracking
- Andere marketing tools

## 🔍 Debugging

Check de browser console voor:
- `GTM View item event pushed: {...}`
- `GTM Add to cart event pushed: {...}`
- `GTM Begin checkout event pushed: {...}`

Of inspect de dataLayer:
```javascript
console.log(window.dataLayer);
```

