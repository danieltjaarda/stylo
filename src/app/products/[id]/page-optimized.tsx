'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, Minus, Plus, X, Waves, Flame } from 'lucide-react';
// import { mockProducts } from '@/data/products'; // Removed - using Shopify data only
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
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState({ massage: false, verwarming: false });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  // Always call useEffect - never conditionally
  useEffect(() => {
    Promise.resolve(params).then(setResolvedParams);
  }, [params]);

  // Load Shopify products
  useEffect(() => {
    const loadShopifyProducts = async () => {
      setIsLoadingShopify(true);
      try {
        const products = await getShopifyProducts(10);
        setShopifyProducts(products);
      } catch (error) {
        console.error('Error loading Shopify products:', error);
      } finally {
        setIsLoadingShopify(false);
      }
    };
    loadShopifyProducts();
  }, []);

  // Scroll handling
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

  // Map simple IDs to products
  const product = resolvedParams ? (() => {
    if (resolvedParams.id === '1' && shopifyProducts.length > 0) {
      return shopifyProducts[0];
    }
    // Get product from Shopify instead of mock data
    const products = await getShopifyProducts();
    return products.find(p => p.id === resolvedParams.id);
  })() : null;
  
  // Initialize and preload images when product data is available
  useEffect(() => {
    if (!product) return;
    const variantImageUrls = (product.variants || [])
      .map(v => v.imageUrl)
      .filter((u): u is string => Boolean(u));
    const uniqueVariantImages = Array.from(new Set(variantImageUrls));

    const initial = uniqueVariantImages.length > 0
      ? uniqueVariantImages
      : (product.images && product.images.length > 0)
        ? product.images.map(img => (typeof img === 'string' ? img : img.url))
        : [product.image];

    setImages(initial);
    setSelectedImage(0);
    
    // Preload ALL variant images in parallel for instant switching
    console.log('🚀 Preloading all', initial.length, 'variant images...');
    // Preload images
    const preloadPromises = initial.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    });
    
    Promise.all(preloadPromises).then(() => {
      console.log('✅ All variant images preloaded');
      setAllImagesPreloaded(true);
    });
  }, [product?.id]);

  // Switch main image when variant changes
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;
    const variant = (
      product.variants.find(v => {
        if (!v.selectedOptions || v.selectedOptions.length === 0) return false;
        return v.selectedOptions.every(so => selectedOptions[so.name] === so.value);
      }) || product.variants[0]
    );
    if (variant?.imageUrl) {
      const existingIdx = images.findIndex(url => url === variant.imageUrl);
      if (existingIdx >= 0 && existingIdx !== selectedImage) {
        // Only show loading if image isn't preloaded
        // Always switch immediately (assuming images are preloaded)
        setIsPreviewLoading(true);
        setSelectedImage(existingIdx);
      }
    }
  }, [selectedOptions, product?.variants, images, selectedImage]);
  
  // Show skeleton loader while loading
  if (!resolvedParams || isLoadingShopify || !product) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Skeleton */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="text-sm">
              <ol className="flex items-center space-x-2">
                <li><div className="h-4 w-12 rounded animate-shimmer"></div></li>
                <li className="text-gray-400">/</li>
                <li><div className="h-4 w-24 rounded animate-shimmer"></div></li>
                <li className="text-gray-400">/</li>
                <li><div className="h-4 w-32 rounded animate-shimmer"></div></li>
              </ol>
            </nav>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl animate-shimmer"></div>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg flex-shrink-0 animate-shimmer" />
                ))}
              </div>
            </div>
            
            {/* Right Side - Content Skeleton */}
            <div className="space-y-6">
              <div className="h-10 w-3/4 rounded animate-shimmer"></div>
              <div className="h-6 w-1/2 rounded animate-shimmer"></div>
              <div className="h-4 w-full rounded animate-shimmer"></div>
              <div className="h-4 w-3/4 rounded animate-shimmer"></div>
              <div className="h-16 w-full rounded animate-shimmer"></div>
              <div className="h-12 w-full rounded animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const colors = ['bg-gray-800', 'bg-blue-900', 'bg-zinc-700'];
  const sizes = ['Klein (1.5m)', 'Medium (1.8m)', 'Groot (2.1m)'];
  const relatedProducts = shopifyProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Compute selected variant (once) for consistency
  const selectedVariant = product.variants?.find(v => {
    if (!v.selectedOptions || v.selectedOptions.length === 0) return false;
    return v.selectedOptions.every(so => selectedOptions[so.name] === so.value);
  }) || product.variants?.[0];

  const getFeaturePrice = () => {
    let price = 0;
    if (selectedFeatures.massage) price += 150;
    if (selectedFeatures.verwarming) price += 100;
    return price;
  };

  const getVariantPrice = () => {
    return selectedVariant?.price || product.price;
  };

  const getTotalPrice = () => {
    return getVariantPrice() + getFeaturePrice();
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    const variantTitle = selectedVariant.selectedOptions
      ?.map(opt => opt.value)
      .join(' / ') || '';
    
    const productToAdd = {
      ...product,
      id: selectedVariant.id,
      name: `${product.name} - ${variantTitle}`,
      price: getTotalPrice(),
      image: images[selectedImage] || product.image
    };
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }
    
    setShowPaymentModal(true);
    
    setTimeout(() => {
      setShowPaymentModal(false);
    }, 3000);
  };

  const handleImageClick = (index: number) => {
    // Always show loading briefly for smooth transition
    setIsPreviewLoading(true);
    setSelectedImage(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
              <li className="text-gray-400">/</li>
              <li><a href="/products" className="text-gray-500 hover:text-gray-700">Stoelen</a></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Images */}
          <div className="space-y-4 lg:sticky lg:top-8 lg:h-fit">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              {/* Optimized main image with fade transition */}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
                style={{ opacity: isPreviewLoading ? 0 : 1 }}
                onLoad={() => setIsPreviewLoading(false)}
              />
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm">Afbeelding laden...</p>
                  </div>
                </div>
              )}
              
              {/* Feature Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {false && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Nieuw
                  </span>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm block">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>
              
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {(images.slice(0, 6)).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Side - Product Info */}
          <div ref={productInfoRef} className="space-y-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-4">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">(127 reviews)</span>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">€{getTotalPrice()}</span>
              {product.compareAtPrice && product.compareAtPrice > getTotalPrice() && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    €{product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold">Bespaar {Math.round(((product.compareAtPrice - getTotalPrice()) / product.compareAtPrice) * 100)}%</span>
                </>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            
            {/* Dynamic Variant Options */}
            {product.options && product.options.map((option, optIdx) => (
              <div key={option.name}>
                <h3 className="text-sm font-medium text-gray-900 mb-3">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((val, valIdx) => {
                    // Find variant for this option value
                    const variantForOption = product.variants?.find(v => 
                      v.selectedOptions?.some(so => so.name === option.name && so.value === val)
                    );
                    
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          setSelectedOptions(prev => ({ ...prev, [option.name]: val }));
                        }}
                        onMouseEnter={() => {
                          // Preload on hover
                          if (variantForOption?.imageUrl) {
                            // Preload image
                            const img = new Image();
                            img.src = variantForOption.imageUrl;
                          }
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedOptions[option.name] === val
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Features */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Extra Functies</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.massage}
                      onChange={(e) => setSelectedFeatures({...selectedFeatures, massage: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        Massagefunctie
                      </span>
                      <span className="text-sm text-gray-500">8 massagepunten met verwarming</span>
                    </div>
                  </div>
                  <span className="font-medium">+€150</span>
                </label>
                
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.verwarming}
                      onChange={(e) => setSelectedFeatures({...selectedFeatures, verwarming: e.target.checked})}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        Stoelverwarming
                      </span>
                      <span className="text-sm text-gray-500">3 warmtestanden</span>
                    </div>
                  </div>
                  <span className="font-medium">+€100</span>
                </label>
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.available}
                className="flex-1 bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedVariant?.available ? 'Toevoegen aan winkelwagen' : 'Uitverkocht'}
              </button>
            </div>
            
            {/* Shipping Info */}
            <div className="border-t pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Gratis verzending</p>
                  <p className="text-sm text-gray-600">Bij bestellingen boven €500</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">2 jaar garantie</p>
                  <p className="text-sm text-gray-600">Volledige dekking op alle onderdelen</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">30 dagen retourrecht</p>
                  <p className="text-sm text-gray-600">Niet tevreden? Geld terug!</p>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="border-t pt-8">
              <h3 className="font-medium text-gray-900 mb-4">Productdetails</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Materiaal</dt>
                  <dd className="font-medium">Premium kunstleer</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Kleur</dt>
                  <dd className="font-medium">Zwart</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Afmetingen</dt>
                  <dd className="font-medium">75 x 70 x 110-120 cm</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Gewicht</dt>
                  <dd className="font-medium">25 kg</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Max. belasting</dt>
                  <dd className="font-medium">150 kg</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Vergelijkbare Producten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
      
      {/* Payment Success Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Toegevoegd aan winkelwagen!</h3>
              <p className="text-gray-600">{product.name} is toegevoegd aan je winkelwagen.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
