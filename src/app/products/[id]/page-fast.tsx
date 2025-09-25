'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, Minus, Plus, X, Waves, Flame } from 'lucide-react';
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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [isImagesReady, setIsImagesReady] = useState(false);
  const addToCart = useCartStore(state => state.addItem);

  // Pre-created image elements for instant switching
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const mainImageRef = useRef<HTMLDivElement>(null);

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

  // Initialize and preload all images
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

    // Create and preload all images
    const preloadPromises = initial.map((url, index) => {
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
  }, [resolvedParams?.id]);

  if (!resolvedParams) {
    return <ProductPageSkeleton />;
  }

  // Find product in mock products or Shopify products
  // No mock products - only use Shopify products
  const shopifyProduct = shopifyProducts.find(p => p.id === resolvedParams.id || p.id.includes(resolvedParams.id));
  const product = shopifyProduct;

  // Handle variant changes with instant switching
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;
    
    const variant = product.variants.find(v => {
      if (!v.selectedOptions || v.selectedOptions.length === 0) return false;
      return v.selectedOptions.every(so => selectedOptions[so.name] === so.value);
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
  }, [selectedOptions, product?.variants, images, selectedImage]);

  if (!product) {
    notFound();
  }

  // Show skeleton while Shopify data or images are loading
  if (isLoadingShopify || !isImagesReady) {
    return <ProductPageSkeleton />;
  }

  // Compute selected variant
  const selectedVariant = product.variants?.find(v => 
    v.selectedOptions?.every(so => selectedOptions[so.name] === so.value)
  ) || product.variants?.[0];

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      id: selectedVariant?.id || product.id,
      price: selectedVariant?.price || product.price,
      image: images[selectedImage] || product.image,
      variantTitle: selectedVariant?.title || '',
    };
    
    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
  };

  const relatedProducts = shopifyProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900">
                    €{(selectedVariant?.price || product.price).toFixed(2)}
                  </p>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-gray-600">
                <p>{product.description}</p>
              </div>

              {/* Dynamic Options */}
              {product.options && product.options.map((option) => (
                <div key={option.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{option.name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSelectedOptions(prev => ({ ...prev, [option.name]: value }));
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          selectedOptions[option.name] === value
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <span className="text-sm font-medium text-gray-900 mb-2 block">Aantal</span>
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
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Toevoegen aan winkelwagen</span>
              </button>

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
