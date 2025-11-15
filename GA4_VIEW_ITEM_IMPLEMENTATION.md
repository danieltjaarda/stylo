# GA4 View Item Event Tracker - Complete Implementatie

Deze documentatie beschrijft hoe je een GA4 `view_item` event correct implementeert in Next.js met alle guards tegen dubbele events.

## 🎯 **Component: GA4ViewItemTracker**

### **Features:**
- ✅ Eén event per pageload (leeg dependency array)
- ✅ Window flag guard tegen dubbele events
- ✅ Next.js compatibel (typeof window check)
- ✅ React Strict Mode safe
- ✅ Correcte GA4 e-commerce data structuur

### **Gebruik:**

```tsx
import GA4ViewItemTracker from '@/components/GA4ViewItemTracker';

function ProductPage({ product }) {
  return (
    <div>
      {/* GA4 View Item Tracker - Automatisch één event per pageload */}
      <GA4ViewItemTracker 
        product={{
          id: "gid://shopify/Product/123456789",
          name: "DeskOne Bureau",
          price: 249.00,
          currency: "EUR",
          category: "Zit-Sta Bureaus"
        }}
        quantity={1}
      />
      
      {/* Rest van je productpagina */}
      <h1>{product.name}</h1>
      {/* ... */}
    </div>
  );
}
```

## 🔧 **Technische Details**

### **Guards tegen dubbele events:**

1. **Client-side check**: `typeof window === 'undefined'`
2. **DataLayer check**: `!window.dataLayer`
3. **Globale flag**: `window.viewItemTracked`
4. **Product-specifieke flag**: `window.viewItem_${productId}`
5. **Lege dependency array**: `useEffect(() => {}, [])`

### **Data structuur:**

```javascript
{
  event: "view_item",
  ecommerce: {
    items: [{
      item_id: "gid://shopify/Product/123456789",
      item_name: "DeskOne Bureau",
      price: 249.00,
      currency: "EUR",
      quantity: 1,
      item_category: "Zit-Sta Bureaus"
    }]
  }
}
```

## 📋 **Complete Code**

### **GA4ViewItemTracker.tsx**

```tsx
'use client';

import { useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  category?: string;
}

interface GA4ViewItemTrackerProps {
  product: Product;
  quantity?: number;
}

export default function GA4ViewItemTracker({ 
  product, 
  quantity = 1 
}: GA4ViewItemTrackerProps) {
  
  useEffect(() => {
    // Guard: alleen client-side uitvoeren
    if (typeof window === 'undefined') {
      return;
    }

    // Guard: controleer of dataLayer bestaat
    if (!window.dataLayer) {
      console.warn('GA4ViewItemTracker: dataLayer not found');
      return;
    }

    // Guard: controleer of dit event al is getrackt voor deze pagina
    const trackingKey = `viewItem_${product.id}`;
    if ((window as any)[trackingKey]) {
      console.log('GA4ViewItemTracker: Event already tracked for this product');
      return;
    }

    // Guard: controleer of er al een view_item event is getrackt (globale guard)
    if ((window as any).viewItemTracked) {
      console.log('GA4ViewItemTracker: A view_item event has already been tracked on this page');
      return;
    }

    // Bereid GA4 e-commerce data voor
    const ecommerceData = {
      event: 'view_item',
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          currency: product.currency || 'EUR',
          quantity: quantity,
          item_category: product.category || 'Product'
        }]
      }
    };

    // Push naar dataLayer
    window.dataLayer.push(ecommerceData);

    // Markeer als getrackt (globale flag)
    (window as any).viewItemTracked = true;
    
    // Markeer als getrackt voor dit specifieke product
    (window as any)[trackingKey] = true;

    console.log('GA4ViewItemTracker: view_item event pushed to dataLayer', ecommerceData);

  }, []); // Leeg dependency array = één keer per component mount

  // Dit component rendert niets
  return null;
}

// TypeScript declaration voor window object
declare global {
  interface Window {
    dataLayer: any[];
    viewItemTracked?: boolean;
    [key: string]: any;
  }
}
```

## 🧪 **Testing**

### **Console logs om te controleren:**

```javascript
// Check of event is getrackt
console.log('View item tracked:', window.viewItemTracked);

// Check dataLayer
console.log('DataLayer events:', window.dataLayer.filter(e => e.event === 'view_item'));

// Check product-specifieke flag
console.log('Product tracked:', window['viewItem_gid://shopify/Product/123456789']);
```

### **Expected behavior:**

1. **Eerste pageload**: Event wordt gepusht, flags worden gezet
2. **Herlaad pagina**: Event wordt opnieuw gepusht (flags worden gereset)
3. **React Strict Mode**: Geen dubbele events door guards
4. **Navigatie binnen app**: Geen dubbele events door globale flag

## 🚀 **Implementatie in bestaande productpagina**

### **Stap 1: Import de component**

```tsx
import GA4ViewItemTracker from '@/components/GA4ViewItemTracker';
```

### **Stap 2: Voeg toe aan je productpagina**

```tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);

  // ... je bestaande product loading logic

  return (
    <div>
      {/* GA4 View Item Tracker */}
      {product && (
        <GA4ViewItemTracker 
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            category: product.category
          }}
          quantity={1}
        />
      )}
      
      {/* Rest van je productpagina */}
      {/* ... */}
    </div>
  );
}
```

## 🔍 **Debugging**

### **Development mode debug info:**

```tsx
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs">
    <h4 className="font-semibold mb-2">GA4 View Item Tracker Debug:</h4>
    <p>Product ID: {product.id}</p>
    <p>Event: view_item</p>
    <p>Status: {typeof window !== 'undefined' && window.viewItemTracked ? 'Tracked' : 'Not tracked'}</p>
    <p>DataLayer: {typeof window !== 'undefined' && window.dataLayer ? 'Available' : 'Not available'}</p>
  </div>
)}
```

## ✅ **Voordelen van deze implementatie:**

1. **Geen dubbele events** - Meerdere guards voorkomen dit
2. **React Strict Mode safe** - Werkt correct in development
3. **Next.js compatibel** - Client-side only execution
4. **Performance optimized** - Eén event per pageload
5. **TypeScript support** - Volledig getypeerd
6. **Debug friendly** - Console logs voor troubleshooting
7. **Flexibel** - Eenvoudig aan te passen voor verschillende producten

Deze implementatie zorgt ervoor dat je GA4 `view_item` events correct en betrouwbaar worden getrackt zonder dubbele events, ook in React Strict Mode en Next.js App Router.

