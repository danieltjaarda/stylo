'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCollection from '@/components/ProductCollection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { Product } from '@/types';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface VerstelbareBureausPageProps {
  translations: Translations;
  locale: Locale;
}

export default function VerstelbareBureausClient({ translations, locale }: VerstelbareBureausPageProps) {
  const { t } = useTranslation(translations);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading verstelbare bureaus collection');
        const collectionProducts = await getShopifyCollection('zit-sta-bureaus');
        
        if (collectionProducts.length > 0) {
          console.log('✅ Verstelbare bureaus products loaded:', collectionProducts);
          setProducts(collectionProducts);
        } else {
          console.log('⚠️ No verstelbare bureaus products found');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading verstelbare bureaus:', error);
        setError(t('verstelbarebreaus.error'));
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
            <p className="mt-4 text-gray-600">{t('verstelbarebreaus.loading')}</p>
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
              {t('verstelbarebreaus.retry')}
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
                  {t('verstelbarebreaus.breadcrumb.home')}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {t('verstelbarebreaus.breadcrumb.products')}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-semibold">
                  {t('verstelbarebreaus.breadcrumb.desks')}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('verstelbarebreaus.header.title')}
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('verstelbarebreaus.header.description')}
            </p>
          </div>

          {/* Product Collection with Videos */}
          <ProductCollection 
            products={products}
            title=""
            showTitle={false}
          />
        </div>
      </div>

      {/* Voordelen Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('verstelbarebreaus.benefits.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">{t('verstelbarebreaus.benefits.items.0')}</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">{t('verstelbarebreaus.benefits.items.1')}</p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">{t('verstelbarebreaus.benefits.items.2')}</p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">{t('verstelbarebreaus.benefits.items.3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keuzehulp Section */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('verstelbarebreaus.guide.title')}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              {t('verstelbarebreaus.guide.content1')}
            </p>
            <p>
              {t('verstelbarebreaus.guide.content2')}
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('verstelbarebreaus.seo.title')}</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                {t('verstelbarebreaus.seo.content1')}
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('verstelbarebreaus.seo.subtitle1')}</h3>
                <p>
                  {t('verstelbarebreaus.seo.content2')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('verstelbarebreaus.seo.subtitle2')}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {(translations.verstelbarebreaus?.seo?.benefits || []).map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section with JSON-LD */}
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('verstelbarebreaus.faq.title')}</h2>
              <p className="text-gray-600">{t('verstelbarebreaus.faq.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              {(translations.verstelbarebreaus?.faq?.questions || []).map((faq: any, index: number) => (
                <details key={index} className="bg-white border border-gray-200 rounded-lg">
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* JSON-LD Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": (translations.verstelbarebreaus?.faq?.questions || []).map((faq: any) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer
                    }
                  }))
                })
              }}
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Widget */}
      <WhatsAppWidget translations={translations} locale={locale} />
    </div>
  );
}
