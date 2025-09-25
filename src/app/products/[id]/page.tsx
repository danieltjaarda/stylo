'use client';

import { useState, useEffect, useRef, Fragment, use } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, Minus, Plus, X, Waves, Flame, Sprout, ChevronDown, Info } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ProductCard';
import ProductCollection from '@/components/ProductCollection';
import WidgetsSection from '@/components/WidgetsSection';
import KlarnaWidget from '@/components/KlarnaWidget';
import ProductInfoModal from '@/components/ProductInfoModal';
import AddOnModal from '@/components/AddOnModal';
import { getShopifyProducts } from '@/services/shopifyService';
import { Product } from '@/types';
import { useMarketingConsent } from '@/contexts/CookieConsentContext';
import { useMetaPixelTracking } from '@/lib/metaPixel';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [userSelectedImage, setUserSelectedImage] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showTreeNationModal, setShowTreeNationModal] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState<{[key: string]: boolean}>({});
  const [currentInspirationSlide, setCurrentInspirationSlide] = useState(0);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const lastInitializedProductIdRef = useRef<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isImagesReady, setIsImagesReady] = useState(false);
  const viewContentTrackedRef = useRef<string | null>(null);
  const addToCart = useCartStore(state => state.addItem);
  const addToCartSilent = useCartStore(state => state.addItemSilent);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  
  // Meta Pixel tracking
  const hasMarketingConsent = useMarketingConsent();
  const { trackViewContent, trackAddToCart } = useMetaPixelTracking(hasMarketingConsent);
  const [showTreeInfo, setShowTreeInfo] = useState(false);
  const [seatProErgonomicsOpen, setSeatProErgonomicsOpen] = useState(false);
  const [seatProMaterialsOpen, setSeatProMaterialsOpen] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [showProductInfoModal, setShowProductInfoModal] = useState(false);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>('');
  const [selectedAddOnHandle, setSelectedAddOnHandle] = useState<string>('');
  const [addedAddOns, setAddedAddOns] = useState<Record<string, boolean>>({});
    const imageCache = useRef(new Map());
  const mainImageRef = useRef<HTMLDivElement>(null);

  // No longer need to resolve params - use(params) handles it directly

  // Load Shopify products
  useEffect(() => {
    const loadShopifyProducts = async () => {
      setIsLoadingShopify(true);
      try {
        const products = await getShopifyProducts(20);
        setShopifyProducts(products);
      } catch (error) {
        console.error('Error loading Shopify products:', error);
        setShopifyProducts([]);
      } finally {
        setIsLoadingShopify(false);
      }
    };

    loadShopifyProducts();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mainImageRef.current) {
        const rect = mainImageRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          // Image is visible
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Product lookup with decoding for URL-encoded IDs
  const routeId = resolvedParams?.id || '';
  const decodedRouteId = routeId ? decodeURIComponent(routeId) : '';
  
  // No more mock products - only use Shopify products
  const shopifyProduct = resolvedParams
    ? shopifyProducts.find(p =>
        p.handle === decodedRouteId ||
        p.id === decodedRouteId ||
        p.id === routeId ||
        p.id.includes(decodedRouteId)
      )
    : undefined;
  const product = shopifyProduct;

  // Track ViewContent when product loads AND when variant changes (standard e-commerce behavior)
  useEffect(() => {
    if (product && hasMarketingConsent) {
      const selectedVariant = product.variants?.find((v: any) => 
        v.selectedOptions?.every((so: any) => selectedOptions[so.name] === so.value)
      ) || product.variants?.[0];

      // Create unique key including variant to allow tracking variant changes
      const variantKey = selectedVariant?.id || 'default';
      const productVariantKey = `${product.id || product.handle}_${variantKey}`;
      
      // Track ViewContent for each product + variant combination
      if (viewContentTrackedRef.current !== productVariantKey) {
        console.log(`👁️ ViewContent - Tracking product: ${product.handle || product.id}, variant: ${variantKey}`);
        
        trackViewContent({
          content_type: 'product',
          content_ids: [product.id?.toString() || product.handle || ''],
          content_name: (product as any).title || product.handle || 'Product',
          content_category: (product as any).productType || 'Product',
          value: parseFloat((selectedVariant?.price as any)?.amount || (typeof product.price === 'string' ? product.price : product.price?.toString()) || '0'),
          currency: (selectedVariant?.price as any)?.currencyCode || 'EUR',
        });
        
        // Mark this product + variant combination as tracked
        viewContentTrackedRef.current = productVariantKey;
      } else {
        console.log(`👁️ ViewContent - Already tracked for product: ${product.handle}, variant: ${variantKey}`);
      }
    }
  }, [product, hasMarketingConsent, selectedOptions, trackViewContent]);

  // Initialize and preload all images, and initialize selectedOptions once per product
  useEffect(() => {
    if (!product) return;
    
    // Collect all unique images from product and variants
    const productImages = (product.images && product.images.length > 0)
      ? product.images.map((img: any) => (typeof img === 'string' ? img : img.url))
      : [];
    
    // Get variant images with proper structure handling
    const variantImageUrls = (product.variants || [])
      .map((v: any) => {
        // Handle both new structure (v.image.url) and legacy (v.imageUrl)
        if (v.image && v.image.url) return v.image.url;
        if (v.imageUrl) return v.imageUrl;
        if (typeof v.image === 'string') return v.image;
        return null;
      })
      .filter((u: string | null): u is string => Boolean(u));
    
    const uniqueVariantImages = Array.from(new Set(variantImageUrls));
    
    // Combine product images with variant images, prioritizing product images
    const allImages = [...productImages];
    uniqueVariantImages.forEach(variantImg => {
      if (!allImages.includes(variantImg)) {
        allImages.push(variantImg);
      }
    });
    
    // Fallback to product.image if no images found
    const initial = allImages.length > 0 ? allImages : [product.image].filter(Boolean);
    
    console.log(`🖼️ Initialized ${initial.length} images for product:`, initial);
    console.log(`📦 Product images: ${productImages.length}, Variant images: ${uniqueVariantImages.length}`);

    setImages(initial);
    setSelectedImage(0);
    setUserSelectedImage(false); // Reset when product changes

    // Initialize selected options ONCE per product id.
    if (product.options && product.options.length > 0 && lastInitializedProductIdRef.current !== product.id) {
      const variantIdFromUrl = searchParams.get('variant');
      const initialOptions: Record<string, string> = {};

      if (variantIdFromUrl && product.variants) {
        // Support both short ID (55607043916100) and full GID (gid://shopify/ProductVariant/55607043916100)
        const variantFromUrl = product.variants.find((v: any) => 
          v.id === variantIdFromUrl || v.id.split('/').pop() === variantIdFromUrl
        );
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

  // Handle variant changes with proper image switching
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) return;
    
    const variant = product.variants.find((v: any) => {
      if (!v.selectedOptions || v.selectedOptions.length === 0) return false;
      return v.selectedOptions.every((so: any) => selectedOptions[so.name] === so.value);
    }) || product.variants[0];
    
    // Only auto-switch image if user hasn't manually selected one
    if (!userSelectedImage) {
      let targetImageIndex = -1;
      
      // PRIORITY 1: Use variant's specific image if available
      if (variant && (variant as any).image && (variant as any).image.url) {
        targetImageIndex = images.findIndex(img => img === (variant as any).image.url);
        console.log(`🎯 Found variant-specific image: ${(variant as any).image.url} at index ${targetImageIndex}`);
      }
      
      // PRIORITY 2: Use legacy imageUrl property if available
      if (targetImageIndex === -1 && variant && variant.imageUrl) {
        targetImageIndex = images.findIndex(img => img === variant.imageUrl);
        console.log(`🎯 Found variant imageUrl: ${variant.imageUrl} at index ${targetImageIndex}`);
      }
      
      // PRIORITY 3: Smart mapping based on variant options (only if no specific variant image)
      if (targetImageIndex === -1 && images.length > 1) {
        const frameColor = selectedOptions['Frame kleur'] || selectedOptions['Frame color'] || '';
        const tableTopColor = selectedOptions['Tafelblad kleur'] || selectedOptions['Tafelblad color'] || '';
        
        console.log(`🎨 Mapping based on options - Frame: "${frameColor}", Tabletop: "${tableTopColor}"`);
        
        // Simple and reliable mapping based on most common patterns
        if (frameColor.toLowerCase().includes('wit') || frameColor.toLowerCase().includes('white')) {
          targetImageIndex = 1; // White frame variants typically second image
        } else if (frameColor.toLowerCase().includes('grijs') || frameColor.toLowerCase().includes('gray')) {
          targetImageIndex = Math.min(2, images.length - 1); // Gray frame variants
        } else if (tableTopColor.toLowerCase().includes('walnoot') || tableTopColor.toLowerCase().includes('walnut')) {
          targetImageIndex = Math.min(3, images.length - 1); // Walnoot tabletop variants
        } else if (tableTopColor.toLowerCase().includes('wit') || tableTopColor.toLowerCase().includes('white')) {
          targetImageIndex = Math.min(4, images.length - 1); // White tabletop variants
        }
        
        // Ensure we don't exceed available images
        targetImageIndex = Math.min(targetImageIndex, images.length - 1);
        
        console.log(`🎨 Smart mapping result: index ${targetImageIndex} for Frame: "${frameColor}", Tabletop: "${tableTopColor}"`);
      }
      
      // Switch to the target image if found and different from current
      if (targetImageIndex !== -1 && targetImageIndex !== selectedImage && targetImageIndex < images.length) {
        console.log(`🖼️ Auto-switching to variant image: ${targetImageIndex} (variant: ${variant.title})`);
        setSelectedImage(targetImageIndex);
      } else if (targetImageIndex === -1) {
        console.log(`⚠️ No specific image found for variant: ${variant.title}, keeping current image`);
      }
    }

    // Update URL when variant changes (like Shopify does)
    const currentVariantId = searchParams.get('variant');
    // Extract just the numeric ID from the full GID (like Shopify)
    const shortVariantId = variant?.id?.split('/').pop() || '';
    
    if (variant && currentVariantId !== shortVariantId && currentVariantId !== variant.id) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('variant', shortVariantId);
      router.replace(newUrl.toString(), { scroll: false });
      console.log(`🔄 Variant URL updated to: ${shortVariantId} (Shopify-style behavior)`);
    }
  }, [selectedOptions, product?.variants, searchParams, images, selectedImage, router, userSelectedImage]);

  // resolvedParams is now always available since use(params) handles the Promise

  // Show skeleton while Shopify data or images are loading
  if (isLoadingShopify || !isImagesReady) {
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
    
    // Track AddToCart before adding to cart
    if (hasMarketingConsent) {
      console.log('🛒 AddToCart - Marketing consent:', hasMarketingConsent);
      console.log('🛒 AddToCart - Product:', product);
      
      const selectedVariant = product.variants?.find((v: any) => 
        v.selectedOptions?.every((so: any) => selectedOptions[so.name] === so.value)
      ) || product.variants?.[0];

      const trackingData = {
        content_type: 'product' as const,
        content_ids: [product.id?.toString() || product.handle || ''],
        content_name: (product as any).title || product.handle || 'Product',
        content_category: (product as any).productType || 'Product',
        value: parseFloat((selectedVariant?.price as any)?.amount || (typeof product.price === 'string' ? product.price : product.price?.toString()) || '0'),
        currency: (selectedVariant?.price as any)?.currencyCode || 'EUR',
        quantity: quantity,
      };
      
      console.log('🛒 AddToCart - Tracking data:', trackingData);
      trackAddToCart(trackingData);
    } else {
      console.log('❌ AddToCart - Not tracking, no marketing consent');
    }
    
    addToCart(productForCart);
    if (quantity > 1) {
      updateQuantity(productForCart.id, quantity);
    }
  };

  const handleAddOnQuantityChange = (addOnIndex: number, change: number) => {
    setSelectedAddOns(prev => {
      const current = prev[addOnIndex] || 1;
      const newQuantity = Math.max(1, current + change);
      return { ...prev, [addOnIndex]: newQuantity };
    });
  };

  const handleAddOnToCart = (addOn: any, addOnIndex: number) => {
    const addOnProduct: Product = {
      id: `addon-${addOnIndex}-${addOn.name?.replace(/\s+/g, '-').toLowerCase()}`,
      name: addOn.name,
      price: addOn.price || 0,
      image: addOn.image,
      description: `Add-on: ${addOn.name}`,
      category: 'add-on',
      stock: 999,
      rating: 0,
      reviews: 0
    };
    
    const quantity = selectedAddOns[addOnIndex] || 1;
    addToCartSilent(addOnProduct);
    if (quantity > 1) {
      updateQuantity(addOnProduct.id, quantity);
    }

    // Mark as added permanently
    setAddedAddOns(prev => ({ ...prev, [addOnIndex]: true }));
  };

  const handleOpenAddOnModal = (addOn: any) => {
    console.log('🔍 Opening add-on modal for:', addOn);
    setSelectedAddOnId(addOn.id || '');
    setSelectedAddOnHandle(addOn.handle || '');
    setShowAddOnModal(true);
  };

  const handleAddOnProductAdded = (addOnId: string, addOnHandle?: string) => {
    console.log('✅ Add-on product added via modal:', { addOnId, addOnHandle });
    
    // Find the index of the add-on in the current product's add-ons
    if (product?.addOns) {
      const addOnIndex = product.addOns.findIndex((addOn: any) => 
        addOn.id === addOnId || addOn.handle === addOnHandle
      );
      
      if (addOnIndex !== -1) {
        setAddedAddOns(prev => ({ ...prev, [addOnIndex]: true }));
      }
    }
  };

  const relatedProducts = shopifyProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Generate review count based on product ID (consistent with ProductCollection)
  const reviewCounts = [127, 89, 203, 156, 94, 178, 112, 145];
  const productIndex = shopifyProducts.findIndex(p => p.id === product.id);
  const reviewCount = productIndex >= 0 ? reviewCounts[productIndex % reviewCounts.length] : 127;

  // Get delivery date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toLocaleDateString('nl-NL', { 
    day: 'numeric', 
    month: 'long' 
  });
  const deliveryMessage = `Morgen ${tomorrowDate} in huis!`;

    return (
      <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Producten
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs" title={(product as any)?.title || product?.name || 'Product'}>
                {(product as any)?.title || product?.name || 'Product'}
              </li>
              </ol>
            </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
            {/* Main Image */}
            <div ref={mainImageRef} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={(product as any)?.title || product?.name || 'Product'}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Herfst deals badge */}
              <span
                className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#FD8B51', color: '#ffffff' }}
              >
                Herfst deals
              </span>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log(`👆 User manually selected image: ${index}`);
                    setSelectedImage(index);
                    setUserSelectedImage(true);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${(product as any)?.title || product?.name || 'Product'} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
              </div>
              
          {/* Product Info */}
          <div className="space-y-6">
            {/* Trustpilot Rating */}
            <div className="flex items-center gap-2">
              <img 
                src="/trustpilot-stars-new.png" 
                alt="Trustpilot 5 sterren" 
                width={100} 
                height={20}
                className="h-5 w-auto"
              />
              <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
                </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{(product as any)?.title || product?.name || 'Product'}</h1>
                <button
                  onClick={() => setShowProductInfoModal(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                  title="Bekijk gedetailleerde product informatie"
                >
                  <Info className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                </button>
              </div>
              
              {/* Price Section */}
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
            </div>

            {/* Product Description */}
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

            {/* Tree-Nation Info Bar */}
            <div className="mt-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#e1e9e2', color: '#265125' }}>
              <Sprout className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                Kies een bureau en wij planten 1 boom met Tree‑Nation.{" "}
                <button onClick={() => setShowTreeNationModal(true)} className="underline font-medium" style={{ color: '#265125' }}>
                  Meer informatie
                </button>
              </p>
              </div>

            {/* Tree-Nation Modal */}
            {showTreeNationModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                  <button onClick={() => setShowTreeNationModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Over Tree-Nation</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Tree-Nation is een platform dat bedrijven en burgers in staat stelt om bomen te planten over de hele wereld.
                    Door samen te werken met verschillende herbebossingsprojecten, dragen ze bij aan het herstel van ecosystemen,
                    het bestrijden van klimaatverandering en het ondersteunen van lokale gemeenschappen.
                  </p>
                  <p className="text-gray-700 text-sm mb-4">
                    Elke keer dat je een bureau bij ons koopt, planten wij een boom via Tree-Nation. Zo draag je direct bij aan een groenere planeet!
                  </p>
                  <button onClick={() => setShowTreeNationModal(false)} className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
                    Sluiten
                  </button>
              </div>
              </div>
            )}

            {/* Dynamic Options - Only show if there are meaningful options */}
            {product.options && product.options.some((option: any) => !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title')) && 
              product.options
              .filter((option: any) => !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title'))
              .map((option: any) => {
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
                            onClick={() => {
                              console.log(`🎨 User selected color variant: ${option.name} = ${value}`);
                              setSelectedOptions(prev => ({ ...prev, [option.name]: value }));
                              setUserSelectedImage(false); // Allow auto-switching to variant image
                            }}
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
                            onClick={() => {
                              console.log(`📐 User selected variant option: ${option.name} = ${value}`);
                              setSelectedOptions(prev => ({ ...prev, [option.name]: value }));
                              setUserSelectedImage(false); // Allow auto-switching to variant image
                            }}
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

            {/* Add-ons Section */}
            {product.addOns && product.addOns.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Handige toevoegingen:</h3>
                
                {/* Mobile: Horizontal scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:hidden -mx-4 px-4">
                  {product.addOns.map((addOn: any, index: number) => (
                    <div key={`mobile-${index}`} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors flex-shrink-0 w-64">
                      {/* Add-on Image */}
                      <div className="relative mb-3">
                        <img
                          src={addOn.image}
                          alt={addOn.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {addOn.discount && (
                          <span
                            className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: '#FD8B51', color: '#ffffff' }}
                          >
                            -{addOn.discount}%
                          </span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(addOn.rating || 0) ? 'text-gray-300' : 'text-gray-300'}`}
                            style={{ color: i < Math.floor(addOn.rating || 0) ? '#2e572d' : undefined }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{addOn.rating || 0}</span>
                      </div>

                      {/* Add-on Name */}
                      <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-1" title={addOn.name}>{addOn.name}</h4>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {addOn.compareAtPrice && addOn.price && addOn.compareAtPrice > addOn.price && (
                          <span className="text-sm text-gray-500 line-through">
                            €{addOn.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          €{(addOn.price || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Controls and Add to Cart */}
                      <div className="space-y-3">
                        {/* Info Text */}
                        <div className="text-center">
                          <span className="text-xs text-gray-600">Klik 'Toevoegen' om opties te kiezen</span>
                        </div>

                        {/* Add to Cart Button - Opens Modal */}
                        <button
                          onClick={() => handleOpenAddOnModal(addOn)}
                          disabled={addedAddOns[index]}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
                            addedAddOns[index] 
                              ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default' 
                              : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900'
                          }`}
                        >
                          {addedAddOns[index] ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Toegevoegd</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              <span>Toevoegen</span>
                            </>
                          )}
                        </button>

                        {/* Details Button */}
                        <button 
                          onClick={() => handleOpenAddOnModal(addOn)}
                          className="w-full text-xs text-gray-600 hover:text-gray-900 underline"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.addOns.map((addOn: any, index: number) => (
                    <div key={`desktop-${index}`} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      {/* Add-on Image */}
                      <div className="relative mb-3">
                        <img
                          src={addOn.image}
                          alt={addOn.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {addOn.discount && (
                          <span
                            className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: '#FD8B51', color: '#ffffff' }}
                          >
                            -{addOn.discount}%
                          </span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(addOn.rating || 0) ? 'text-gray-300' : 'text-gray-300'}`}
                            style={{ color: i < Math.floor(addOn.rating || 0) ? '#2e572d' : undefined }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{addOn.rating || 0}</span>
                      </div>

                      {/* Add-on Name */}
                      <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-1" title={addOn.name}>{addOn.name}</h4>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {addOn.compareAtPrice && addOn.price && addOn.compareAtPrice > addOn.price && (
                          <span className="text-sm text-gray-500 line-through">
                            €{addOn.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          €{(addOn.price || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Controls and Add to Cart */}
                      <div className="space-y-3">
                        {/* Info Text */}
                        <div className="text-center">
                          <span className="text-xs text-gray-600">Klik 'Toevoegen' om opties te kiezen</span>
                        </div>

                        {/* Add to Cart Button - Opens Modal */}
                        <button
                          onClick={() => handleOpenAddOnModal(addOn)}
                          disabled={addedAddOns[index]}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
                            addedAddOns[index] 
                              ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default' 
                              : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900'
                          }`}
                        >
                          {addedAddOns[index] ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Toegevoegd</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              <span>Toevoegen</span>
                            </>
                          )}
                        </button>

                        {/* Details Button */}
                        <button 
                          onClick={() => handleOpenAddOnModal(addOn)}
                          className="w-full text-xs text-gray-600 hover:text-gray-900 underline"
                        >
                          Details
                        </button>
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
            )}

            {/* Shipping, Trial, Warranty */}
            <div className="flex items-center justify-between py-4 border-y border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Gratis verzending</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>30 dagen uitproberen</span>
              </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>5 jaar garantie</span>
            </div>
          </div>
        </div>

            {/* Quantity & Add to Cart Layout */}
            <div className="flex items-end gap-4 mt-6">
              {/* Quantity */}
              <div className="flex-shrink-0">
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
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Toevoegen aan winkelwagen</span>
              </button>
            </div>

            {/* Delivery Message */}
            <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#265125' }}>
              <Truck className="w-4 h-4 flex-shrink-0" />
              <p>
                <strong>Gratis verzending!</strong> {deliveryMessage}
              </p>
            </div>

            {/* Klarna Payment Widget */}
            <div className="mt-4">
              <KlarnaWidget price={selectedVariant?.price || product.price} />
            </div>
          </div>
        </div>

        {/* DeskOne Extended Sections */}
        {product.isDeskOne && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            
            {/* Eenvoudige bediening Section */}
            <section className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Eenvoudige bediening
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Met de intuïtieve touchscreenbediening kun je de hoogte van het bureau in centimeters veranderen en 3 voorkeursstanden opslaan voor snelle toegang.
                </p>
                
                {/* Main Video */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <video 
                    className="w-full h-[400px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/svg icons/videoframe_21189.png"
                  >
                    <source src="/svg icons/Bureau omhoog 2.0.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Intuïtief touchscreen</h3>
                    <p className="text-sm text-gray-600">1-touch aanpassingen met LCD scherm voor precieze hoogte</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">3 geheugenposities</h3>
                    <p className="text-sm text-gray-600">Sla tot 3 hoogteposities op voor snelle en eenvoudige toegang</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
        </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kinderslot</h3>
                    <p className="text-sm text-gray-600">Vergrendel je bureau voor extra veiligheid en voorkom per ongeluk aanpassingen</p>
      </div>
      
                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Programmeerbaar</h3>
                    <p className="text-sm text-gray-600">Stel hoogtemeters, aanpassingssnelheid, anti-botsingevoeligheid en meer in</p>
              </div>
            </div>
            </div>
          </section>

          {/* Betrouwbare prestaties Section */}
          <section className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Betrouwbare prestaties
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                De HomeOne tafel overtreft de hoogste normen op het gebied van prestaties en duurzaamheid. Hij is getest om de uitdagingen van dagelijks gebruik te weerstaan, waardoor hij de perfecte keuze is voor al je behoeften. De garantie van 5 jaar garandeert de superieure kwaliteit van ons product.
              </p>
              
              {/* Main Video */}
              <div className="rounded-2xl overflow-hidden mb-12">
                <video 
                  className="w-full h-[400px] object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/svg icons/videoframe_21189.png"
                >
                  <source src="/svg icons/pressure bureau.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Test Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Levensduurtest kolommen */}
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Levensduurtest kolommen
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Onze kolommen ondergaan een strenge test met 30.000 cycli op en neer. 
                    Deze test simuleert meerder 16 jaar waarin het bureau 5 keer per dag in 
                    hoogte wordt versteld om de duurzaamheid van de motor en de 
                    ondersteunende mechanische onderdelen te controleren.
                  </p>
                </div>

                {/* Levensduurtest van de motor */}
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Levensduurtest van de motor
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Onze dubbele elektromotoren zijn ontworpen om minstens 20.000 cycli 
                    van intensief gebruik te doorstaan. Hij die op neer beweging leveren 
                    ze optimale prestaties gedurende vele jaren.
                  </p>
                </div>

                {/* Verdeelde belastingstest */}
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Verdeelde belastingstest
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Er zijn tests uitgevoerd door 120 kg op het bureau te plaatsen om te 
                    controleren of het verstelbare bureau robuust genoeg is om zelfs de 
                    zwaarste multi-monitoropstellingen te verdragen. Het kan complexe 
                    belastingen aan zonder afbreuk te doen aan de prestaties.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table Section */}
          <section className="bg-white rounded-3xl p-4 md:p-8 lg:p-12 border">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-8 text-center">
              Hoe vergelijken wij?
            </h2>
            <p className="text-center text-gray-600 mb-6 md:mb-12 text-sm md:text-base">
              Welke keuzes heb je? Kijk hiervoor naar dit handige overzicht.
            </p>
            
            {/* Mobile Layout - Cards */}
            <div className="md:hidden space-y-4">
              {[
                { feature: 'Prijs', desktronic: '✓ De prijs houdt je niet aan je stoel gekluisterd', amazon: '✗ Goedkoop, maar je moet het volgend jaar vervangen', others: '✗ Tweede baan nodig om er één te betalen' },
                { feature: 'Stabiliteit', desktronic: '✓ Zo stabiel dat je er zelfs op kunt staan', amazon: '✗ Laat er geen vlieg op landen', others: '✓ Stabiel genoeg' },
                { feature: 'Geluidsniveau', desktronic: '✓ Fluisterstil - goedgekeurd door ninja\'s!', amazon: '✗ Daar gaat over vergaderd worden', others: '✗ Matig' },
                { feature: 'Tafelblad uit één stuk', desktronic: '✓ Naadloos, waterdicht en duurzaam', amazon: '✗ Puzzelstukjes met vuil verzamelende gaten', others: '✗ Duurzaam, maar verwacht niet te veel' },
                { feature: 'Twee-motorensysteem', desktronic: '✓ Standaard op alle modellen', amazon: '✗ Één motor - als een fiets met één pedaal', others: '✗ Alleen bij de premium modellen' }
              ].map((row, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-center">{row.feature}</h3>
                  
                  {/* DESKNA */}
                  <div className="bg-white rounded-lg p-3 mb-3 border-2 border-gray-900">
                    <div className="flex items-center mb-2">
                      <img src="/DESKNA LOGO BLACK.png" alt="DESKNA" className="h-4 mr-2" />
                      <span className="font-semibold text-sm">DESKNA</span>
                      <div className="ml-auto flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{row.desktronic}</p>
                  </div>
                  
                  {/* Competitors */}
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-xs text-gray-600 mb-1">Amazon merken</div>
                      <p className="text-xs text-gray-700">{row.amazon}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-xs text-gray-600 mb-1">Andere merken</div>
                      <p className="text-xs text-gray-700">{row.others}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Layout - Table */}
            <div className="hidden md:block max-w-5xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                  <div className="p-4"></div>
                  <div className="p-4 border-l border-gray-200">
                    <div className="text-center border-2 border-gray-900 rounded-lg p-3 bg-white">
                      <img 
                        src="/DESKNA LOGO BLACK.png" 
                        alt="DESKNA Logo" 
                        className="h-6 mx-auto mb-2"
                      />
                      <div className="text-xs text-gray-600 mb-2">De prijs houdt je niet aan je stoel gekluisterd</div>
                      <div className="flex justify-center items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-bold ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-l border-gray-200 text-center text-gray-600 font-medium">
                    <div>Merken op <strong>Amazon</strong></div>
                  </div>
                  <div className="p-4 border-l border-gray-200 text-center text-gray-600 font-medium">
                    <div><strong>Andere</strong> merken</div>
                  </div>
                </div>

                {/* Data Rows */}
                {[
                  { feature: 'Prijs', desktronic: '✓ De prijs houdt je niet aan je stoel gekluisterd', amazon: '✗ Goedkoop, maar je moet het volgend jaar vervangen', others: '✗ Tweede baan nodig om er één te betalen' },
                  { feature: 'Stabiliteit', desktronic: '✓ Zo stabiel dat je er zelfs op kunt staan', amazon: '✗ Laat er geen vlieg op landen', others: '✓ Stabiel genoeg' },
                  { feature: 'Geluidsniveau', desktronic: '✓ Fluisterstil - goedgekeurd door ninja\'s!', amazon: '✗ Daar gaat over vergaderd worden', others: '✗ Matig' },
                  { feature: 'Tafelblad uit één stuk', desktronic: '✓ Naadloos, waterdicht en duurzaam', amazon: '✗ Puzzelstukjes met vuil verzamelende gaten', others: '✗ Duurzaam, maar verwacht niet te veel' },
                  { feature: 'Twee-motorensysteem', desktronic: '✓ Standaard op alle modellen', amazon: '✗ Één motor - als een fiets met één pedaal', others: '✗ Alleen bij de premium modellen' },
                  { feature: 'Certificatie', desktronic: '✓ TÜV Rheinland & IGR keurmerken', amazon: '✗ Keurmerken?', others: '✓ Gewoon het gebruikelijke' },
                  { feature: 'Hefsnelheid', desktronic: '✓ ±50mm/s - binnen één oogwenk', amazon: '✗ ~18mm/s - alsof je verf ziet drogen', others: '✓ ±36mm/s - een medaille voor de tweede plaats' },
                  { feature: 'Retourbeleid', desktronic: '✓ Gratis en vrijblijvend', amazon: '✗ Veel succes daarmee', others: '✗ Maak je klaar om te onderhandelen' },
                  { feature: 'Klantenservice', desktronic: '✓ Wij zijn dol op 5-sterren-beoordelingen', amazon: '✗ Neem je geduld en een woordenboek mee!', others: '✓ Varieert, sommige zijn ok' }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 border-b border-gray-200 last:border-b-0">
                    <div className="p-4 font-medium text-gray-900 text-sm bg-white">
                      {row.feature}
                    </div>
                    <div className="p-4 border-l border-gray-200 text-left text-gray-900 text-sm bg-white">
                      {row.desktronic}
                    </div>
                    <div className="p-4 border-l border-gray-200 text-left text-gray-900 text-sm bg-white">
                      {row.amazon}
                    </div>
                    <div className="p-4 border-l border-gray-200 text-left text-gray-900 text-sm bg-white">
                      {row.others}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
            <section className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
                Technische specificaties
              </h2>
              
              <div className="max-w-4xl mx-auto">
                {/* General Information */}
                <div className="bg-white rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Algemene informatie</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <img 
                        src="/svg icons/technische specificaties.png" 
                        alt="Bureau technische specificaties"
                        className="w-full h-[200px] object-contain bg-gray-50 rounded-lg"
                      />
            </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Montage methode</span>
                          <div className="font-medium">Zelfmontage</div>
              </div>
                        <div>
                          <span className="text-gray-600">Montage</span>
                          <div className="font-medium">Eenvoudig, geen extra gereedschap nodig</div>
              </div>
                        <div>
                          <span className="text-gray-600">Gemiddelde montagetijd</span>
                          <div className="font-medium">30 minuten</div>
            </div>
            <div>
                          <span className="text-gray-600">Garantie</span>
                          <div className="font-medium">5 jaar</div>
              </div>
                        <div>
                          <span className="text-gray-600">Gratis retourneren</span>
                          <div className="font-medium">30 dagen</div>
                        </div>
                      </div>
                    </div>
              </div>
            </div>

                {/* Collapsible Sections */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedSpecs(prev => ({ ...prev, tafelblad: !prev.tafelblad }))}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Tafelblad specificaties</h3>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedSpecs.tafelblad ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {expandedSpecs.tafelblad && (
                      <div className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Image */}
                          <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden">
                              <img 
                                src="/svg icons/tafelblad specificaties.webp" 
                                alt="Tafelblad specificaties diagram"
                                className="w-full h-auto object-contain"
                              />
                            </div>
                            
                            {/* Size Options */}
                            <div className="text-center">
                              <div className="flex justify-center gap-2">
                                <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm">120x60 cm</span>
                                <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">140x70 cm</span>
                                <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">160x80 cm</span>
              </div>
                            </div>
                          </div>

                          {/* Right: Specifications */}
                          <div className="space-y-4 text-sm">
                            <div className="space-y-3">
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Afmetingen</span>
                                <span className="font-medium text-gray-900">120 cm L x 60 cm W x 2.5 cm H, 11.5 kg</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Afmetingen verzending</span>
                                <span className="font-medium text-gray-900">129.5 cm L x 69.8 cm W x 5 cm H, 15.5 kg</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Klassiek kleuren</span>
                                <span className="font-medium text-gray-900">Wit, Zwart, Eiken, Walnoot, Grijs</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Beperkte uitgave kleuren</span>
                                <span className="font-medium text-gray-900">Olijfgroen, Diepblauw, Zachtroze</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Materiaal</span>
                                <span className="font-medium text-gray-900">Warp-proof, gemelamineerd, spaanplaat</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedSpecs(prev => ({ ...prev, frame: !prev.frame }))}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Specificaties elektrisch frame</h3>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedSpecs.frame ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                        </div>
                    
                    {expandedSpecs.frame && (
                      <div className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Image */}
                          <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden">
                              <img 
                                src="/svg icons/Specificaties elektrisch frame.webp" 
                                alt="Elektrisch frame specificaties diagram"
                                className="w-full h-auto object-contain"
                              />
                      </div>
              </div>

                          {/* Right: Specifications */}
                          <div className="space-y-4 text-sm">
                            <div className="space-y-3">
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Type motor</span>
                                <span className="font-medium text-gray-900">Extra krachtig systeem met dubbele motor</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Hefsnelheid</span>
                                <span className="font-medium text-gray-900">30 mm/s</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Hefcapaciteit</span>
                                <span className="font-medium text-gray-900">Tot 120 kg</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Geluidsniveau</span>
                                <span className="font-medium text-gray-900">&lt;39 dB</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Hoogtebereik</span>
                                <span className="font-medium text-gray-900">70.2 cm - 118.5 cm</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Hoogtebereik (met 2.5 cm tafelblad)</span>
                                <span className="font-medium text-gray-900">72.7 cm - 122 cm</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Gewicht</span>
                                <span className="font-medium text-gray-900">29.2 kg</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Lengte framepoten</span>
                                <span className="font-medium text-gray-900">60 cm</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Materiaal</span>
                                <span className="font-medium text-gray-900">Hoogste kwaliteit staal</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Klassiek kleuren</span>
                                <span className="font-medium text-gray-900">Wit, Zwart, Grijs</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-gray-600">Beperkte uitgave kleuren</span>
                                <span className="font-medium text-gray-900">Olijfgroen, Diepblauw, Zachtroze</span>
                              </div>
                              <div className="flex justify-between pb-2">
                                <span className="text-gray-600">Spanning stopcontact</span>
                                <span className="font-medium text-gray-900">220-240 V</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          {/* Laat je inspireren Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Laat je inspireren
              </h2>
              <p className="text-lg text-gray-600">
                Bekijk hoe onze bureaus eruit zien in de interieurs van onze klanten.
              </p>
            </div>

            <div className="relative">
              {/* 4-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 1.webp', alt: 'Bureau setup inspiratie 1' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 2.webp', alt: 'Bureau setup inspiratie 2' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 3.webp', alt: 'Bureau setup inspiratie 3' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 4.webp', alt: 'Bureau setup inspiratie 4' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 5.webp', alt: 'Bureau setup inspiratie 5' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 6.webp', alt: 'Bureau setup inspiratie 6' },
                  { src: '/svg icons/laat je inspireren image/laat je inspereren 7.webp', alt: 'Bureau setup inspiratie 7' }
                ]
                .slice(currentInspirationSlide * 4, currentInspirationSlide * 4 + 4)
                .map((image, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
            </div>

                    {/* Plus Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

              {/* Navigation Arrows */}
              {currentInspirationSlide > 0 && (
              <button
                  onClick={() => setCurrentInspirationSlide(prev => prev - 1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all shadow-md"
              >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
              </button>
              )}
              
              {currentInspirationSlide < 1 && (
                  <button
                  onClick={() => setCurrentInspirationSlide(prev => prev + 1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:shadow-lg transition-all shadow-md"
                  >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
              )}

              {/* Dots Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                  <button
                  onClick={() => setCurrentInspirationSlide(0)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentInspirationSlide === 0 
                      ? 'bg-gray-900 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
                <button
                  onClick={() => setCurrentInspirationSlide(1)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentInspirationSlide === 1 
                      ? 'bg-gray-900 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
                </div>
              </div>
          </div>
        </section>
          </div>
        )}

        {/* SeatPro Extended Sections */}
        {product.isSeatPro && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            
            {/* SeatPro Sectie 1 - Ergonomische kenmerken */}
            <section className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Ergonomische kenmerken
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Ontdek de geavanceerde ergonomische eigenschappen van onze SeatPro bureaustoelen. Met precisie-afstelling en premium materialen voor ultiem zitcomfort.
                </p>
                
                {/* Main Video */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <video 
                    className="w-full h-[400px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/svg icons/videoframe_21189.png"
                  >
                    <source src="/svg icons/SeatPro zoom in'.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ergonomische ondersteuning</h3>
                    <p className="text-sm text-gray-600">Optimale rugsteun en lumbale ondersteuning voor gezond zitten</p>
              </div>

                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Verstelbare armleuningen</h3>
                    <p className="text-sm text-gray-600">4D verstelbare armleuningen voor perfecte arm- en schoudersteun</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Premium materialen</h3>
                    <p className="text-sm text-gray-600">Hoogwaardige mesh en memory foam voor duurzaamheid en comfort</p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ademende mesh</h3>
                    <p className="text-sm text-gray-600">Geavanceerde mesh technologie voor optimale ventilatie en temperatuurregeling</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Waarom kiezen voor DESKNA? Widgets */}
            <WidgetsSection />

            {/* SeatPro Sectie 2 - Ligfunctie met Voetensteun */}
            <section className="bg-white rounded-3xl p-8 lg:p-12 border">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Ligfunctie met voetensteun
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Ontspan volledig met de 180° ligfunctie van onze SeatPro stoel. De uitklapbare voetensteun biedt ultiem comfort voor pauzes, powernaps of ontspanningsmomenten tijdens je werkdag.
                </p>
                
                {/* Main Video */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <video 
                    className="w-full h-[400px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/svg icons/videoframe_21189.png"
                  >
                    <source src="/svg icons/360 liggende stoel.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">180° ligfunctie</h3>
                    <p className="text-sm text-gray-600">Volledig uitklapbaar tot een comfortabele ligpositie voor maximale ontspanning</p>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Uitklapbare voetensteun</h3>
                    <p className="text-sm text-gray-600">Geïntegreerde voetensteun voor volledige beenondersteuning tijdens het rusten</p>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Powernap functie</h3>
                    <p className="text-sm text-gray-600">Perfect voor korte pauzes en powernaps om je energie weer op te laden</p>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Waarom een ligfunctie?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Gezondheidsvoordelen</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Vermindert rugdruk en verbetert de bloedcirculatie</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Helpt bij het verminderen van stress en spanning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Ondersteunt een gezonde werkhouding</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Praktische voordelen</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Verhoogt productiviteit door betere pauzes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Multifunctioneel: werk- en relaxstoel in één</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Eenvoudige bediening met één handgreep</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SeatPro Sectie 3 - Technische Specificaties */}
            <section className="bg-gray-50 rounded-3xl p-8 lg:p-12">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
                  Technische specificaties
                </h2>

                {/* Algemene informatie */}
                <div className="mb-12">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="lg:w-1/3">
                      <img 
                        src="/svg icons/SeatPro blueprint.jpg"
                        alt="SeatPro Technische Blueprint"
                        className="w-full max-w-sm mx-auto rounded-2xl"
                      />
                    </div>
                    <div className="lg:w-2/3">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Algemene informatie</h3>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        De SeatPro bureaustoelen zijn ontworpen met de hoogste ergonomische standaarden. 
                        Elke stoel wordt geproduceerd met premium materialen en onderworpen aan strikte kwaliteitscontroles. 
                        Onze stoelen voldoen aan internationale veiligheidsnormen en zijn geschikt voor intensief dagelijks gebruik.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-900">Certificering:</span>
                          <p className="text-gray-600">BIFMA, ISO 9001</p>
                  </div>
                        <div>
                          <span className="font-semibold text-gray-900">Garantie:</span>
                          <p className="text-gray-600">5 jaar mechaniek, 2 jaar bekleding</p>
                </div>
                        <div>
                          <span className="font-semibold text-gray-900">Gebruik:</span>
                          <p className="text-gray-600">8+ uur per dag</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Maximaal gewicht:</span>
                          <p className="text-gray-600">150 kg (300kg getest)</p>
                        </div>
              </div>
            </div>
          </div>
        </div>

                {/* Ergonomische specificaties - Collapsible */}
                <div className="mb-8">
                  <button
                    onClick={() => setSeatProErgonomicsOpen(!seatProErgonomicsOpen)}
                    className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-gray-900">Ergonomische specificaties</h3>
                    <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform ${seatProErgonomicsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {seatProErgonomicsOpen && (
                    <div className="mt-4 p-6 bg-white rounded-2xl border">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3">
                          <img 
                            src="/svg icons/specificaties seatpro.png"
                            alt="SeatPro Ergonomische Specificaties"
                            className="w-full rounded-xl"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Totale hoogte</span>
                                <span className="text-gray-900">101-111 cm</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Zithoogte verstelbaar</span>
                                <span className="text-gray-900">45-55 cm</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Zitbreedte</span>
                                <span className="text-gray-900">51 cm</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Zitdiepte</span>
                                <span className="text-gray-900">43 cm</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="font-medium text-gray-700">Rugleuning hoogte</span>
                                <span className="text-gray-900">67 cm</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Hoofdsteun hoogte</span>
                                <span className="text-gray-900">16-21 cm verstelbaar</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Hoofdsteun breedte</span>
                                <span className="text-gray-900">36 cm</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Voetkruis diameter</span>
                                <span className="text-gray-900">66-72 cm</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Totale breedte</span>
                                <span className="text-gray-900">60 cm</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="font-medium text-gray-700">Lumbale ondersteuning</span>
                                <span className="text-gray-900">50 cm hoogte, verstelbaar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              
                {/* Materiaal specificaties - Collapsible */}
                <div className="mb-8">
              <button
                    onClick={() => setSeatProMaterialsOpen(!seatProMaterialsOpen)}
                    className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border hover:bg-gray-50 transition-colors"
              >
                    <h3 className="text-xl font-bold text-gray-900">Materiaal specificaties</h3>
                    <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform ${seatProMaterialsOpen ? 'rotate-180' : ''}`} />
              </button>
                  
                  {seatProMaterialsOpen && (
                    <div className="mt-4 p-6 bg-white rounded-2xl border">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3">
                          <img 
                            src="/svg icons/300kg seatpro.png"
                            alt="SeatPro 300KG Belastingstest"
                            className="w-full rounded-xl"
                          />
                        </div>
                        <div className="lg:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Belastbaarheid</span>
                                <span className="text-gray-900 font-semibold">300kg getest</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Zitting materiaal</span>
                                <span className="text-gray-900">High-density memory foam</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Rugleuning</span>
                                <span className="text-gray-900">Premium ademende mesh</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Frame materiaal</span>
                                <span className="text-gray-900">Versterkt gelegeerd staal</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="font-medium text-gray-700">Basis constructie</span>
                                <span className="text-gray-900">Heavy-duty aluminium</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Gasveer klasse</span>
                                <span className="text-gray-900">Klasse 4, TÜV gecertificeerd</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Wielen</span>
                                <span className="text-gray-900">75mm PU, extra geluidsdemping</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Mesh technologie</span>
                                <span className="text-gray-900">High-tensile 3D weave</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="font-medium text-gray-700">Foam dichtheid</span>
                                <span className="text-gray-900">55kg/m³ premium</span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="font-medium text-gray-700">Duurzaamheidstest</span>
                                <span className="text-gray-900">100.000+ cycli getest</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Laat je inspireren Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Wat onze klanten zeggen
              </h2>
              
              {/* Trustpilot Header */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <img 
                  src="/trustpilot stars.png" 
                  alt="Trustpilot 5 sterren" 
                  className="h-6"
                />
                <span className="text-xl font-bold text-gray-900">4.7</span>
                <span className="text-gray-600">/ 5</span>
                <span className="text-gray-600">{reviewCount} reviews</span>
                <img 
                  src="/Trustpilot-logo.png" 
                  alt="Trustpilot" 
                  className="h-6 ml-4"
                    />
                  </div>
                  </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Rating Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Reviews {reviewCount}</h3>
                
                <div className="space-y-3">
                  {[
                    { label: 'Uitstekend', percentage: 77, count: 1055 },
                    { label: 'Goed', percentage: 17, count: 233 },
                    { label: 'Gemiddeld', percentage: 5, count: 69 },
                    { label: 'Slecht', percentage: 0, count: 0 },
                    { label: 'Zeer slecht', percentage: 1, count: 13 }
                  ].map((rating, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-20">
                        <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
                        <span className="text-sm text-gray-700">{rating.label}</span>
                </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
              </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{rating.percentage}%</span>
            </div>
                  ))}
          </div>
        </div>

              {/* Right: Sample Reviews */}
              <div className="h-80 overflow-y-auto pr-4 scrollbar-hide">
                <div className="space-y-6">
                  {[
                    {
                      name: 'Jeanette deBoer',
                      date: '20 september',
                      text: 'Vorige week een bureau uitgeprobeerd in de showroom.. gelijk besteld en was ook binnen 2-3 werkdagen te leveren. Helemaal perfect! Met gratis montage service en helemaal geïnstalleerd geleverd inclusief bureauaccessoires. Ben er super blij mee!'
                    },
                    {
                      name: 'aart andriessen',
                      date: '20 september',
                      text: 'Bureau frame is snel bezorgd zonder toestanden. De zit-sta functie werkt perfect. Helemaal top!'
                    },
                    {
                      name: 'Consumer',
                      date: '20 september',
                      text: 'Uitstekende service en snelle levering. Het bureau is precies zoals beschreven en van hoge kwaliteit. De ergonomische eigenschappen zijn uitstekend.'
                    },
                    {
                      name: 'Maria van der Berg',
                      date: '18 september',
                      text: 'Fantastisch zit-sta bureau! De kwaliteit overtreft mijn verwachtingen. Montage was eenvoudig en de klantenservice was uitstekend. Het touchscreen werkt perfect.'
                    },
                    {
                      name: 'Peter Janssen',
                      date: '17 september',
                      text: 'Zeer tevreden met mijn nieuwe bureauopstelling. Het bureau is stabiel, mooi en de hoogteverstelling is fluisterstil. Snelle levering ook!'
                    },
                    {
                      name: 'Lisa Koeman',
                      date: '16 september',
                      text: 'Perfect voor mijn thuiskantoor. De hoogte-instelling werkt vlekkeloos en het design is prachtig. De bureaulade is ook erg handig.'
                    },
                    {
                      name: 'Henk de Vries',
                      date: '15 september',
                      text: 'Goede prijs-kwaliteit verhouding voor dit zit-sta bureau. Het doet wat het belooft en ziet er professioneel uit in mijn kantoor.'
                    },
                    {
                      name: 'Sophie Meijer',
                      date: '14 september',
                      text: 'Ik ben heel blij met dit ergonomische bureau. De klantenservice was behulpzaam en de levering was supersnel. De bureauaccessoires zijn top!'
                    },
                    {
                      name: 'Tom Bakker',
                      date: '13 september',
                      text: 'Uitstekende kwaliteit en zeer stabiel bureau. Het touchscreen werkt intuïtief en de 3 geheugenposities zijn erg handig voor verschillende werkstanden.'
                    },
                    {
                      name: 'Emma Visser',
                      date: '12 september',
                      text: 'Precies het bureau dat ik zocht! Van hoge kwaliteit en past perfect in mijn werkruimte. De bureauopstelling is nu compleet. Echte aanrader!'
                    }
                  ].map((review, index) => (
                    <div key={index} className={`${index < 9 ? 'border-b border-gray-200 pb-6' : ''}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-gray-900">{review.name}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
              </div>
                      <img 
                        src="/trustpilot stars.png" 
                        alt="5 sterren" 
                        className="h-3 mb-3"
                      />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Verzameld door DESKNA</p>
            </div>
              ))}
            </div>
          </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <ProductCollection 
          title="Vergelijkbare producten"
          subtitle="Andere producten die je misschien interessant vindt."
          products={relatedProducts}
        />

        {/* Add-On Modal */}
        <AddOnModal
          isOpen={showAddOnModal}
          onClose={() => setShowAddOnModal(false)}
          addOnId={selectedAddOnId}
          addOnHandle={selectedAddOnHandle}
          onProductAdded={handleAddOnProductAdded}
        />

        {/* Product Info Modal */}
        <ProductInfoModal
          isOpen={showProductInfoModal}
          onClose={() => setShowProductInfoModal(false)}
          productHandle={product?.handle || resolvedParams.id}
        />
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