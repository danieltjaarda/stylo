'use client';

import { useGTMDataLayer } from '@/components/GoogleTagManager';
import { useStatisticsConsent } from '@/contexts/CookieConsentContext';

/**
 * GA4 E-commerce Events Example Component
 * 
 * Dit component demonstreert hoe je Google Analytics 4 e-commerce events
 * correct implementeert in Next.js met Google Tag Manager.
 * 
 * Events die worden geïmplementeerd:
 * 1. view_item - Wanneer iemand een productpagina opent
 * 2. add_to_cart - Wanneer iemand een product toevoegt aan winkelwagen
 * 3. begin_checkout - Wanneer iemand naar checkout gaat
 */
export default function GA4EcommerceExample() {
  const { pushViewItem, pushAddToCart, pushBeginCheckout, hasConsent } = useGTMDataLayer();
  const hasStatisticsConsent = useStatisticsConsent();

  // Voorbeeld product data
  const exampleProduct = {
    id: 'gid://shopify/Product/123456789',
    name: 'DeskOne Bureau',
    category: 'Zit-Sta Bureaus',
    price: 249.00,
    currency: 'EUR',
    quantity: 1
  };

  const exampleCartItems = [
    {
      item_id: 'gid://shopify/Product/123456789',
      item_name: 'DeskOne Bureau',
      item_category: 'Zit-Sta Bureaus',
      price: 249.00,
      quantity: 1
    },
    {
      item_id: 'gid://shopify/Product/987654321',
      item_name: 'SeatPro Stoel',
      item_category: 'Bureaustoelen',
      price: 199.00,
      quantity: 1
    }
  ];

  const totalValue = exampleCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 1. VIEW_ITEM Event
  const handleViewItem = () => {
    const items = [{
      item_id: exampleProduct.id,
      item_name: exampleProduct.name,
      item_category: exampleProduct.category,
      price: exampleProduct.price,
      quantity: 1
    }];

    pushViewItem(
      exampleProduct.currency,
      exampleProduct.price,
      items
    );
  };

  // 2. ADD_TO_CART Event
  const handleAddToCart = () => {
    const items = [{
      item_id: exampleProduct.id,
      item_name: exampleProduct.name,
      item_category: exampleProduct.category,
      price: exampleProduct.price,
      quantity: exampleProduct.quantity
    }];

    pushAddToCart(
      exampleProduct.currency,
      exampleProduct.price,
      items
    );
  };

  // 3. BEGIN_CHECKOUT Event
  const handleBeginCheckout = () => {
    pushBeginCheckout(
      'EUR',
      totalValue,
      exampleCartItems
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">GA4 E-commerce Events Demo</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-sm text-blue-800">
          <strong>Status:</strong> {hasConsent ? '✅ Tracking actief' : '❌ Geen consent'}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Statistics Consent:</strong> {hasStatisticsConsent ? '✅ Toegestaan' : '❌ Geweigerd'}
        </p>
      </div>

      <div className="space-y-4">
        {/* View Item Event */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">1. view_item Event</h3>
          <p className="text-sm text-gray-600 mb-3">
            Wordt automatisch getriggerd wanneer iemand een productpagina opent.
          </p>
          <button
            onClick={handleViewItem}
            disabled={!hasConsent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Simuleer view_item
          </button>
        </div>

        {/* Add to Cart Event */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">2. add_to_cart Event</h3>
          <p className="text-sm text-gray-600 mb-3">
            Wordt getriggerd wanneer iemand op "Toevoegen aan winkelwagen" klikt.
          </p>
          <button
            onClick={handleAddToCart}
            disabled={!hasConsent}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Simuleer add_to_cart
          </button>
        </div>

        {/* Begin Checkout Event */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">3. begin_checkout Event</h3>
          <p className="text-sm text-gray-600 mb-3">
            Wordt getriggerd wanneer iemand naar de checkout gaat.
          </p>
          <button
            onClick={handleBeginCheckout}
            disabled={!hasConsent}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Simuleer begin_checkout
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">📋 Event Data Structure</h4>
        <pre className="text-xs text-yellow-700 overflow-x-auto">
{`// view_item & add_to_cart events
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

// begin_checkout event
{
  event: "begin_checkout",
  currency: "EUR",
  value: 448.00,
  items: [
    { item_id: "...", item_name: "...", ... },
    { item_id: "...", item_name: "...", ... }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}

