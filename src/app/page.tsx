'use client';

import Link from 'next/link';
import { ArrowRight, Quote, Monitor, Armchair, Volume2, Package, FileText, Lightbulb, Mic, ChevronDown, Plus, Minus } from 'lucide-react';
import ProductCollection from '@/components/ProductCollection';
import { mockProducts } from '@/data/products';
import { getShopifyProducts, isShopifyConfigured } from '@/services/shopifyService';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  
  const words = ['beste', 'comfortabelste', 'luxe', 'ergonomische', 'premium', 'exclusieve'];
  
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
          console.log('⚠️ No Shopify products found, using mock data');
          setProducts(mockProducts.slice(4, 7));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to mock data on error
        setProducts(mockProducts.slice(4, 7));
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
  
  const reviews = [
    {
      name: "Willem",
      rating: 5,
      text: "Super snelle levering en kwaliteit van rugpijn.",
      days: "4 dagen geleden"
    },
    {
      name: "Miranda", 
      title: "Top!",
      rating: 5,
      text: "Top! Snelle verzending, goede klantenservice en zeer vriendelijk!...",
      days: "4 dagen geleden"
    },
    {
      name: "Paul",
      title: "Top materiaal", 
      rating: 5,
      text: "Topmateriaal dat aan alle verwachtingen voldoet, en een zeer snelle levering. Ik ben...",
      days: "4 dagen geleden"
    },
    {
      name: "Tineke",
      title: "Dikke 10",
      rating: 5, 
      text: "Alles is perfect gegaan. Het zijkussen is voor mij een droom die werkelijkheid...",
      days: "6 dagen geleden"
    },
    {
      name: "Rosanne",
      title: "Geweldig",
      rating: 5,
      text: "Snelle levering en de kussens liggen heerlijk. Hadden we veel eerder moeten...",
      days: "8 dagen geleden"
    },
    {
      name: "Mark",
      title: "Uitstekend",
      rating: 5,
      text: "Zeer tevreden met de service en kwaliteit. Aanrader voor iedereen!",
      days: "5 dagen geleden"
    },
    {
      name: "Lisa",
      title: "Perfect",
      rating: 5,
      text: "Precies wat ik zocht. Goede prijs-kwaliteit verhouding en snelle levering.",
      days: "7 dagen geleden"
    },
    {
      name: "Jan",
      title: "Fantastisch",
      rating: 5,
      text: "Alles verliep vlot en professioneel. Zeker een herhaling waard!",
      days: "3 dagen geleden"
    },
    {
      name: "Emma",
      title: "Geweldig",
      rating: 5,
      text: "Snelle service en uitstekende kwaliteit. Heel blij mee!",
      days: "2 dagen geleden"
    },
    {
      name: "Tom",
      title: "Top service",
      rating: 5,
      text: "Precies op tijd geleverd en exact wat beloofd werd.",
      days: "1 dag geleden"
    },
    {
      name: "Sophie",
      title: "Heel tevreden",
      rating: 5,
      text: "Uitstekende ervaring van begin tot eind. Zeker aan te raden!",
      days: "6 uur geleden"
    },
    {
      name: "David",
      title: "Aanrader",
      rating: 5,
      text: "Goede communicatie en snelle afhandeling. Top bedrijf!",
      days: "30 minuten geleden"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white -mt-16 mx-4 sm:mx-6 lg:mx-8" style={{ 
        backgroundImage: 'url(/banner.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: 'calc(60vh + 4rem)',
        paddingTop: '4rem',
        borderRadius: '24px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-start" style={{ alignItems: 'flex-start', paddingTop: '8%' }}>
          <div className="text-left">
            {/* Badge boven titel */}
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#FFF5F2' }}>
              <span 
                className="animate-textSlideThrough"
                style={{
                  background: `linear-gradient(90deg, #d6a99e 0%, #d6a99e 30%, #4a2c1a 50%, #d6a99e 70%, #d6a99e 100%)`,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                #1 Hoogst Gewaardeerde Bureau Stoel Voor Nederland & België
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              De <span 
                className="inline-block min-w-[200px] text-left"
                style={{ 
                  minHeight: '1em',
                  background: `linear-gradient(90deg, #d6a99e 0%, #d6a99e 30%, #a67c52 50%, #d6a99e 70%, #d6a99e 100%)`,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {displayText}
                <span 
                  className="typewriter-cursor"
                  style={{
                    WebkitTextFillColor: '#d6a99e',
                    color: '#d6a99e'
                  }}
                >|</span>
              </span> bureau stoel ter wereld
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white opacity-90">
              Ontdek onze exclusieve collectie premium bureaustoelen voor ultiem comfort
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-white text-black px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Nu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
                  Onze hardlopers
                </h2>
                <p className="text-lg text-gray-600">
                  Dit zijn niet voor niets onze hardlopers.
                </p>
              </div>
              <div className="flex items-center text-blue-600 font-medium text-sm mt-2">
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
          title="Onze hardlopers"
          subtitle="Dit zijn niet voor niets onze hardlopers."
          products={products}
        />
      )}

      {/* Trustpilot Reviews Section */}
      <section className="py-4 overflow-hidden" style={{ backgroundColor: '#f9fafb', height: '500px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Title and Trustpilot info */}
            <div className="flex flex-col justify-center items-center text-center" style={{ height: '500px' }}>
              <div className="flex items-center mb-4">
                <Image 
                  src="/trustpilot stars.png" 
                  alt="5 sterren Trustpilot" 
                  width={134} 
                  height={20}
                  className="mr-3"
                />
                <span className="text-sm font-medium">24294 beoordelingen op</span>
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
                <span className="font-bold">onze klanten?</span>
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
                          src="/trustpilot stars.png" 
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
                          src="/trustpilot stars.png" 
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

      {/* Carousel Section - Limited Edition & Massief Houten */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Carousel Container */}
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {/* Slide 1 - Limited Edition Kleuren */}
              <div className="min-w-full lg:min-w-[calc(50%-12px)] snap-center">
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
                        href="/products?filter=limited-edition"
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
              <div className="min-w-full lg:min-w-[calc(50%-12px)] snap-center">
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
                          href="/products?filter=massief-hout"
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
                  preload="metadata"
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
                  Verken ons uitgebreide assortiment bureaus. Zowel vaste als in hoogte verstelbare bureaus zijn van de hoogste kwaliteit en komen van toonaangevende merken. Kies uit een verscheidenheid aan varianten, kleuren en materialen.
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
                <button 
                  className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#d6a99e' }}
                >
                  Ontdek alle bureaus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden h-[400px] relative group cursor-pointer">
            <Image
              src="/image met stoelen.webp"
              alt="Bureau stoelen collectie"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-center p-12">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Bureau Stoelen op ADE
                </h2>
                <p className="text-xl text-gray-200 mb-6">
                  Ontdek onze nieuwste collectie premium ergonomische bureau stoelen
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                answer: "Absoluut! Onze stoelen zijn speciaal ontworpen voor 8+ uur dagelijks gebruik. Ze hebben ergonomische ondersteuning, verstelbare armleuningen en ademende materialen. Veel modellen zijn gecertificeerd voor intensief kantoorgebruik."
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
            alt="STYLO Logo" 
            className="h-16 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
