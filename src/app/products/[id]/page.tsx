'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, Minus, Plus, X, Waves, Flame, Sprout } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ProductCard';
import { getShopifyProducts } from '@/services/shopifyService';
import { Product } from '@/types';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [isImagesReady, setIsImagesReady] = useState(false);
  const addToCart = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const [showTreeInfo, setShowTreeInfo] = useState(false);
  const [deliveryText, setDeliveryText] = useState<string>("");

  // Pre-created image elements for instant switching
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const mainImageRef = useRef<HTMLDivElement>(null);
  const lastInitializedProductIdRef = useRef<string | null>(null);

  // Resolve params first
  useEffect(() => {
    Promise.resolve(params).then(setResolvedParams);
  }, [params]);

  // Load shopify products
  useEffect(() => {
    async function loadShopifyProducts() {
      try {
        setIsLoadingShopify(true);
        const products = await getShopifyProducts();
        setShopifyProducts(products);
      } catch (error) {
        console.error('Failed to load shopify products:', error);
      } finally {
        setIsLoadingShopify(false);
      }
    }
    loadShopifyProducts();
  }, []);

  // Compute tomorrow delivery text (client-side to avoid hydration mismatch)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const day = new Intl.DateTimeFormat('nl-NL', { day: 'numeric' }).format(tomorrow);
    const month = new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(tomorrow);
    setDeliveryText(`Morgen ${day} ${month} in huis!`);
  }, []);

  // Scroll handling for sticky content
  useEffect(() => {
    const handleScroll = () => {
      const sticky = document.getElementById('sticky-content');
      const footer = document.querySelector('footer');
      
      if (sticky && footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const stickyHeight = sticky.offsetHeight;
        
        if (footerTop < stickyHeight + 100) {
          sticky.style.position = 'absolute';
          sticky.style.bottom = `${window.innerHeight - footerTop + 20}px`;
          sticky.style.top = 'auto';
        } else {
          sticky.style.position = 'sticky';
          sticky.style.top = '2rem';
          sticky.style.bottom = 'auto';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get product early for effects
  const routeId = resolvedParams?.id || '';
  const decodedRouteId = routeId ? decodeURIComponent(routeId) : '';
  const mockProduct = resolvedParams ? mockProducts.find((p: Product & { handle?: string }) => p.id === decodedRouteId || p.id === routeId || p.handle === decodedRouteId) : undefined as any;
  const shopifyProduct = resolvedParams
    ? shopifyProducts.find(p =>
        p.handle === decodedRouteId ||
        p.id === decodedRouteId ||
        p.id === routeId ||
        p.id.includes(decodedRouteId)
      )
    : undefined;
  const product = shopifyProduct || mockProduct;

  // Initialize and preload all images, and initialize selectedOptions once per product
  useEffect(() => {
    if (!product) return;
    
    const variantImageUrls = (product.variants || [])
      .map((v: { imageUrl?: string }) => v.imageUrl)
      .filter((u: string | undefined): u is string => Boolean(u));
    const uniqueVariantImages = Array.from(new Set(variantImageUrls));

    const initial = uniqueVariantImages.length > 0
      ? uniqueVariantImages
      : (product.images && product.images.length > 0)
        ? product.images.map((img: any) => (typeof img === 'string' ? img : img.url))
        : [product.image];

    setImages(initial);
    setSelectedImage(0);

    // Initialize selected options ONCE per product id.
    if (product.options && product.options.length > 0 && lastInitializedProductIdRef.current !== product.id) {
      const variantIdFromUrl = searchParams.get('variant');
      const initialOptions: Record<string, string> = {};

      if (variantIdFromUrl && product.variants) {
        const variantFromUrl = product.variants.find((v: any) => v.id === variantIdFromUrl);
        if (variantFromUrl && Array.isArray(variantFromUrl.selectedOptions)) {
          variantFromUrl.selectedOptions.forEach((so: any) => {
            initialOptions[so.name] = so.value;
              });
            }
          }
          
      // Fallback to first values only for options not provided by URL
      product.options.forEach((option: any) => {
        if (!initialOptions[option.name] && option.values && option.values.length > 0) {
          initialOptions[option.name] = option.values[0];
        }
      });

      setSelectedOptions(initialOptions);
      lastInitializedProductIdRef.current = product.id;
    }

    // Create and preload all images
    const preloadPromises = initial.map((url: string, index: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          imageCache.current.set(url, img);
          // Set first image as ready immediately
          if (index === 0) {
            setIsImagesReady(true);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    });

    // All images loaded
    Promise.all(preloadPromises).then(() => {
      console.log('✅ All images preloaded');
    });
  }, [product?.id]);

  // Handle variant changes with instant switching and URL update
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;
    
    const variant = product.variants.find((v: any) => {
      if (!v.selectedOptions || v.selectedOptions.length === 0) return false;
      return v.selectedOptions.every((so: any) => selectedOptions[so.name] === so.value);
    }) || product.variants[0];
    
    if (variant?.imageUrl) {
      const existingIdx = images.findIndex(url => url === variant.imageUrl);
      if (existingIdx >= 0 && existingIdx !== selectedImage) {
        // Instant switch using cached image
        setSelectedImage(existingIdx);
        
        // Update main image using cached element
        if (mainImageRef.current && imageCache.current.has(images[existingIdx])) {
          const cachedImg = imageCache.current.get(images[existingIdx])!;
          const displayImg = mainImageRef.current.querySelector('img');
          if (displayImg) {
            displayImg.src = cachedImg.src;
          }
        }
      }
    }
    
    // Update URL with variant ID only if it changed
    if (variant && resolvedParams) {
      const currentVariantId = searchParams.get('variant');
      if (currentVariantId !== variant.id) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        router.push(url.pathname + url.search, { scroll: false });
      }
    }
  }, [selectedOptions, product?.variants, images, selectedImage, resolvedParams, router, searchParams]);

  if (!resolvedParams) {
    return <ProductPageSkeleton />;
  }

  // Show skeleton while Shopify data or images are loading
  if ((isLoadingShopify && !mockProduct) || !isImagesReady) {
    return <ProductPageSkeleton />;
  }

  // After loading, if no product found -> 404
  if (!product) {
    notFound();
  }

  // Compute selected variant
  const selectedVariant = product.variants?.find((v: any) => 
    v.selectedOptions?.every((so: any) => selectedOptions[so.name] === so.value)
  ) || product.variants?.[0];

  const hasDiscount = !!(selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price);
  const discountPercentage = hasDiscount
    ? Math.round(((selectedVariant!.compareAtPrice! - (selectedVariant!.price)) / selectedVariant!.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    // Conform to Product type expected by cart store
    const productForCart: Product = {
      ...product,
      id: selectedVariant?.id || product.id,
      price: selectedVariant?.price || product.price,
      image: images[selectedImage] || product.image,
    };
    addToCart(productForCart);
    if (quantity > 1) {
      updateQuantity(productForCart.id, quantity);
    }
  };

  const relatedProducts = shopifyProducts.length > 0 
    ? shopifyProducts.filter(p => p.id !== product.id).slice(0, 4)
    : mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gray-900">Home</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/products" className="hover:text-gray-900">Producten</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 line-clamp-1">{product?.name}</li>
            </ol>
          </nav>
      </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div ref={mainImageRef} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Seasonal Deal Badge on image (top-right) */}
              <span
                className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#FD8B51', color: '#ffffff' }}
              >
                Herfst deals
              </span>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.slice(0, 6).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    // Instant update using cached image
                    if (mainImageRef.current && imageCache.current.has(image)) {
                      const displayImg = mainImageRef.current.querySelector('img');
                      if (displayImg) {
                        displayImg.src = image;
                      }
                    }
                  }}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Gratis verzending</p>
                  <p className="text-sm text-gray-600">Bij bestellingen boven €50</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">2 jaar garantie</p>
                  <p className="text-sm text-gray-600">Volledige fabrieksgarantie</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RotateCcw className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                  <p className="font-medium text-gray-900">30 dagen retour</p>
                  <p className="text-sm text-gray-600">Niet goed? Geld terug</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div id="sticky-content" className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">
              {/* Title & Price */}
            <div>
                {/* Trustpilot Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <img 
                    src="/trustpilot stars.png" 
                    alt="Trustpilot rating" 
                    className="h-5"
                  />
                  <span className="text-sm text-gray-600">(127 reviews)</span>
            </div>

                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                      <p className="text-2xl text-gray-500 line-through">
                        €{selectedVariant.compareAtPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-gray-900">
                      €{(selectedVariant?.price || product.price).toFixed(2)}
                    </p>
                    {hasDiscount && (
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: '#FD8B51', color: '#ffffff' }}
                        title={`${discountPercentage}% korting`}
                      >
                        {discountPercentage}% korting
                      </span>
                    )}
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">incl. btw</p>

                {/* Shipping & Warranty Info */}
                <div className="mt-4 flex items-center gap-6 py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Truck className="w-4 h-4" />
                    <span>Gratis verzending</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RotateCcw className="w-4 h-4" />
                    <span>30 dagen uitproberen</span>
              </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Shield className="w-4 h-4" />
                    <span>5 jaar garantie</span>
              </div>
            </div>

                
              </div>

              {/* Description */}
              <div className="text-gray-600">
                <p className={`text-sm leading-relaxed ${!showFullDescription ? 'line-clamp-2' : ''}`}>
                  {product.description}
                </p>
                {product.description && product.description.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 mt-1 underline"
                  >
                    {showFullDescription ? 'Minder tonen' : 'Meer tonen'}
                  </button>
                )}
              </div>

              {/* Sustainability banner */}
              <div className="mt-3 rounded-lg px-4 py-3 text-sm flex items-center gap-2" style={{ backgroundColor: '#e1e9e2', color: '#265125' }}>
                <Sprout className="w-4 h-4" style={{ color: '#265125' }} />
                <span>
                  Kies een bureau en wij planten 1 boom met Tree‑Nation.
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setShowTreeInfo(true); }}
                    className="ml-1 underline"
                    style={{ color: '#265125' }}
                  >
                    Meer informatie
                  </a>
                </span>
              </div>
              {showTreeInfo && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  role="dialog"
                  aria-modal="true"
                >
                  <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setShowTreeInfo(false)}
                  />
                  <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
                    <div className="p-5 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <Sprout className="w-5 h-5" />
                        <span>Tree‑Nation</span>
                      </div>
                      <button
                        aria-label="Sluiten"
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => setShowTreeInfo(false)}
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4 text-gray-700">
                      <h3 className="text-xl font-bold text-gray-900">Laten we samen 1 miljard bomen planten</h3>
                      <p>
                        Comfort dat werkt. Impact die blijft. Samen met Tree‑Nation dragen we bij aan
                        wereldwijde herbebossingsprojecten om bossen te herstellen, CO2 te verminderen
                        en lokale gemeenschappen te steunen.
                      </p>
                      <p>
                        Voor elk verkocht bureau planten wij 1 boom. Elke boom die we planten kun je volgen;
                        je ontvangt een certificaat en projectdetails zodat je het verschil dat jouw aankoop
                        maakt, kunt meten.
                      </p>
                      <p>
                        Zo bouwen we samen aan een duurzamere toekomst –  één bureau en één boom tegelijk.
                      </p>
                    </div>
                    <div className="p-5 border-t flex justify-end">
                      <button
                        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() => setShowTreeInfo(false)}
                      >
                        Sluiten
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Options */}
              {product.options && product.options.map((option: any) => {
                const lowerName = option.name.toLowerCase();
                const isColorOption = lowerName.includes('kleur') || lowerName.includes('color');
                const isSizeOption = lowerName.includes('grootte') || lowerName.includes('size') || lowerName.includes('maat');

                return (
                  <div key={option.name} className={(isColorOption || isSizeOption) ? "border border-gray-200 rounded-lg p-3" : ""}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-900">{option.name}:</span>
                      <span className="text-sm text-gray-600">{selectedOptions[option.name]}</span>
                    </div>
                    <div className={isColorOption ? "flex gap-3" : "grid grid-cols-4 gap-2"}>
                      {option.values.map((value: string, index: number) => {
                        if (isColorOption) {
                          const colorMap: Record<string, string> = {
                            'Wit': '#FFFFFF',
                            'Zwart': '#000000',
                            'Grijs': '#6B7280',
                            'Gray': '#6B7280',
                            'Black': '#000000',
                            'White': '#FFFFFF',
                            'Eiken': '#C4915C',
                            'Walnoot': '#5D4E37',
                            'Beige': '#F5DEB3',
                            'Bruin': '#8B4513',
                            'Groen': '#4A5F4E',
                            'Blauw': '#3B82F6',
                            'Roze': '#FFC0CB'
                          };
                          const bgColor = colorMap[value] || '#E5E7EB';
                          return (
                            <button
                              key={value}
                              onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                              className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedOptions[option.name] === value ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-400'}`}
                              style={{ backgroundColor: bgColor }}
                              title={value}
                            >
                              {selectedOptions[option.name] === value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className={`w-5 h-5 ${bgColor === '#FFFFFF' || bgColor === '#F5DEB3' ? 'text-gray-900' : 'text-white'}`} />
                                </div>
                              )}
                            </button>
                          );
                        }

                        const middleIdx = Math.floor(option.values.length / 2);
                        return (
                          <div key={value} className="relative flex justify-center">
                            {isSizeOption && index === middleIdx && (
                              <span
                                className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold text-white rounded"
                                style={{ backgroundColor: '#fe8b51' }}
                              >
                                Bestseller
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                              className={`mt-2 px-3 py-2 text-sm rounded-lg border transition-all ${selectedOptions[option.name] === value ? (isSizeOption ? 'border-gray-900' : 'border-gray-900 bg-gray-900 text-white') : 'border-gray-300 hover:border-gray-400'}`}
                            >
                              {value}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity */}
              <div>
                <span className="text-sm font-medium text-gray-900 mb-2 block">Aantal</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-gray-900 text-white px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Toevoegen aan winkelwagen</span>
                  </button>
                </div>
                {deliveryText && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-700" style={{ color: '#265125' }}>
                    <Truck className="w-4 h-4" style={{ color: '#265125' }} />
                    <span><strong>Gratis verzending!</strong> {deliveryText}</span>
                  </div>
                )}
              </div>

              {/* Variant Info */}
              {selectedVariant && (
                <div className="text-sm text-gray-600">
                  <p>Variant: {selectedVariant.title}</p>
                  <p>Beschikbaar: {selectedVariant.available ? 'Ja' : 'Nee'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Wat onze klanten zeggen</h2>
            
            {/* Review Summary */}
            <div className="flex items-center justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Gebaseerd op 127 reviews</p>
              </div>
            </div>
            
            {/* Sample Reviews */}
            <div className="grid gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Jan de Vries</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 dagen geleden</span>
                </div>
                <p className="text-gray-700">Uitstekende kwaliteit bureau! De hoogteverstelling werkt soepel en het bureau is zeer stabiel. Blij met mijn aankoop.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Maria Jansen</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 week geleden</span>
                </div>
                <p className="text-gray-700">Mooi bureau, goede prijs-kwaliteit verhouding. Levering was snel en de montage was eenvoudig.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Peter van Dijk</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 weken geleden</span>
                </div>
                <p className="text-gray-700">Top bureau! Gebruik het nu al een maand voor thuiswerken. De elektrische verstelling is een game changer voor mijn rug.</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="text-sm font-medium text-gray-900 hover:text-gray-700 underline">
                Bekijk alle reviews
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 border-gray-900 font-medium text-gray-900">
                Productdetails
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                Specificaties
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                Reviews
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            <div className="prose max-w-none">
              <h3>Over dit product</h3>
              <p>{product.description}</p>
              <h3>Kenmerken</h3>
              <ul>
                <li>Hoogwaardige materialen</li>
                <li>Duurzaam en lang meegaand</li>
                <li>Modern design</li>
                <li>Eenvoudig te onderhouden</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Vergelijkbare producten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
            <div className="flex space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
