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

export default function BureauStoelenPage() {
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
        setError('Failed to load bureaustoelen products');
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
            <p className="mt-4 text-gray-600">Bureaustoelen laden...</p>
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
                  Bureaustoelen
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
              Ergonomische bureaustoelen voor kantoor & thuis
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Op zoek naar een ergonomische bureaustoel die je lichaam optimaal ondersteunt? Bij Deskna vind je comfortabele, verstelbare bureaustoelen die perfect passen bij een moderne werkplek. Ideaal voor thuiswerken én kantoor, met snelle levering en topkwaliteit garantie.
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
                Bekijk de hele collectie
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
                          {discountPercentage}% korting
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
                        <span className="text-sm text-gray-500 ml-1">(127 beoordelingen)</span>
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
                        <span className="text-xs text-gray-500">+10</span>
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
              Waarom kiezen voor onze ergonomische bureaustoelen?
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
                  title="Gemiddelde montagetijd"
                />
              </div>
            </div>

            {/* Widget 2: Video - Op 1 lijn met je lichaam */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/Op 1 lijn met je lichaam.mp4"
                  title="Op 1 lijn met je lichaam"
                  description="Perfecte ergonomische ondersteuning voor een gezonde werkhouding."
                  className="w-full"
                />
              </div>
            </div>

            {/* Widget 3: Video - Vermindert druk op benen */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/vermindert druk op benen.mp4"
                  title="Vermindert druk op benen"
                  description="Ontlast je benen en verbeter je doorbloeding tijdens het werken."
                  className="w-full"
                />
              </div>
            </div>

            {/* Widget 4: Video - Pressure Bureau */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm min-h-[400px] flex items-center">
                <VideoWidget
                  videoSrc="/svg icons/pressure bureau.m4v"
                  title="Drukvermindering"
                  description="Vermindert druk op je lichaam voor optimaal zitcomfort."
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Waar let je op bij de keuze?</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Een goede bureaustoel moet meer kunnen dan alleen comfortabel zitten. Let bij je keuze op verstelbaarheid (hoogte, rug, armleuningen), ergonomische vormgeving en de juiste ondersteuning tijdens lange werkdagen.
            </p>
            <p>
              Kijk bij het kiezen van een bureaustoel vooral naar verstelbaarheid en ondersteuning. Hoe beter je de stoel kunt aanpassen aan je lichaam, hoe langer je zonder klachten kunt werken. Bij Deskna selecteren we bureaustoelen die voldoen aan de hoogste ergonomische standaarden, zodat jij verzekerd bent van kwaliteit en comfort.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ergonomische bureaustoelen voor kantoor & thuis</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Op zoek naar een bureaustoel die écht comfort biedt tijdens lange werkdagen? Bij Deskna vind je ergonomische bureaustoelen die volledig verstelbaar zijn en je lichaam optimaal ondersteunen. Of je nu vanuit huis werkt of een kantoor wilt inrichten: een goede bureaustoel is onmisbaar voor een gezonde werkhouding.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Waarom kiezen voor een ergonomische bureaustoel?</h3>
                <p>
                  Een ergonomische bureaustoel is ontworpen om klachten aan rug, nek en schouders te voorkomen. Dankzij de verstelbare zithoogte, rugleuning en armleuningen pas je de stoel eenvoudig aan jouw lichaam aan. Zo werk je niet alleen comfortabeler, maar ook productiever en met minder kans op lichamelijke klachten.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">De voordelen van onze bureaustoelen</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Verstelbare zithoogte en rugleuning</li>
                  <li>Ergonomisch design dat de juiste zithouding ondersteunt</li>
                  <li>Gemaakt van duurzame materialen en modern afgewerkt</li>
                  <li>Binnen 1–3 werkdagen geleverd</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section with JSON-LD */}
          <div className="mt-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Veelgestelde Vragen</h2>
              <p className="text-gray-600">Hier vind je antwoorden op de meest gestelde vragen over onze producten en services. Staat jouw vraag er niet bij? Neem gerust contact met ons op!</p>
            </div>
            
            <div className="space-y-4">
              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Welke ergonomische bureaustoel is het beste voor thuiswerken?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Voor thuiswerken raden wij de SeatPro aan. Deze ergonomische bureaustoel heeft verstelbare hoofd- en rugsteun, 4D-armleuningen en een uitschuifbare voetensteun. Perfect voor lange werkdagen en biedt optimale ondersteuning voor rug en nek.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoe stel ik mijn bureaustoel ergonomisch correct in?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Stel eerst de zithoogte in zodat je voeten plat op de grond staan. Pas de rugsteun aan voor ondersteuning van je onderrug. Zet armleuningen op ellebooghoogte en zorg dat je scherm op ooghoogte staat. Onze bureaustoelen hebben alle nodige verstelmogelijkheden.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Wat is het verschil tussen mesh en gestoffeerde bureaustoelen?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Mesh bureaustoelen zoals onze SeatPro bieden betere ventilatie en blijven koeler tijdens lange werkdagen. Gestoffeerde stoelen geven meer zachtheid en warmte. Beide types in ons assortiment bieden uitstekende ergonomische ondersteuning.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoeveel moet ik uitgeven aan een goede bureaustoel?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Een goede ergonomische bureaustoel is een investering in je gezondheid. Onze bureaustoelen beginnen bij €199 en bieden uitstekende kwaliteit. Voor dagelijks gebruik van 6+ uur raden we aan minimaal €200-400 te investeren voor optimale ondersteuning.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Hoe lang gaat een ergonomische bureaustoel mee?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Onze bureaustoelen zijn gemaakt van duurzame materialen en gaan bij normaal gebruik 5-10 jaar mee. We geven uitgebreide garantie op alle onderdelen. De hoogwaardige constructie zorgt voor langdurige ondersteuning en comfort.
                  </p>
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  Kan ik mijn bureaustoel retourneren als deze niet bevalt?
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700">
                    Ja, je hebt 30 dagen bedenktijd. Als de bureaustoel niet aan je verwachtingen voldoet, kun je deze gratis retourneren. We zorgen voor een snelle terugbetaling zodat je zorgeloos kunt bestellen.
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
                      "name": "Welke ergonomische bureaustoel is het beste voor thuiswerken?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Voor thuiswerken raden wij de SeatPro aan. Deze ergonomische bureaustoel heeft verstelbare hoofd- en rugsteun, 4D-armleuningen en een uitschuifbare voetensteun. Perfect voor lange werkdagen en biedt optimale ondersteuning voor rug en nek."
                      }
                    },
                    {
                      "@type": "Question", 
                      "name": "Hoe stel ik mijn bureaustoel ergonomisch correct in?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Stel eerst de zithoogte in zodat je voeten plat op de grond staan. Pas de rugsteun aan voor ondersteuning van je onderrug. Zet armleuningen op ellebooghoogte en zorg dat je scherm op ooghoogte staat. Onze bureaustoelen hebben alle nodige verstelmogelijkheden."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Wat is het verschil tussen mesh en gestoffeerde bureaustoelen?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Mesh bureaustoelen zoals onze SeatPro bieden betere ventilatie en blijven koeler tijdens lange werkdagen. Gestoffeerde stoelen geven meer zachtheid en warmte. Beide types in ons assortiment bieden uitstekende ergonomische ondersteuning."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hoeveel moet ik uitgeven aan een goede bureaustoel?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Een goede ergonomische bureaustoel is een investering in je gezondheid. Onze bureaustoelen beginnen bij €199 en bieden uitstekende kwaliteit. Voor dagelijks gebruik van 6+ uur raden we aan minimaal €200-400 te investeren voor optimale ondersteuning."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Hoe lang gaat een ergonomische bureaustoel mee?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Onze bureaustoelen zijn gemaakt van duurzame materialen en gaan bij normaal gebruik 5-10 jaar mee. We geven uitgebreide garantie op alle onderdelen. De hoogwaardige constructie zorgt voor langdurige ondersteuning en comfort."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Kan ik mijn bureaustoel retourneren als deze niet bevalt?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ja, je hebt 30 dagen bedenktijd. Als de bureaustoel niet aan je verwachtingen voldoet, kun je deze gratis retourneren. We zorgen voor een snelle terugbetaling zodat je zorgeloos kunt bestellen."
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