'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCollection from '@/components/ProductCollection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import WidgetsSection from '@/components/WidgetsSection';
import FAQ from '@/components/FAQ';
import { Product } from '@/types';

export default function CollectionPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionTitle, setCollectionTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      if (!handle) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🔍 Loading collection: ${handle}`);
        const collectionProducts = await getShopifyCollection(handle);
        
        if (collectionProducts.length > 0) {
          console.log('✅ Collection products loaded:', collectionProducts);
          setProducts(collectionProducts);
          
          // Set collection title based on handle
          const titleMap: Record<string, string> = {
            'shop-alles': 'Alle Producten',
            'bureau-stoelen': 'Bureau Stoelen',
            'featured': 'Uitgelichte Producten',
            'frontpage': 'Homepage Collectie'
          };
          setCollectionTitle(titleMap[handle] || handle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));
        } else {
          console.log('⚠️ No collection products found');
          setProducts([]);
          setCollectionTitle('Alle Producten');
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        setError('Failed to load collection products');
        setProducts([]);
        setCollectionTitle('Alle Producten');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Collectie laden...</p>
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

  // Get collection display name
  const getCollectionDisplayName = (handle: string) => {
    switch (handle) {
      case 'shop-alles':
        return 'Shop Alles';
      case 'bureau-stoelen':
        return 'Bureaustoelen';
      case 'zit-sta-bureaus':
        return 'Zit-Sta Bureaus';
      default:
        return handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Producten
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-medium">
                  {getCollectionDisplayName(handle)}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {collectionTitle}
            </h1>
            <p className="text-xl text-gray-600">
              Ontdek onze {collectionTitle.toLowerCase()} collectie
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