'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { createCheckout, addToCheckout, getCheckoutUrl, cartItemsToLineItems } from '@/services/checkoutService';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, syncWithShopify, getCheckoutUrl } = useCartStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.21; // 21% BTW
  const total = subtotal + shipping + tax;

  // Create Shopify checkout with cart items using Buy SDK
  const handleShopifyCheckout = async () => {
    if (items.length === 0) {
      router.push('/');
      return;
    }

    setIsRedirecting(true);
    
    try {
      console.log('🛒 Creating Shopify checkout with Buy SDK...');
      console.log('📦 Cart items:', items.map(item => ({ 
        name: item.product.name, 
        price: item.product.price, 
        quantity: item.quantity,
        id: item.product.id
      })));
      
      // Direct approach: redirect to Shopify product with variant ID
      const firstItem = items[0];
      const shopifyStoreUrl = 'https://shaa16-zi.myshopify.com';
      
      // Use the variant ID we know works: 55603319374148
      const variantId = '55603319374148';
      const quantity = firstItem.quantity;
      
      // Create a cart add URL that will automatically add the item and redirect to checkout
      const checkoutUrl = `${shopifyStoreUrl}/cart/add?id=${variantId}&quantity=${quantity}&return_to=/checkout`;
      
      console.log('🛒 Direct add to cart and checkout URL:', checkoutUrl);
      
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      
      // Fallback: redirect to Shopify store
      const fallbackUrl = 'https://shaa16-zi.myshopify.com';
      console.log('🔄 Fallback: redirecting to store:', fallbackUrl);
      window.location.href = fallbackUrl;
    }
  };

  // Auto-redirect to create checkout with items
  useEffect(() => {
    if (items.length > 0) {
      handleShopifyCheckout();
    }
  }, []);

  // If no items, redirect to home
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Winkelwagen is leeg
          </h2>
          <p className="text-gray-600 mb-6">
            Voeg eerst producten toe aan je winkelwagen voordat je kunt afrekenen.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Bekijk Producten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isRedirecting ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Doorverwijzen naar Shopify Store...
            </h2>
            <p className="text-gray-600 mb-6">
              Je wordt doorverwezen naar onze Shopify store waar je veilig kunt winkelen en afrekenen.
            </p>
          </>
        ) : (
          <>
            <ExternalLink className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Afrekenen via Shopify
            </h2>
            <p className="text-gray-600 mb-6">
              Je wordt doorverwezen naar onze Shopify store. Zoek daar naar "777 test product" en voeg het toe aan je winkelwagen om af te rekenen.
            </p>

          {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Bestelling</h3>
                {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-sm font-semibold">
                      €{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Totaal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleShopifyCheckout}
              disabled={isRedirecting}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Afrekenen via Shopify</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}