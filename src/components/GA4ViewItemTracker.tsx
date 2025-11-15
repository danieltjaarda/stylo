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

/**
 * GA4 View Item Event Tracker Component
 * 
 * Dit component pusht een "view_item" event naar de dataLayer zodra de productpagina wordt geopend.
 * Gebruikt een simpele window flag om dubbele events te voorkomen.
 * 
 * Features:
 * - Eén event per pageload (lege dependency array)
 * - Window flag guard tegen dubbele events
 * - Next.js compatibel (typeof window check)
 * - Correcte GA4 e-commerce data structuur
 */
export default function GA4ViewItemTracker({ 
  product, 
  quantity = 1 
}: GA4ViewItemTrackerProps) {
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Maak URL-specifieke tracking key
      const currentUrl = window.location.pathname;
      const trackingKey = `viewItemTracked_${currentUrl}`;
      
      if (!(window as any)[trackingKey]) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "view_item",
          ecommerce: {
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                price: product.price,
                currency: product.currency || "EUR",
                quantity: quantity,
              },
            ],
          },
        });
        (window as any)[trackingKey] = true; // voorkomt dubbele pushes voor deze URL
        console.log('GA4ViewItemTracker: view_item event pushed to dataLayer for', currentUrl);
      }
    }
  }, []); // lege dependency array!

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
