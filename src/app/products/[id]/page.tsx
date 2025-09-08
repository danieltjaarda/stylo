'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, Minus, Plus, X, Waves, Flame } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState({ massage: false, verwarming: false });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    Promise.resolve(params).then(setResolvedParams);
  }, [params]);

  const product = resolvedParams ? mockProducts.find(p => p.id === resolvedParams.id) : null;
  
  if (!resolvedParams) {
    return <div>Loading...</div>;
  }
  
  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  // Mock multiple images (using same image for demo)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const colors = [
    { name: 'Wit', color: '#ffffff', border: '#e5e7eb' },
    { name: 'Zwart', color: '#1f2937', border: '#1f2937' }
  ];

  const sizes = [
    'Standard (50 x 75 cm)',
    'Queen (60 x 80 cm)', 
    'King (70 x 90 cm)'
  ];

  const features = [
    { 
      id: 'geen', 
      name: 'Geen', 
      price: 0, 
      icon: X, 
      description: 'Basis bureau stoel',
      isNone: true
    },
    { 
      id: 'massage', 
      name: 'Massage', 
      price: 149, 
      icon: Waves, 
      description: 'Met massage functie',
      isNone: false
    },
    { 
      id: 'verwarming', 
      name: 'Verwarming', 
      price: 149, 
      icon: Flame, 
      description: 'Met verwarmingselement',
      isNone: false
    }
  ];

  const originalPrice = product.price * 1.4;
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  useEffect(() => {
    const productInfo = productInfoRef.current;
    const container = containerRef.current;
    
    if (!productInfo || !container) return;

    let ticking = false;

    const handleScroll = (e: WheelEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;
          
          if (isInView && window.innerWidth >= 1024) {
            const scrollTop = productInfo.scrollTop;
            const scrollHeight = productInfo.scrollHeight;
            const clientHeight = productInfo.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            
            const isAtTop = scrollTop <= 1;
            const isAtBottom = scrollTop >= maxScroll - 1;
            
            if (e.deltaY > 0 && !isAtBottom) {
              // Scrolling down, product info not at bottom
              e.preventDefault();
              productInfo.scrollBy({
                top: e.deltaY * 0.5,
                behavior: 'smooth'
              });
            } else if (e.deltaY < 0 && !isAtTop) {
              // Scrolling up, product info not at top
              e.preventDefault();
              productInfo.scrollBy({
                top: e.deltaY * 0.5,
                behavior: 'smooth'
              });
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover-brown transition-colors">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <a href="/products" className="text-gray-500 hover-brown transition-colors">
                  Bureau Stoelen
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Images */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Bestseller Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Bestseller
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">30 dagen proefzitten</div>
                <div className="text-sm text-gray-600">
                  We staan achter de kwaliteit van onze producten en zorgen ervoor dat je bij bent met je aankoop.
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div ref={productInfoRef} className="space-y-6 lg:max-h-screen lg:overflow-y-auto lg:pr-4 product-scroll" style={{ scrollPaddingTop: '2rem' }}>
            {/* Product Title & Category */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Bureau Stoelen</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Premium Ergonomische Bureau Stoel
              </h1>
            </div>



            {/* Rating */}
            <div className="flex items-center space-x-2">
              <img 
                src="/shopify 4,5 star rating.svg" 
                alt="4,5 sterren rating" 
                className="h-4"
              />
              <span className="font-semibold">4.5/5</span>
              <span className="text-gray-600">Uitstekend</span>
              <span className="font-semibold">5000+ reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <div className="text-lg text-red-500 line-through font-medium">
                €{originalPrice.toFixed(2).replace('.', ',')} EUR
              </div>
              <div className="text-3xl font-bold text-gray-900">
                €{product.price.toFixed(2).replace('.', ',')} EUR
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-medium">KLEUR</span>
                <span className="text-gray-500">- {colors[selectedColor].name}</span>
              </div>
              <div className="flex space-x-3">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === index ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>



            {/* Feature Selection */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="font-medium">EXTRA FUNCTIES</span>
                <span className="text-gray-500">
                  {!selectedFeatures.massage && !selectedFeatures.verwarming 
                    ? 'Geen' 
                    : [
                        selectedFeatures.massage && 'Massage',
                        selectedFeatures.verwarming && 'Verwarming'
                      ].filter(Boolean).join(' + ')
                  }
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  const isSelected = feature.isNone 
                    ? !selectedFeatures.massage && !selectedFeatures.verwarming
                    : selectedFeatures[feature.id as keyof typeof selectedFeatures];
                  
                  const handleClick = () => {
                    if (feature.isNone) {
                      // "Geen" deselecteert alle features
                      setSelectedFeatures({ massage: false, verwarming: false });
                    } else {
                      // Toggle specifieke feature
                      setSelectedFeatures(prev => ({
                        ...prev,
                        [feature.id]: !prev[feature.id as keyof typeof prev]
                      }));
                    }
                  };

                  return (
                    <button
                      key={index}
                      onClick={handleClick}
                      className={`relative p-4 border-2 rounded-lg text-center transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                        <div className="font-semibold text-sm">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {feature.price === 0 ? 'Gratis' : `+€${feature.price.toFixed(2)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-orange-600 font-medium">Bijna uitverkocht</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Gratis verzending vanaf €70</span>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>IN WINKELWAGEN • €{(product.price + (selectedFeatures.massage ? 149 : 0) + (selectedFeatures.verwarming ? 149 : 0)).toFixed(2)} EUR</span>
              </button>
              
              {/* Quantity and Payment Options Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                {/* Payment Options */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Betaal veilig</span>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="font-semibold text-black underline hover:text-gray-700 transition-colors"
                  >
                    met deze betaalmogelijkheden
                  </button>
                </div>
              </div>

              {/* Expert Testimonial */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/Chris winter.webp"
                      alt="Dr. Chris Winter"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover grayscale"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Dr. Chris Winter over de Ergonomische Bureau Stoel
                    </h4>
                    <blockquote className="text-sm text-gray-700 leading-relaxed">
                      "Een product dat de werkhouding kan verbeteren en zich als een luxe aanvoelt om te gebruiken. 
                      Ontdek de ergonomische bureau stoel. Deze luxe, wasbare stoel is ongelooflijk zacht en 
                      ondersteunt het lichaam moeiteloos, waardoor de werkdag dramatisch verbetert. Het is perfect 
                      voor je kantoor of thuiswerkplek, en de verkoeelende stof creëert overal de ideale werkomgeving."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-semibold text-center mb-6">
                Betaal veilig met deze betaalmogelijkheden
              </h3>
              
              {/* Payment Icons Row */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <img src="/svg icons/visa.svg" alt="Visa" className="h-8 w-auto" />
                <img src="/svg icons/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
                <img src="/svg icons/amex.svg" alt="American Express" className="h-8 w-auto" />
                <img src="/svg icons/ideal.svg" alt="iDEAL" className="h-8 w-auto" />
                <img src="/svg icons/paypal.svg" alt="PayPal" className="h-8 w-auto" />
                <img src="/svg icons/maestro.svg" alt="Maestro" className="h-8 w-auto" />
                <img src="/svg icons/klarna.svg" alt="Klarna" className="h-8 w-auto" />
                <img src="/svg icons/apple_pay.svg" alt="Apple Pay" className="h-8 w-auto" />
                <img src="/svg icons/google_pay.svg" alt="Google Pay" className="h-8 w-auto" />
                <img src="/svg icons/bancontact.svg" alt="Bancontact" className="h-8 w-auto" />
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Gerelateerde Bureau Stoelen</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ontdek andere premium bureau stoelen uit onze collectie
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}