'use client';

import { useState, useEffect } from 'react';
import GA4ViewItemTracker from './GA4ViewItemTracker';

interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  category?: string;
  description?: string;
  image?: string;
}

interface ProductPageExampleProps {
  productId: string;
}

/**
 * Voorbeeld Product Pagina Component
 * 
 * Dit component demonstreert hoe je de GA4ViewItemTracker gebruikt
 * in een Next.js productpagina met App Router.
 */
export default function ProductPageExample({ productId }: ProductPageExampleProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simuleer product data ophalen
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Simuleer API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock product data
        const mockProduct: Product = {
          id: productId,
          name: 'DeskOne Bureau - Elektrisch Zit-Sta Bureau',
          price: 249.00,
          currency: 'EUR',
          category: 'Zit-Sta Bureaus',
          description: 'Ons bestverkochte elektrische zit-sta bureau biedt een eersteklas ervaring dankzij hoogwaardige materialen, design en elektronica.',
          image: '/images/deskone-bureau.jpg'
        };
        
        setProduct(mockProduct);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Product laden...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product niet gevonden</h1>
          <p className="text-gray-600 mb-8">{error || 'Het product kon niet worden geladen.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* GA4 View Item Tracker - Dit component pusht automatisch het view_item event */}
      <GA4ViewItemTracker 
        product={product}
        quantity={1}
      />
      
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Geen afbeelding beschikbaar</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {product.category}
              </p>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                {product.currency}
              </span>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Aantal:
                </label>
                <select 
                  id="quantity"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Toevoegen aan winkelwagen
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Gratis verzending
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  30 dagen retourneren
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  5 jaar garantie
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Snelle levering
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info (alleen in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm">
          <h4 className="font-semibold mb-2">GA4 View Item Tracker Debug:</h4>
          <p>Product ID: {product.id}</p>
          <p>Event: view_item</p>
          <p>Status: {typeof window !== 'undefined' && (window as any).viewItemTracked ? 'Tracked' : 'Not tracked'}</p>
          <p>DataLayer: {typeof window !== 'undefined' && window.dataLayer ? 'Available' : 'Not available'}</p>
        </div>
      )}
    </div>
  );
}

