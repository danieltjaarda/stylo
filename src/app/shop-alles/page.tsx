'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCollection from '@/components/ProductCollection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import WidgetsSection from '@/components/WidgetsSection';
import FAQ from '@/components/FAQ';
import { Product } from '@/types';

export default function ShopAllesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading shop-alles collection');
        const collectionProducts = await getShopifyCollection('shop-alles');
        
        if (collectionProducts.length > 0) {
          console.log('✅ Shop-alles products loaded:', collectionProducts);
          setProducts(collectionProducts);
        } else {
          console.log('⚠️ No shop-alles products found');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading shop-alles:', error);
        setError('Failed to load shop-alles products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Alle producten laden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  Producten
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-semibold">
                  Alle Producten
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Alle Producten
            </h1>
            <p className="text-xl text-gray-600">
              Ontdek ons complete assortiment ergonomische werkplekken
            </p>
          </div>

          <ProductCollection 
            products={products}
            title=""
            showTitle={false}
          />
        </div>
      </div>

      {/* Widgets Section */}
      <WidgetsSection />

      {/* WhatsApp Widget */}
      <WhatsAppWidget />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
