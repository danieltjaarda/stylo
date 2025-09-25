'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Filter, Grid, List, ArrowRight, ChevronRight, Quote, Plus, Minus } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import WidgetsSection from '@/components/WidgetsSection';
import BureauWidgetsSection from '@/components/BureauWidgetsSection';
import SeatProFAQ from '@/components/SeatProFAQ';
import { useSearchParams } from 'next/navigation';
import { getShopifyCollection } from '@/services/shopifyService';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const reviews = [
    {
      name: "Willem",
      rating: 5,
      text: "Mijn nieuwe bureausstoel heeft mijn rugpijn volledig weggenomen. Eindelijk een stoel die echt ergonomisch is!",
      days: "4 dagen geleden"
    },
    {
      name: "Miranda", 
      title: "Perfecte bureausstoel!",
      rating: 5,
      text: "Deze bureausstoel is een game-changer voor mijn thuiskantoor. Zit de hele dag comfortabel te werken!",
      days: "4 dagen geleden"
    },
    {
      name: "Paul",
      title: "Uitstekend zit-sta bureau", 
      rating: 5,
      text: "Het elektrische bureau werkt perfect. Stil, stabiel en de hoogteverstelling is supersnel. Aanrader!",
      days: "4 dagen geleden"
    },
    {
      name: "Tineke",
      title: "Ergonomische bureausstoel top!",
      rating: 5, 
      text: "Na jaren zoeken eindelijk de perfecte bureausstoel gevonden. Mijn rug voelt zoveel beter!",
      days: "6 dagen geleden"
    },
    {
      name: "Rosanne",
      title: "Zit-sta bureau aanrader",
      rating: 5,
      text: "Het bureau is stabiel en stil. De overgang van zitten naar staan gaat heel natuurlijk.",
      days: "8 dagen geleden"
    },
    {
      name: "Mark",
      title: "Bureau setup compleet",
      rating: 5,
      text: "Zowel het bureau als de stoel zijn van uitstekende kwaliteit. Mijn thuiskantoor is nu perfect!",
      days: "5 dagen geleden"
    },
    {
      name: "Lisa",
      title: "Ergonomie op zijn best",
      rating: 5,
      text: "Deze bureausstoel heeft al mijn verwachtingen overtroffen. Zit uren comfortabel te werken.",
      days: "7 dagen geleden"
    },
    {
      name: "Jan",
      title: "Zit-sta bureau topkeuze",
      rating: 5,
      text: "Het elektrische bureau werkt feilloos. Stabiel, stil en de bediening is intuïtief.",
      days: "3 dagen geleden"
    },
    {
      name: "Emma",
      title: "Elektrisch bureau geweldig",
      rating: 5,
      text: "Het zit-sta bureau heeft mijn werkdag getransformeerd. Geen rugpijn meer!",
      days: "2 dagen geleden"
    },
    {
      name: "Tom",
      title: "Bureausstoel van topkwaliteit",
      rating: 5,
      text: "Eindelijk een stoel die mijn lange werkdagen ondersteunt. Materiaal voelt premium aan.",
      days: "1 dag geleden"
    },
    {
      name: "Sophie",
      title: "Ergonomische stoel top",
      rating: 5,
      text: "Mijn productiviteit is enorm gestegen sinds ik deze bureausstoel heb. Zit zo comfortabel!",
      days: "6 uur geleden"
    },
    {
      name: "David",
      title: "Bureau en stoel combi perfect",
      rating: 5,
      text: "Hele set gekocht - bureau en stoel. Perfecte combinatie voor mijn werkplek!",
      days: "30 minuten geleden"
    }
  ];

  // Scroll effect for reviews parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on a specific category page
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Load products on initial render
  useEffect(() => {
    if (shopifyProducts.length === 0 && !isLoadingShopify && selectedCategory === 'all') {
      // Trigger initial load
      setSelectedCategory('all');
    }
  }, []);

  // Load Shopify collection when on specific categories
  useEffect(() => {
    async function loadShopifyCollection() {
      if (selectedCategory === 'ergonomische-bureaustoelen') {
        setIsLoadingShopify(true);
        try {
          console.log('🔍 Loading bureau-stoelen collection from Shopify...');
          const products = await getShopifyCollection('bureau-stoelen');
          setShopifyProducts(products);
          console.log(`✅ Loaded ${products.length} products from bureau-stoelen collection`);
        } catch (error) {
          console.error('❌ Failed to load bureau-stoelen collection:', error);
          setShopifyProducts([]);
        } finally {
          setIsLoadingShopify(false);
        }
      } else if (selectedCategory === 'zit-sta-bureaus') {
        setIsLoadingShopify(true);
        try {
          console.log('🔍 Loading zit-sta-bureaus collection from Shopify...');
          const products = await getShopifyCollection('zit-sta-bureaus');
          setShopifyProducts(products);
          console.log(`✅ Loaded ${products.length} products from zit-sta-bureaus collection`);
        } catch (error) {
          console.error('❌ Failed to load zit-sta-bureaus collection:', error);
          setShopifyProducts([]);
        } finally {
          setIsLoadingShopify(false);
        }
      } else if (selectedCategory === 'all') {
        setIsLoadingShopify(true);
        try {
          console.log('🔍 Loading all products from Shopify...');
          // Load from multiple collections
          const [bureauStoelen, zitStaBureaus] = await Promise.all([
            getShopifyCollection('bureau-stoelen'),
            getShopifyCollection('zit-sta-bureaus')
          ]);
          const allProducts = [...bureauStoelen, ...zitStaBureaus];
          setShopifyProducts(allProducts);
          console.log(`✅ Loaded ${allProducts.length} total products from all collections`);
        } catch (error) {
          console.error('❌ Failed to load all products:', error);
          setShopifyProducts([]);
        } finally {
          setIsLoadingShopify(false);
        }
      } else {
        setShopifyProducts([]);
      }
    }

    loadShopifyCollection();
  }, [selectedCategory]);

  // Get current category from URL
  const currentCategory = searchParams.get('category') || selectedCategory;

  // Get unique categories - now only from Shopify
  const categories = useMemo(() => {
    return ['all', 'ergonomische-bureaustoelen', 'zit-sta-bureaus'];
  }, []);


  // Filter and sort products - only use Shopify products
  const filteredProducts = useMemo(() => {
    let filtered = shopifyProducts;

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedCategory, sortBy, shopifyProducts]);

  // Check if we're on bureau stoelen category
  const isBureauStoelenCategory = currentCategory === 'ergonomische-bureaustoelen';
  
  // Check if we're on zit-sta-bureaus category  
  const isZitStaBureausCategory = currentCategory === 'zit-sta-bureaus';

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'ergonomische-bureaustoelen':
        return 'Ergonomische Bureaustoelen';
      case 'zit-sta-bureaus':
        return 'Zit-Sta Bureaus';
      case 'verstelbare-bureauframes':
        return 'Verstelbare Bureauframes';
      case 'accessoires':
        return 'Accessoires';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    }
  };

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
                <span className="text-gray-900 font-semibold">
                  Producten
                </span>
              </li>
              {currentCategory && currentCategory !== 'all' && (
                <>
                  <li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                  <li>
                    <span className="text-gray-900 font-medium">
                      {getCategoryDisplayName(currentCategory)}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section for Bureau Stoelen */}
      {isBureauStoelenCategory && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Grid */}
            <div className="flex overflow-x-auto gap-8 lg:grid lg:grid-cols-2 lg:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {/* SitOne Card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-shrink-0 w-[85vw] sm:w-[80vw] lg:w-auto snap-center">
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    21% korting
                  </span>
                </div>
                <div className="relative p-8 h-[500px] flex flex-col">
                  <div className="z-10">
                    <span className="text-sm font-semibold uppercase tracking-wide mb-2 block" style={{ color: '#fe8b51' }}>Nieuw</span>
                    <h2 className="text-4xl font-bold mb-4 text-white">SeatPro</h2>
                  </div>
                  <div className="flex-1 flex items-end justify-between">
                    <Link
                      href="/products/sitone-ergonomische-bureustoel"
                      className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-colors z-10"
                      style={{ backgroundColor: '#9dafaa' }}
                    >
                      Meer leren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[500px]">
                      <img
                        src="/svg icons/SeatPro schim 1.1.jpg"
                        alt="SitOne bureausstoel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SitPro Card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 flex-shrink-0 w-[85vw] sm:w-[80vw] lg:w-auto snap-center">
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    16% korting
                  </span>
                </div>
                <div className="relative p-8 h-[500px] flex flex-col">
                  <div className="z-10">
                    <span className="text-sm font-semibold uppercase tracking-wide mb-2 block" style={{ color: '#fe8b51' }}>Best getest</span>
                    <div className="flex items-center mb-4">
                      <h2 className="text-4xl font-bold text-white mr-4">Als beste uit de test</h2>
                      <img 
                        src="/svg icons/certificaat 1.svg.png" 
                        alt="Certificaat beste uit de test" 
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex items-end justify-between">
                    <Link
                      href="/products/seatpro-ergonomische-bureau-stoel"
                      className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-colors z-10"
                      style={{ backgroundColor: '#9dafaa' }}
                    >
                      Meer leren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[500px]">
                      <img
                        src="/svg icons/SeatPro 2.1.jpg"
                        alt="SitPro bureausstoel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hide scrollbar on mobile */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </section>
      )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Products Grid */}
        {isLoadingShopify ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoadingShopify && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Producten laden...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoadingShopify && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Geen producten gevonden voor de geselecteerde filters.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Probeer een andere categorie of verwijder filters.
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section - Only show for zit-sta-bureaus category */}
      {isZitStaBureausCategory && (
        <section className="py-4 overflow-hidden" style={{ backgroundColor: '#f9fafb', height: '500px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Trustpilot Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Image 
                    src="/trustpilot-stars-new.png" 
                    alt="5 sterren Trustpilot" 
                    width={100} 
                    height={15}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-600">4.8</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Wat zeggen <span style={{ color: '#4a6b5a' }}>onze klanten?</span>
                </h2>
                <p className="text-gray-600 text-sm">
                  Lees hier wat voor beoordeling andere klanten ons geven.
                </p>
              </div>

              {/* Mobile Reviews Carousel */}
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
                {reviews.slice(0, 6).map((review, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 flex-shrink-0 w-80 shadow-sm border border-gray-100">
                    <div className="mb-4">
                      <Quote className="w-8 h-8 mb-3" style={{ color: '#00B67A', fill: '#00B67A' }} />
                      <h3 className="font-semibold text-gray-900 mb-1">{review.title || 'Tevreden klant'}</h3>
                      <div className="flex items-center mb-3">
                        <Image 
                          src="/trustpilot-stars-new.png" 
                          alt="5 sterren Trustpilot" 
                          width={80} 
                          height={12}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">{review.days}</span>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                      "{review.text}"
                    </blockquote>
                    <div className="text-sm font-medium text-gray-900">
                      {review.name}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Hide scrollbar on mobile */}
              <style jsx>{`
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
                .overflow-x-auto {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left side - Title and Trustpilot info */}
              <div className="flex flex-col justify-center items-center text-center" style={{ height: '500px' }}>
                <div className="flex items-center mb-4">
                  <Image 
                    src="/trustpilot-stars-new.png" 
                    alt="5 sterren Trustpilot" 
                    width={134} 
                    height={20}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">1500+ beoordelingen op</span>
                  <Image 
                    src="/Trustpilot-logo.png" 
                    alt="Trustpilot ster" 
                    width={20} 
                    height={20}
                    className="ml-2 mr-1"
                  />
                  <span className="text-sm font-medium">Trustpilot</span>
                </div>
                <h2 className="text-4xl md:text-5xl text-gray-900 mb-4 italic">
                  Wat zeggen<br />
                  <span style={{ color: '#d6a99e' }}>onze</span><br />
                  klanten?
                </h2>
                <p className="text-lg text-gray-700">
                  Lees hier wat voor beoordeling andere klanten ons geven.
                </p>
              </div>

              {/* Right side - Reviews grid with parallax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left column */}
                <div 
                  className="space-y-2"
                  style={{ 
                    transform: `translateY(${scrollY * -0.1}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {reviews.slice(1, 5).map((review, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg">
                      <div className="mb-2">
                        <Quote className="w-6 h-6 mb-2" style={{ color: '#00b67b', fill: '#00b67b' }} />
                        {review.title && (
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h4>
                        )}
                        <div className="flex items-center mb-2">
                          <Image 
                            src="/trustpilot-stars-new.png" 
                            alt="5 sterren" 
                            width={70} 
                            height={10}
                            className="mr-2"
                          />
                          <span className="text-xs text-gray-600 font-medium">{review.days}</span>
                        </div>
                      </div>
                      <p className="text-gray-800 text-xs mb-2 leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <p className="font-bold text-gray-900 text-xs">{review.name}</p>
                    </div>
                  ))}
                </div>
                
                {/* Right column */}
                <div 
                  className="space-y-2"
                  style={{ 
                    transform: `translateY(${-400 + scrollY * 0.2}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {[reviews[11], reviews[10], reviews[8], reviews[9], reviews[5], reviews[4]].map((review, index) => (
                    <div key={index + 4} className="bg-white p-3 rounded-lg">
                      <div className="mb-2">
                        <Quote className="w-6 h-6 mb-2" style={{ color: '#00b67b', fill: '#00b67b' }} />
                        {review.title && (
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h4>
                        )}
                        <div className="flex items-center mb-2">
                          <Image 
                            src="/trustpilot-stars-new.png" 
                            alt="5 sterren" 
                            width={70} 
                            height={10}
                            className="mr-2"
                          />
                          <span className="text-xs text-gray-600 font-medium">{review.days}</span>
                        </div>
                      </div>
                      <p className="text-gray-800 text-xs mb-2 leading-relaxed">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <p className="font-bold text-gray-900 text-xs">{review.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Only show for zit-sta-bureaus category */}
      {isZitStaBureausCategory && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Veelgestelde vragen over zit-sta bureaus
              </h2>
              <p className="text-lg text-gray-600">
                Hier vind je antwoorden op de meest gestelde vragen over onze zit-sta bureaus.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Wat zijn de voordelen van een zit-sta bureau?",
                  answer: "Een zit-sta bureau helpt bij het verminderen van rugpijn, verbetert de houding, verhoogt de energieniveaus en productiviteit. Door regelmatig te wisselen tussen zitten en staan voorkom je de negatieve effecten van langdurig zitten en verbeter je je algehele gezondheid."
                },
                {
                  question: "Hoe vaak moet ik wisselen tussen zitten en staan?",
                  answer: "Experts adviseren om elke 30-60 minuten te wisselen tussen zitten en staan. Begin met korte staande periodes van 15-30 minuten en bouw dit geleidelijk op. Luister naar je lichaam en vind een ritme dat voor jou comfortabel is."
                },
                {
                  question: "Hoeveel gewicht kan een zit-sta bureau dragen?",
                  answer: "Onze zit-sta bureaus kunnen tussen de 70-120 kg dragen, afhankelijk van het model. Dit is ruim voldoende voor een complete werkplek met monitoren, laptop, documenten en andere kantoorbenodigdheden. Check altijd de specificaties van het specifieke model."
                },
                {
                  question: "Hoe stil zijn de motoren van elektrische zit-sta bureaus?",
                  answer: "Onze elektrische zit-sta bureaus produceren minder dan 50dB geluid tijdens het verstellen - dat is stiller dan een normale conversatie. De moderne motoren zijn speciaal ontworpen om geruisloos te werken, zodat je collega's niet gestoord worden."
                },
                {
                  question: "Kan ik een zit-sta bureau zelf monteren?",
                  answer: "Ja, alle zit-sta bureaus worden geleverd met duidelijke montage-instructies en het benodigde gereedschap. De montage duurt gemiddeld 1-2 uur. Als je liever professionele montage wilt, bieden we ook een montageservice aan voor €49."
                },
                {
                  question: "Wat is het hoogtebereik van jullie zit-sta bureaus?",
                  answer: "Onze zit-sta bureaus hebben een hoogtebereik van ongeveer 60-125 cm. Dit maakt ze geschikt voor personen tussen de 150-200 cm lang. De precieze afmetingen verschillen per model en staan vermeld in de productspecificaties."
                },
                {
                  question: "Hebben zit-sta bureaus geheugenstanden?",
                  answer: "Ja, onze elektrische zit-sta bureaus hebben 2-4 programmeerbare geheugenstanden. Hiermee kun je je favoriete zit- en staandhoogtes opslaan en met één druk op de knop naar de gewenste hoogte gaan."
                },
                {
                  question: "Welke garantie krijg ik op een zit-sta bureau?",
                  answer: "We geven 5 jaar garantie op het elektrische mechanisme en 2 jaar op het tafelblad. Deze garantie dekt alle productiefouten en normale slijtage. Voor eventuele reparaties of vervangingen kun je altijd contact met ons opnemen."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <div className="flex-shrink-0">
                      {openFaqIndex === index ? (
                        <Minus className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Staat je vraag er niet bij? We helpen je graag verder!
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    const message = "Hallo! Ik heb een vraag over jullie zit-sta bureaus.";
                    const phoneNumber = "+31850602482";
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.488"/>
                  </svg>
                  Chat via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Widgets Section - Only show for ergonomische-bureaustoelen category */}
      {isBureauStoelenCategory && (
        <WidgetsSection />
      )}

      {/* Bureau Widgets Section - Only show for zit-sta-bureaus category */}
      {isZitStaBureausCategory && (
        <BureauWidgetsSection />
      )}

      {/* SeatPro FAQ Section - Only show for ergonomische-bureaustoelen category */}
      {isBureauStoelenCategory && (
        <SeatProFAQ />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

