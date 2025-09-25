'use client';

import Link from 'next/link';
import { ArrowRight, Quote, Monitor, Armchair, Volume2, Package, FileText, Lightbulb, Mic, ChevronDown, Plus, Minus } from 'lucide-react';
import ProductCollection from '@/components/ProductCollection';
import { getShopifyProducts, isShopifyConfigured } from '@/services/shopifyService';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });
import { Product } from '@/types';


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [thumbsUpAnimation, setThumbsUpAnimation] = useState(null);
  const [thumbAnimationKey, setThumbAnimationKey] = useState(0);
  const [starAnimation, setStarAnimation] = useState(null);
  const [starAnimationKey, setStarAnimationKey] = useState(0);
  const [refundAnimation, setRefundAnimation] = useState(null);
  const [refundAnimationKey, setRefundAnimationKey] = useState(0);
  const [boxAnimation, setBoxAnimation] = useState(null);
  const [boxAnimationKey, setBoxAnimationKey] = useState(0);
  const [badgeAnimation, setBadgeAnimation] = useState(null);
  const [badgeAnimationKey, setBadgeAnimationKey] = useState(0);
  const [headsetAnimation, setHeadsetAnimation] = useState(null);
  const [headsetAnimationKey, setHeadsetAnimationKey] = useState(0);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  // Load Lottie animations lazily when they're needed
  const loadAnimations = useCallback(() => {
    if (animationsLoaded) return;
    
    Promise.all([
      fetch('/wired-outline-267-like-thumb-up-hover-up (1).json').then(r => r.json()),
      fetch('/wired-outline-237-star-rating-hover-pinch (1).json').then(r => r.json()),
      fetch('/wired-outline-2115-refund-hover-pinch.json').then(r => r.json()),
      fetch('/wired-outline-108-box-hover-squeeze.json').then(r => r.json()),
      fetch('/wired-outline-434-prize-padge-ribbon-hover-pinch (1).json').then(r => r.json()),
      fetch('/wired-outline-463-headset-customer-support-hover-pinch.json').then(r => r.json())
    ])
    .then(([thumbData, starData, refundData, boxData, badgeData, headsetData]) => {
      setThumbsUpAnimation(thumbData);
      setStarAnimation(starData);
      setRefundAnimation(refundData);
      setBoxAnimation(boxData);
      setBadgeAnimation(badgeData);
      setHeadsetAnimation(headsetData);
      setAnimationsLoaded(true);
    })
    .catch(error => {
      console.error('Error loading animations:', error);
      setAnimationsLoaded(true); // Show fallbacks if loading fails
    });
  }, [animationsLoaded]);

  // Load animations when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadAnimations();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const trustSection = document.querySelector('[data-trust-indicators]');
    if (trustSection) {
      observer.observe(trustSection);
    }

    return () => observer.disconnect();
  }, [loadAnimations]);

  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "DESKNA",
      "url": "https://deskna.nl",
      "description": "Specialist in ergonomische bureaustoelen en zit-sta bureaus",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1370",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Ergonomische Werkplekken",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Ergonomische Bureaustoelen",
              "category": "Kantoormeubels"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Product",
              "name": "Zit-Sta Bureaus",
              "category": "Kantoormeubels"
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);
  
  const words = ['mega', 'super', 'ultra'];
  
  // Load products from Shopify
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Always try to load from Shopify first
        const shopifyProducts = await getShopifyProducts(6);
        if (shopifyProducts.length > 0) {
          console.log('✅ Shopify products loaded:', shopifyProducts);
          setProducts(shopifyProducts);
        } else {
          console.log('⚠️ No Shopify products found');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && displayText === currentWord) {
      // Wacht 4 seconden voordat we beginnen met verwijderen
      timeout = setTimeout(() => setIsDeleting(true), 4000);
    } else if (isDeleting && displayText === '') {
      // Wacht 1 seconde voordat we het volgende woord beginnen
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 1000);
    } else if (isDeleting) {
      // Verwijder letters
      timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
      }, 50);
    } else {
      // Voeg letters toe
      timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
      }, 100);
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex, words]);

  // Carousel scroll detection
  useEffect(() => {
    const handleCarouselScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const slideWidth = container.clientWidth * 0.85; // 85% width per slide
      const scrollLeft = container.scrollLeft;
      const newSlideIndex = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlideIndex);
    };

    const carouselContainer = document.querySelector('.snap-x');
    if (carouselContainer) {
      carouselContainer.addEventListener('scroll', handleCarouselScroll);
      return () => carouselContainer.removeEventListener('scroll', handleCarouselScroll);
    }
  }, []);
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white -mt-16 mx-0 md:mx-4 lg:mx-8 md:rounded-3xl overflow-hidden" style={{ 
        height: 'calc(60vh + 4rem)',
        paddingTop: '4rem'
      }}>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/banner mobile 3.0.png" 
            alt="Hero banner" 
            fill 
            className="object-cover md:hidden" 
            priority 
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          <Image 
            src="/banner.webp" 
            alt="Hero banner" 
            fill 
            className="object-cover hidden md:block" 
            priority 
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-start pt-[35%] md:pt-[8%]" style={{ alignItems: 'flex-start' }}>
          <div className="text-left">
            {/* Review Stars */}
            <div className="inline-flex items-center gap-3 text-sm font-semibold mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white">
                4.8 • 1.370+ reviews
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              De{' '}
              {/* Mobile: solid high-contrast word */}
              <span 
                className="inline-block md:hidden text-left"
                style={{ 
                  minHeight: '1em',
                  color: '#fe8b51',
                  textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  marginLeft: displayText ? '0.5rem' : 0
                }}
              >
                {displayText || ''}
                <span 
                  className="typewriter-cursor"
                  style={{
                    WebkitTextFillColor: '#fe8b51',
                    color: '#fe8b51'
                  }}
                >|</span>
              </span>
              {/* Desktop/Tablet: keep gradient word */}
              <span 
                className="hidden md:inline-block text-left"
                style={{ 
                  minHeight: '1em',
                  background: `linear-gradient(90deg, #d6a99e 0%, #d6a99e 30%, #a67c52 50%, #d6a99e 70%, #d6a99e 100%)`,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginLeft: displayText ? '0.5rem' : 0
                }}
              >
                {displayText || ''}
                <span 
                  className="typewriter-cursor"
                  style={{
                    WebkitTextFillColor: '#d6a99e',
                    color: '#d6a99e'
                  }}
                >|</span>
              </span>
              {' '}back to work deals
            </h1>
            
            <h2 className="hidden md:block md:text-2xl text-white opacity-95 mb-4 font-semibold">
              Premium ergonomische werkplekken: verstelbare bureaus, ergonomische stoelen en professionele kantoorinrichting — snel geleverd
            </h2>
            
            {/* Certificaten */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Image 
                  src="/svg icons/certificaat 1.svg.png" 
                  alt="Certificaat" 
                  width={50}
                  height={50}
                  className="h-12 w-auto"
                  loading="eager"
                />
                <Image 
                  src="/svg icons/WOTY_badge-certified2025.svg" 
                  alt="Workspace of the Year 2025" 
                  width={50}
                  height={50}
                  className="h-12 w-auto"
                  loading="eager"
                />
              </div>
            </div>
            
            <Link
              href="/shop-alles"
              className="inline-flex items-center bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mb-4"
            >
              Shop Nu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-8 bg-gray-50" data-trust-indicators>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - 3 columns grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Meer dan 500.000 klanten */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setThumbAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && thumbsUpAnimation ? (
                    <Lottie
                      key={thumbAnimationKey}
                      animationData={thumbsUpAnimation}
                      play={thumbAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <div className="relative w-6 h-6 hover:animate-bounce">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V18m-7-8a2 2 0 01-2-2V6a2 2 0 012-2h2.343M7 20L4.343 17.343A2 2 0 013 15.828V9.172a2 2 0 01.586-1.414L7 4m0 16l3.5-3.5M7 4v3m0 0l3.5 3.5" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">Meer dan 20.000</div>
                <div className="text-xs text-gray-600">blije klanten</div>
              </div>

              {/* 4.8 rating */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setStarAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && starAnimation ? (
                    <Lottie
                      key={starAnimationKey}
                      animationData={starAnimation}
                      play={starAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <svg className="w-6 h-6 text-yellow-500 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">Een 4.8 van onze</div>
                <div className="text-xs text-gray-600">klanten</div>
              </div>

              {/* 30 dagen garantie */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setRefundAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && refundAnimation ? (
                    <Lottie
                      key={refundAnimationKey}
                      animationData={refundAnimation}
                      play={refundAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <svg className="w-6 h-6 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">30 dagen geld-terug-</div>
                <div className="text-xs text-gray-600">garantie</div>
              </div>

              {/* Snelle bezorging */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setBoxAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && boxAnimation ? (
                    <Lottie
                      key={boxAnimationKey}
                      animationData={boxAnimation}
                      play={boxAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <svg className="w-6 h-6 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">Snelle bezorging en</div>
                <div className="text-xs text-gray-600">retourneren</div>
              </div>

              {/* Gecertificeerde ergonomie */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setBadgeAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && badgeAnimation ? (
                    <Lottie
                      key={badgeAnimationKey}
                      animationData={badgeAnimation}
                      play={badgeAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <svg className="w-6 h-6 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">Gecertificeerde</div>
                <div className="text-xs text-gray-600">ergonomie</div>
              </div>

              {/* Bekroonde klantenservice */}
              <div 
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => {
                  setHeadsetAnimationKey(prev => prev + 1);
                }}
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  {animationsLoaded && headsetAnimation ? (
                    <Lottie
                      key={headsetAnimationKey}
                      animationData={headsetAnimation}
                      play={headsetAnimationKey > 0}
                      loop={false}
                      style={{ width: 40, height: 40 }}
                    />
                  ) : animationsLoaded ? (
                    <svg className="w-6 h-6 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                    </svg>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">Bekroonde</div>
                <div className="text-xs text-gray-600">klantenservice</div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Centered Grid */}
          <div className="hidden md:flex justify-center">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {/* Meer dan 500.000 klanten */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setThumbAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && thumbsUpAnimation ? (
                  <Lottie
                    key={thumbAnimationKey}
                    animationData={thumbsUpAnimation}
                    play={thumbAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <div className="relative w-7 h-7 hover:animate-bounce">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V18m-7-8a2 2 0 01-2-2V6a2 2 0 012-2h2.343M7 20L4.343 17.343A2 2 0 013 15.828V9.172a2 2 0 01.586-1.414L7 4m0 16l3.5-3.5M7 4v3m0 0l3.5 3.5" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Meer dan 20.000</div>
              <div className="text-xs text-gray-600">blije klanten</div>
            </div>

            {/* 4.8 rating */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setStarAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && starAnimation ? (
                  <Lottie
                    key={starAnimationKey}
                    animationData={starAnimation}
                    play={starAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <svg className="w-7 h-7 text-yellow-500 hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Een 4.8 van onze</div>
              <div className="text-xs text-gray-600">klanten</div>
            </div>

            {/* 30 dagen garantie */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setRefundAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && refundAnimation ? (
                  <Lottie
                    key={refundAnimationKey}
                    animationData={refundAnimation}
                    play={refundAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <svg className="w-7 h-7 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">30 dagen geld-terug-</div>
              <div className="text-xs text-gray-600">garantie</div>
            </div>

            {/* Snelle bezorging */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setBoxAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && boxAnimation ? (
                  <Lottie
                    key={boxAnimationKey}
                    animationData={boxAnimation}
                    play={boxAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <svg className="w-7 h-7 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Snelle bezorging en</div>
              <div className="text-xs text-gray-600">retourneren</div>
            </div>

            {/* Gecertificeerde ergonomie */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setBadgeAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && badgeAnimation ? (
                  <Lottie
                    key={badgeAnimationKey}
                    animationData={badgeAnimation}
                    play={badgeAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <svg className="w-7 h-7 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Gecertificeerde</div>
              <div className="text-xs text-gray-600">ergonomie</div>
            </div>

            {/* Bekroonde klantenservice */}
            <div 
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => {
                setHeadsetAnimationKey(prev => prev + 1);
              }}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                {animationsLoaded && headsetAnimation ? (
                  <Lottie
                    key={headsetAnimationKey}
                    animationData={headsetAnimation}
                    play={headsetAnimationKey > 0}
                    loop={false}
                    style={{ width: 44, height: 44 }}
                  />
                ) : animationsLoaded ? (
                  <svg className="w-7 h-7 text-gray-700 hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                ) : (
                  <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Bekroonde</div>
              <div className="text-xs text-gray-600">klantenservice</div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection */}
      {loading ? (
        <section className="py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-12">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Topproducten
                </h2>
                <p className="text-lg text-gray-600">
                  Dit zijn niet voor niets onze hardlopers.
                </p>
              </div>
              <div className="md:hidden flex items-center text-blue-600 font-medium text-sm mt-2">
                <span className="mr-2">Bekijk de hele collectie</span>
              </div>
            </div>

            {/* Skeleton Grid (4 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group block">
                  {/* Image skeleton */}
                  <div className="relative mb-4">
                    <div className="absolute top-3 left-3 z-10 h-6 w-28 rounded animate-shimmer"></div>
                    <div className="relative rounded-lg overflow-hidden animate-shimmer" style={{ height: '280px' }}></div>
                  </div>

                  {/* Text skeletons */}
                  <div className="space-y-3">
                    {/* rating pill */}
                    <div className="h-6 w-32 rounded-full animate-shimmer"></div>
                    {/* title */}
                    <div className="h-5 w-3/4 rounded animate-shimmer"></div>
                    {/* description */}
                    <div className="h-4 w-full rounded animate-shimmer"></div>
                    <div className="h-4 w-5/6 rounded animate-shimmer"></div>
                    {/* price row */}
                    <div className="flex items-center space-x-3">
                      <div className="h-6 w-24 rounded animate-shimmer"></div>
                      <div className="h-4 w-16 rounded animate-shimmer"></div>
                    </div>
                    {/* color dots */}
                    <div className="flex items-center space-x-2 pt-1">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <div key={j} className="w-5 h-5 rounded-full animate-shimmer"></div>
                      ))}
                      <div className="h-4 w-8 rounded animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <ProductCollection 
          title="Topproducten"
          subtitle="Dit zijn niet voor niets onze hardlopers."
          products={products}
        />
      )}


      {/* Carousel Section - Limited Edition & Massief Houten */}
      <section className="pt-8 pb-16 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Carousel Container */}
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {/* Slide 1 - Limited Edition Kleuren */}
              <div className="min-w-[85%] md:min-w-full lg:min-w-[calc(50%-12px)] snap-center">
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/svg icons/houten bladen.jpg"
                      alt="Houten bladen achtergrond"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="relative p-8 lg:p-12 h-[400px] lg:h-[500px] flex flex-col">
                    {/* Top Content */}
                    <div className="flex flex-col space-y-4 max-w-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 w-fit">
                        Nieuw
                      </span>
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        Limited edition kleuren
                      </h3>
                      <Link
                        href="/verstelbare-bureaus"
                        className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium w-fit transition-all hover:opacity-90 mt-4"
                        style={{ backgroundColor: '#9CAFAA' }}
                      >
                        Meer info
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2 - Massief Houten Bureaus */}
              <div className="min-w-[85%] md:min-w-full lg:min-w-[calc(50%-12px)] snap-center">
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/svg icons/bureau poten.jpg"
                      alt="Bureau poten achtergrond"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="relative h-[400px] lg:h-[500px] flex flex-col justify-end">
                    {/* Bottom Content on dark area */}
                    <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 lg:p-12">
                      <div className="flex flex-col space-y-4 max-w-md">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur text-white w-fit">
                          Nieuw
                        </span>
                        <h3 className="text-3xl lg:text-4xl font-bold text-white">
                          Stabiele bureau frames
                        </h3>
                        <Link
                          href="/verstelbare-bureaus"
                          className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium w-fit transition-all hover:opacity-90 mt-2"
                          style={{ backgroundColor: '#9CAFAA' }}
                        >
                          Meer info
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              <button 
                onClick={() => {
                  const container = document.querySelector('.snap-x');
                  if (container) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                    setCurrentSlide(0);
                  }
                }}
                className={`${currentSlide === 0 ? 'w-8' : 'w-2'} h-2 rounded-full ${currentSlide === 0 ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'} transition-all`}
              ></button>
              <button 
                onClick={() => {
                  const container = document.querySelector('.snap-x');
                  if (container) {
                    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
                    setCurrentSlide(1);
                  }
                }}
                className={`${currentSlide === 1 ? 'w-8' : 'w-2'} h-2 rounded-full ${currentSlide === 1 ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'} transition-all`}
              ></button>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const container = document.querySelector('.snap-x');
                if (container) {
                  if (currentSlide === 1) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                    setCurrentSlide(0);
                  }
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                const container = document.querySelector('.snap-x');
                if (container) {
                  if (currentSlide === 0) {
                    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
                    setCurrentSlide(1);
                  }
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Trustpilot Reviews Section */}
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
                  width={120} 
                  height={24}
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
                        width={100} 
                        height={20}
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
                  width={150} 
                  height={30}
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
                          width={90} 
                          height={18}
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
                          width={90} 
                          height={18}
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

      {/* Bureaus Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Video */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="/svg icons/videoframe_21189.png"
                >
                  <source src="/svg icons/company-video-2-se.mp4" type="video/mp4" />
                  {/* Fallback image */}
                  <img 
                    src="/svg icons/videoframe_21189.png" 
                    alt="Bureau video thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </video>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Onze bureaus
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Verken ons uitgebreide assortiment elektrische zit-sta bureaus en in hoogte verstelbare bureau oplossingen. Van compacte thuiskantoor bureaus tot professionele werkstations - onze verstelbare bureaus bieden de juiste hoogte voor staand werken en zittend werken. Kies uit verschillende tafelblad afmetingen, kleuren en premium materialen.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d6a99e' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Altijd ruime voorraad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d6a99e' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Tot 12 jaar garantie!</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d6a99e' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Varianten in alle prijsklassen</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link 
                  href="/verstelbare-bureaus"
                  className="inline-block px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#d6a99e' }}
                >
                  Ontdek alle bureaus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/bureaustoelen" className="block">
            <div className="rounded-2xl overflow-hidden h-[400px] relative group cursor-pointer">
              <Image
                src="/image met stoelen.webp"
                alt="Bureau stoelen collectie"
                fill
                className="object-cover"
                loading="lazy"
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              <div className="relative h-full flex flex-col justify-center p-12">
                <div className="max-w-lg">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ergonomische bureaustoelen voor optimaal zitcomfort
                  </h3>
                  <p className="text-lg text-white/90 mb-6">
                    Ontdek onze collectie ergonomische bureaustoelen met verstelbare rugsteun, hoofdsteun en armleuningen. Perfect voor lange werkdagen, thuiswerken en professionele kantooromgevingen.
                  </p>
                  <button 
                    className="px-8 py-3 rounded-full font-semibold transition-colors"
                    style={{ 
                      backgroundColor: '#d6a99e',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c19688'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d6a99e'}
                  >
                    Bekijk Collectie
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight px-2">
              <span className="block sm:hidden">Aanbevolen door<br />specialisten</span>
              <span className="hidden sm:block">Aanbevolen door dermatologen & ergonomie-specialisten</span>
            </h2>
          </div>
          {/* Mobile Layout - Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {/* Testimonial 1 - Mobile */}
              <div className="flex-shrink-0 w-72 sm:w-80 text-left bg-gray-50 p-6 rounded-xl snap-center">
                <div className="mb-4">
                  <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden mb-4 bg-gray-200">
                    <Image
                      src="/Chris winter.webp"
                      alt="Dr. Chris Winter"
                      width={320}
                      height={224}
                      className="w-full h-full object-cover grayscale"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 640px) 280px, 320px"
                    />
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  "De luxe, wasbare kussens van onze ergonomische bureaustoelen zijn ongelooflijk zacht en blokkeren het licht moeiteloos, waardoor de werkdag enorm verbetert."
                </blockquote>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Dr. Chris Winter</p>
                    <p className="text-xs sm:text-sm text-gray-600">Ergonomie Expert</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 - Mobile */}
              <div className="flex-shrink-0 w-72 sm:w-80 text-left bg-gray-50 p-6 rounded-xl snap-center">
                <div className="mb-4">
                  <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden mb-4 bg-gray-200">
                    <Image
                      src="/Krisel Woltman.webp"
                      alt="Drs. Kristel Woltman"
                      width={320}
                      height={224}
                      className="w-full h-full object-cover grayscale"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 640px) 280px, 320px"
                    />
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  "Een gezonde houding krijg je met de juiste ondersteuning in je werkstoel. Ik raad mijn patiënten deze stoelen aan omdat het de effectiviteit van je werk verbetert."
                </blockquote>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Drs. Kristel Woltman</p>
                    <p className="text-xs sm:text-sm text-gray-600">Fysiotherapeut</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 - Mobile */}
              <div className="flex-shrink-0 w-72 sm:w-80 text-left bg-gray-50 p-6 rounded-xl snap-center">
                <div className="mb-4">
                  <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden mb-4 bg-gray-200">
                    <Image
                      src="/Joep.webp"
                      alt="Joep Rovers"
                      width={320}
                      height={224}
                      className="w-full h-full object-cover grayscale"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 640px) 280px, 320px"
                    />
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  "Door te zitten op een antibacteriële kussensloop van onze stoelen, heeft grote invloed op hoe je huid 's nachts herstelt. Dit is iets wat ik iedereen zou aanraden."
                </blockquote>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Joep Rovers</p>
                    <p className="text-xs sm:text-sm text-gray-600">Ergonomie Adviseur</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
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

          {/* Desktop Layout - Original Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="text-left">
              <div className="mb-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden mb-6 bg-gray-200">
                  <Image
                    src="/Chris winter.webp"
                    alt="Dr. Chris Winter"
                    width={384}
                    height={384}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
              <blockquote className="text-sm text-gray-700 mb-6 leading-relaxed">
                "De luxe, wasbare kussens van onze ergonomische bureaustoelen zijn ongelooflijk zacht en blokkeren het licht moeiteloos, waardoor de werkdag enorm verbetert. Het is perfect voor in het kantoor of op reis, en de verkoeelende stof creëert overal de ideale werkomgeving."
              </blockquote>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-gray-900">Dr. Chris Winter</p>
                  <p className="text-sm text-gray-600">Ergonomie Expert</p>
                </div>
                <div className="ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="text-left">
              <div className="mb-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden mb-6 bg-gray-200">
                  <Image
                    src="/Krisel Woltman.webp"
                    alt="Drs. Kristel Woltman"
                    width={384}
                    height={384}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
              <blockquote className="text-sm text-gray-700 mb-6 leading-relaxed">
                "Een gezonde houding krijg je met de juiste ondersteuning in je werkstoel. De ergonomische eigenschappen die je consumeert en de juiste zitpositie. Ik raad mijn patiënten deze stoelen aan omdat het de effectiviteit van je werk en comfort verbetert. Daarnaast vermindert de zachte stof de kans op rugklachten."
              </blockquote>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-gray-900">Drs. Kristel Woltman</p>
                  <p className="text-sm text-gray-600">Fysiotherapeut</p>
                </div>
                <div className="ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="text-left">
              <div className="mb-6">
                <div className="w-96 h-96 rounded-lg overflow-hidden mb-6 bg-gray-200">
                  <Image
                    src="/Joep.webp"
                    alt="Joep Rovers"
                    width={384}
                    height={384}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
              <blockquote className="text-sm text-gray-700 mb-6 leading-relaxed">
                "Ik heb zelf ernstig eczeem gehad in mijn gezicht en kon dit oplossen door mijn werkstoel aan te passen. De kussensloop waar je de hele dag op zit, heeft grote invloed op hoe je huid 's nachts herstelt. Door te zitten op een antibacteriële kussensloop van onze stoelen, is iets wat ik iedereen zou aanraden."
              </blockquote>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold text-gray-900">Joep Rovers</p>
                  <p className="text-sm text-gray-600">Ergonomie Adviseur</p>
                </div>
                <div className="ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#00c8fc' }}>
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout - Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
              {/* Snelle bezorging - Mobile */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm flex-shrink-0 w-64">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Snelle bezorging</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Alle bestellingen worden binnen 3-5 dagen verzonden
                </p>
              </div>

              {/* Gratis retourneren - Mobile */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm flex-shrink-0 w-64">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gratis & gemakkelijk retourneren</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Niet tevreden? Retourneer gratis binnen 30 dagen na aankoop.
                </p>
              </div>

              {/* Uitgebreide garantie - Mobile */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm flex-shrink-0 w-64">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Uitgebreide garantie</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Stressvrije ervaring met snelle vervanging en uitzonderlijke duurzaamheid.
                </p>
              </div>

              {/* Flexibele betalingsopties - Mobile */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm flex-shrink-0 w-64">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Flexibele betalingsopties</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Krijg vandaag wat je wilt. Betaal later of in meerdere rentevrije termijnen.
                </p>
              </div>
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

          {/* Desktop Layout - Original Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Snelle bezorging */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Snelle bezorging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Alle bestellingen worden binnen 3-5 dagen verzonden
              </p>
            </div>

            {/* Gratis retourneren */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Gratis & gemakkelijk retourneren</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Niet tevreden? Retourneer gratis binnen 30 dagen na aankoop.
              </p>
            </div>

            {/* Uitgebreide garantie */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Uitgebreide garantie</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stressvrije ervaring met snelle vervanging en uitzonderlijke duurzaamheid.
              </p>
            </div>

            {/* Flexibele betalingsopties */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Flexibele betalingsopties</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Krijg vandaag wat je wilt. Betaal later of in meerdere rentevrije termijnen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-lg text-gray-600">
              Hier vind je antwoorden op de meest gestelde vragen over onze producten en service.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Hoe lang duurt de levering van mijn bestelling?",
                answer: "Alle bestellingen worden binnen 1-3 werkdagen verzonden. De levertijd is afhankelijk van je locatie: Nederland 1-2 werkdagen, België 2-3 werkdagen. Je ontvangt altijd een track & trace code om je bestelling te volgen."
              },
              {
                question: "Kan ik mijn bestelling retourneren als ik niet tevreden ben?",
                answer: "Ja, je kunt je bestelling binnen 30 dagen na ontvangst gratis retourneren. De producten moeten wel in originele staat zijn. Neem contact met ons op voor een retourlabel en verdere instructies."
              },
              {
                question: "Welke garantie krijg ik op mijn bureau of stoel?",
                answer: "Op onze bureaus geven we 5 jaar garantie op het mechanisme en 2 jaar op het tafelblad. Op bureaustoelen hebben we 5 jaar garantie op het mechanisme en 2 jaar op de bekleding. Deze garantie dekt productiefouten en normale slijtage."
              },
              {
                question: "Hoe weet ik welke maat bureau het beste bij mij past?",
                answer: "Meet eerst je werkruimte op. Voor een comfortabele werkplek adviseren we minimaal 120x60 cm. Heb je twee monitoren? Dan is 160x80 cm of groter ideaal. In onze productbeschrijvingen vind je gedetailleerde afmetingen en tips."
              },
              {
                question: "Zijn jullie bureaustoelen geschikt voor lange werkdagen?",
                answer: "Absoluut! Onze ergonomische bureaustoelen zijn speciaal ontworpen voor 8+ uur dagelijks gebruik en lange werkdagen. Ze bieden optimale rugondersteuning, verstelbare armleuningen, hoofdsteun en ademende mesh materialen. Perfect voor thuiswerken, kantoor gebruik en intensieve werkzaamheden."
              },
              {
                question: "Kan ik de montage laten uitvoeren?",
                answer: "Ja, we bieden een montageservice aan voor €49. Onze monteurs komen bij je thuis en zorgen voor een professionele installatie. Je kunt deze service toevoegen tijdens het bestellen of achteraf via de klantenservice."
              },
              {
                question: "Welke betaalmogelijkheden hebben jullie?",
                answer: "Je kunt betalen met iDEAL, creditcard (Visa/Mastercard), PayPal, Klarna (achteraf betalen), en bankoverschrijving. Voor bedrijven bieden we ook betaling op factuur aan na goedkeuring."
              },
              {
                question: "Hebben jullie een fysieke showroom?",
                answer: "Ja, je bent welkom in onze showroom in Amsterdam om producten uit te proberen. We adviseren je graag persoonlijk. Maak een afspraak via onze website of bel ons voor de openingstijden en adresgegevens."
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Neem contact op
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors">
                Live chat starten
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Divider - overlapping the border */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <img 
            src="/favicon logo.png" 
            alt="DESKNA Logo" 
            className="h-16 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
