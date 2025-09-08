'use client';

import Link from 'next/link';
import { ArrowRight, Quote, Monitor, Armchair, Volume2, Package, FileText, Lightbulb, Mic } from 'lucide-react';
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
  
  const words = ['beste', 'comfortabelste', 'luxe', 'ergonomische', 'premium', 'exclusieve'];
  
  // Load products from Shopify
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (isShopifyConfigured()) {
          const shopifyProducts = await getShopifyProducts(6);
          if (shopifyProducts.length > 0) {
            setProducts(shopifyProducts);
          } else {
            // Fallback to mock data
            setProducts(mockProducts.slice(4, 7));
          }
        } else {
          // Use mock data if Shopify not configured
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

      {/* Categories Section */}
      <section className="pt-12 pb-48 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
            {/* Bureau */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Monitor className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Bureau</span>
            </div>

            {/* Bureaustoelen */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Armchair className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Bureaustoelen</span>
            </div>

            {/* Geluidsabsorbers */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Volume2 className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Speakers</span>
            </div>

            {/* Opslag */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Opslag</span>
            </div>

            {/* Whiteboards */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Whiteboards</span>
            </div>

            {/* Verlichting */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Verlichting</span>
            </div>

            {/* Groepen */}
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="w-10 h-10 text-gray-600 group-hover:text-[#d6a99e] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Microfoons</span>
            </div>


          </div>
        </div>
      </section>

      {/* Product Collection */}
      {loading ? (
        <section className="py-16 bg-gray-50 relative -mt-32 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d6a99e] mx-auto mb-4"></div>
                <p className="text-gray-600">Producten laden van Shopify...</p>
              </div>
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
      <section className="py-4 overflow-hidden" style={{ backgroundColor: '#fff6f3', height: '500px' }}>
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
