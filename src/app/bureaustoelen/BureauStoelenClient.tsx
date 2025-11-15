'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCollection from '@/components/ProductCollection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import AssemblyTimer from '@/components/AssemblyTimer';
import VideoWidget from '@/components/VideoWidget';
import { Product } from '@/types';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface BureauStoelenPageProps {
  translations: Translations;
  locale: Locale;
}

export default function BureauStoelenClient({ translations, locale }: BureauStoelenPageProps) {
  const { t } = useTranslation(translations);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading bureaustoelen collection');
        const collectionProducts = await getShopifyCollection('bureau-stoelen');
        
        if (collectionProducts.length > 0) {
          console.log('✅ Bureaustoelen products loaded:', collectionProducts);
          setProducts(collectionProducts);
        } else {
          console.log('⚠️ No bureaustoelen products found');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading bureaustoelen:', error);
        setError(t('bureaustoelen.error'));
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
            <p className="mt-4 text-gray-600">{t('bureaustoelen.loading')}</p>
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
              {t('bureaustoelen.retry')}
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
                  {t('bureaustoelen.breadcrumb.home')}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {t('bureaustoelen.breadcrumb.products')}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-semibold">
                  {t('bureaustoelen.breadcrumb.chairs')}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('bureaustoelen.header.title')}
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('bureaustoelen.header.description')}
            </p>
          </div>

          {/* Product Collection - Custom styling to remove extra spacing */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div></div>
              <Link 
                href="/shop-alles"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('bureaustoelen.viewCollection')}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const originalPrice = product.price * 1.2;
                const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);
                
                return (
                  <Link key={product.id} href={`/products/${product.handle}`} className="group block">
                    <div className="relative mb-4">
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {t('bureaustoelen.discount', { percentage: discountPercentage })}
                        </span>
                      </div>
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <img 
                          src="/trustpilot-stars-new.png" 
                          alt="Trustpilot sterren" 
                          className="h-5 w-auto mr-2"
                        />
                        <span className="text-sm font-semibold text-gray-900">4.5</span>
                        <span className="text-sm text-gray-500 ml-1">{t('bureaustoelen.reviews', { count: 127 })}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-1">
                        {product.description}
                      </p>

                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          € {product.price.toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          € {originalPrice.toFixed(0)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <div className="flex space-x-1">
                          <div className="w-5 h-5 rounded-full bg-amber-100 border border-gray-300"></div>
                          <div className="w-5 h-5 rounded-full bg-amber-800 border border-gray-300"></div>
                          <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
                          <div className="w-5 h-5 rounded-full bg-gray-600 border border-gray-300"></div>
                        </div>
                        <span className="text-xs text-gray-500">{t('bureaustoelen.colors', { count: 10 })}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Waarom kiezen voor onze ergonomische bureaustoelen Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('bureaustoelen.whySection.title')}
            </h2>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Widget 1: Assembly Timer */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <AssemblyTimer 
                  className="py-0 w-full" 
                  targetMinutes={11}
                  title={t('bureaustoelen.whySection.assemblyTitle')}
                />
              </div>
            </div>

            {/* Widget 2: Video - Op 1 lijn met je lichaam */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/Op 1 lijn met je lichaam.mp4"
                  title={t('bureaustoelen.whySection.video1Title')}
                  description={t('bureaustoelen.whySection.video1Description')}
                  className="w-full"
                />
              </div>
            </div>

            {/* Widget 3: Video - Vermindert druk op benen */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/vermindert druk op benen.mp4"
                  title={t('bureaustoelen.whySection.video2Title')}
                  description={t('bureaustoelen.whySection.video2Description')}
                  className="w-full"
                />
              </div>
            </div>

            {/* Widget 4: Video - Pressure Bureau */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/svg icons/pressure bureau.m4v"
                  title={t('bureaustoelen.whySection.video3Title')}
                  description={t('bureaustoelen.whySection.video3Description')}
                  className="w-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Keuzehulp Section */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('bureaustoelen.guide.title')}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              {t('bureaustoelen.guide.content1')}
            </p>
            <p>
              {t('bureaustoelen.guide.content2')}
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('bureaustoelen.seo.title')}</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                {t('bureaustoelen.seo.content1')}
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('bureaustoelen.seo.subtitle1')}</h3>
                <p>
                  {t('bureaustoelen.seo.content2')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('bureaustoelen.seo.subtitle2')}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {(translations.bureaustoelen?.seo?.benefits || []).map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section with JSON-LD */}
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('bureaustoelen.faq.title')}</h2>
              <p className="text-gray-600">{t('bureaustoelen.faq.subtitle')}</p>
            </div>
            
            <div className="space-y-4">
              {(translations.bureaustoelen?.faq?.questions || []).map((faq: any, index: number) => (
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
                  "mainEntity": (translations.bureaustoelen?.faq?.questions || []).map((faq: any) => ({
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