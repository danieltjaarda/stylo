'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCollection from '@/components/ProductCollection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { Product } from '@/types';

export default function VerstelbareBureausPage() {
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
        setError('Failed to load verstelbare bureaus products');
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
            <p className="mt-4 text-gray-600">Verstelbare bureaus laden...</p>
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
                  Verstelbare Bureaus
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
              Elektrische zit-sta bureaus voor kantoor & thuis
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Op zoek naar een verstelbaar bureau dat je werkdag revolutioneert? Bij Deskna vind je hoogwaardige zit-sta bureaus die elektrisch verstelbaar zijn en perfect passen bij elke werkplek. Ideaal voor een gezonde werkhouding, met snelle levering en topkwaliteit garantie.
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
              Waarom kiezen voor onze zit-sta bureaus?
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
              <p className="text-lg text-gray-700">Elektrisch verstelbaar van 65-130cm</p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">Dubbele motoren voor stabiliteit</p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">Geheugenfunctie voor favoriete hoogtes</p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg text-gray-700">Binnen 1–3 werkdagen geleverd</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keuzehulp Section */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Waar let je op bij de keuze van een zit-sta bureau?</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Een goed zit-sta bureau moet meer bieden dan alleen hoogteverstelling. Let bij je keuze op stabiliteit, geluidsniveau, verstelsnelheid en de maximale belasting. Ook de afmetingen van het tafelblad en de aanwezige aansluitingen zijn belangrijk voor je werkcomfort.
            </p>
            <p>
              Kijk vooral naar de kwaliteit van het motorsysteem en het frame. Hoe steviger de constructie, hoe langer je bureau meegaat. Bij Deskna selecteren we alleen zit-sta bureaus met bewezen duurzaamheid en uitstekende ergonomische eigenschappen voor een gezonde werkhouding.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Zit-sta bureaus voor een gezonde werkhouding</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Op zoek naar een bureau dat meebeweegt met je werkdag? Bij Deskna vind je elektrische zit-sta bureaus die je werkplek transformeren. Door af te wisselen tussen zitten en staan verbeter je je houding, verhoog je je energie en verminder je de kans op rugklachten.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Waarom kiezen voor een elektrisch zit-sta bureau?</h3>
                <p>
                  Een elektrisch verstelbaar bureau stimuleert beweging tijdens je werkdag. Het wisselen tussen zit- en staposities activeert je spieren, verbetert je doorbloeding en verhoogt je concentratie. Dankzij de elektrische bediening wissel je moeiteloos van positie met één druk op de knop.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">De voordelen van onze zit-sta bureaus</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Elektrisch verstelbaar van 65-130cm hoogte</li>
                  <li>Dubbele motoren voor maximale stabiliteit</li>
                  <li>Geheugenfunctie voor je favoriete hoogtes</li>
                  <li>Stille werking onder 50dB geluidsniveau</li>
                  <li>Robuust stalen frame met 10 jaar garantie</li>
                  <li>Binnen 1–3 werkdagen geleverd</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section with JSON-LD */}
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Veelgestelde Vragen</h2>
              <p className="text-gray-600">Hier vind je antwoorden op de meest gestelde vragen over onze zit-sta bureaus. Staat jouw vraag er niet bij? Neem gerust contact met ons op!</p>
            </div>
            
            <div className="space-y-4">
              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Welk zit-sta bureau is het beste voor thuiswerken?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Voor thuiswerken raden wij de DeskOne aan. Dit elektrische zit-sta bureau heeft een dubbel motorsysteem, 3 geheugenstanden en USB-poorten. Perfect voor dagelijks gebruik en biedt uitstekende stabiliteit tijdens het verstellen.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoe vaak moet ik wisselen tussen zitten en staan?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Experts raden aan om elke 30-60 minuten van houding te wisselen. Begin met 15 minuten staan per uur en bouw dit geleidelijk op. Onze bureaus hebben geheugenstanden waarmee je snel kunt wisselen tussen je favoriete hoogtes.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Wat is het verschil tussen enkele en dubbele motoren?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Dubbele motoren bieden meer kracht, stabiliteit en gelijkmatige beweging. Ze kunnen zwaarder gewicht dragen en hebben een langere levensduur. Alle onze zit-sta bureaus hebben dubbele motoren voor optimale prestaties.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoeveel gewicht kan een zit-sta bureau dragen?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Onze zit-sta bureaus kunnen tot 80kg belasting aan, inclusief het tafelblad. Dit is ruim voldoende voor meerdere monitoren, laptop, documenten en andere kantoorbenodigdheden. Het stevige stalen frame garandeert stabiliteit.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoe stil zijn elektrische zit-sta bureaus?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Onze bureaus werken onder 50dB, vergelijkbaar met een zachte conversatie. Door hoogwaardige motoren en precisie-engineering zijn ze geschikt voor open kantoren en thuiswerken zonder collega's of huisgenoten te storen.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Kan ik mijn zit-sta bureau retourneren als het niet bevalt?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Ja, je hebt 30 dagen bedenktijd. Als het bureau niet aan je verwachtingen voldoet, kun je het gratis retourneren. We organiseren de ophaal service en zorgen voor een snelle terugbetaling.
                  </p>
                </div>
              </details>
            </div>

            {/* JSON-LD Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Welk zit-sta bureau is het beste voor thuiswerken?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Voor thuiswerken raden wij de DeskOne aan. Dit elektrische zit-sta bureau heeft een dubbel motorsysteem, 3 geheugenstanden en USB-poorten. Perfect voor dagelijks gebruik en biedt uitstekende stabiliteit tijdens het verstellen."
                      }
                    },
                    {
                      "@type": "Question", 
                      "name": "Hoe vaak moet ik wisselen tussen zitten en staan?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Experts raden aan om elke 30-60 minuten van houding te wisselen. Begin met 15 minuten staan per uur en bouw dit geleidelijk op. Onze bureaus hebben geheugenstanden waarmee je snel kunt wisselen tussen je favoriete hoogtes."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Wat is het verschil tussen enkele en dubbele motoren?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Dubbele motoren bieden meer kracht, stabiliteit en gelijkmatige beweging. Ze kunnen zwaarder gewicht dragen en hebben een langere levensduur. Alle onze zit-sta bureaus hebben dubbele motoren voor optimale prestaties."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hoeveel gewicht kan een zit-sta bureau dragen?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Onze zit-sta bureaus kunnen tot 80kg belasting aan, inclusief het tafelblad. Dit is ruim voldoende voor meerdere monitoren, laptop, documenten en andere kantoorbenodigdheden. Het stevige stalen frame garandeert stabiliteit."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hoe stil zijn elektrische zit-sta bureaus?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Onze bureaus werken onder 50dB, vergelijkbaar met een zachte conversatie. Door hoogwaardige motoren en precisie-engineering zijn ze geschikt voor open kantoren en thuiswerken zonder collega's of huisgenoten te storen."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Kan ik mijn zit-sta bureau retourneren als het niet bevalt?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ja, je hebt 30 dagen bedenktijd. Als het bureau niet aan je verwachtingen voldoet, kun je het gratis retourneren. We organiseren de ophaal service en zorgen voor een snelle terugbetaling."
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />
    </div>
  );
}
