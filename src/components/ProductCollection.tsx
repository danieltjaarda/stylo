'use client';

import Link from 'next/link';
import { CheckCircle, Truck, Shield, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { videoOverridesByHandle, videoOverridesById, videoOverridesByIndex, videoOverridesByTag } from '@/data/videoOverrides';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useRef, useState } from 'react';

interface ProductCollectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showTitle?: boolean;
}

export default function ProductCollection({ title, subtitle, products, showTitle = true }: ProductCollectionProps) {
  const { addItem } = useCartStore();
  const [visibleProductIndex, setVisibleProductIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return `€ ${price.toFixed(0)}`;
  };

  const getDiscountPercentage = (price: number) => {
    const originalPrice = price * 1.2;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const getProductFeatures = (product: Product) => {
    const features = [
      { icon: CheckCircle, text: "Volledig aanpasbaar" },
      { icon: Shield, text: "Perfect voor elk seizoen" },
      { icon: Truck, text: "Volledig comfort" },
      { icon: Shield, text: "Ergonomische ondersteuning" }
    ];
    return features.slice(0, 3);
  };

  // Intersection Observer voor video auto-play op mobiel
  useEffect(() => {
    if (!isMounted) return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleIndex = 0;
        let maxIntersectionRatio = 0;

        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            mostVisibleIndex = index;
          }
        });

        // Update visible product and control videos
        if (maxIntersectionRatio > 0.5) { // Only if more than 50% visible
          setVisibleProductIndex(mostVisibleIndex);
          
          // Stop all videos first
          videoRefs.current.forEach((video, index) => {
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          });

          // Play video of most visible product
          const visibleVideo = videoRefs.current[mostVisibleIndex];
          if (visibleVideo) {
            visibleVideo.play().catch(console.error);
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -20% 0px' // Only trigger when well in view
      }
    );

    // Observe all product elements
    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products, isMounted]);

  return (
    <section className="pt-6 pb-4 md:pb-8 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Desktronic Style */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            {showTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          <Link 
            href="/shop-alles" 
            className="hidden md:flex items-center text-gray-900 font-medium text-sm mt-2"
          >
            <span className="mr-2">Bekijk de hele collectie</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible pb-4">
          {products.map((product, index) => {
            const discountPercentage = getDiscountPercentage(product.price);
            const originalPrice = product.price * 1.2;
            // Per-product hover video overrides (handle > id > tag > index)
            const getVideoByTag = () => {
              if (product.tags) {
                console.log(`🏷️ Product "${product.name}" has tags:`, product.tags);
                for (const tag of product.tags) {
                  if (videoOverridesByTag[tag]) {
                    console.log(`🎥 Found video for tag "${tag}":`, videoOverridesByTag[tag]);
                    return videoOverridesByTag[tag];
                  }
                }
              }
              return null;
            };

            const overrideVideo =
              (product.handle && videoOverridesByHandle[product.handle]) ||
              videoOverridesById[product.id] ||
              getVideoByTag() ||
              videoOverridesByIndex[index];

            console.log(`🎬 Product "${product.name}" assigned video:`, overrideVideo);

            // Generate varied review counts based on index
            const reviewCounts = [127, 89, 203, 156, 94, 178, 112, 145];
            const reviewCount = reviewCounts[index % reviewCounts.length];

            // Korting badge kleuren zoals Desktronic
            const badgeTexts = [
              '29% korting',
              '21% korting', 
              '27% korting',
              '16% korting'
            ];
            const badgeText = badgeTexts[index % badgeTexts.length];

            // Use real product id so PDP resolves the correct item
            const productPath = product.handle ? product.handle : encodeURIComponent(product.id);
            
            // Get current product image based on selected variants
            const getCurrentProductImage = () => {
              if (!product.variants) {
                return product.image;
              }
              
              const meaningfulOptions = product.options?.filter((option: any) => {
                return !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title');
              }) || [];
              
              if (meaningfulOptions.length === 0) {
                return product.image;
              }
              
              // Find variant that matches ALL selected options
              const matchingVariant = product.variants.find((variant: any) => {
                if (!variant.selectedOptions) return false;
                
                // Check if this variant matches all our selected options
                return meaningfulOptions.every((option: any) => {
                  const selectedValue = selectedVariants[`${product.id}-${option.name}`] || option.values[0];
                  return variant.selectedOptions.some((so: any) => 
                    so.name === option.name && so.value === selectedValue
                  );
                });
              });
              
              return matchingVariant?.imageUrl || product.image;
            };
            
            const currentImage = getCurrentProductImage();
            
            return (
              <div 
                key={product.id} 
                ref={(el) => { productRefs.current[index] = el; }}
                data-index={index}
                className="flex-shrink-0 w-72 md:w-auto"
              >
                <Link href={`/products/${productPath}`} className="group block">
                  {/* Discount Badge - Floating */}
                  <div className="relative mb-4">
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-white px-3 py-1 rounded text-xs font-bold shadow-sm`}
                      style={{ backgroundColor: '#FD8B51' }}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Product Media - Image default; video on hover if available */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '280px' }}>
                    {/* Image (default state) */}
                    <img
                      src={currentImage}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${overrideVideo || product.videoUrl ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Video (only if available) */}
                    { (overrideVideo || product.videoUrl) && (
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                          isMounted && window.innerWidth < 768 
                            ? (visibleProductIndex === index ? 'opacity-100' : 'opacity-0')
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        src={overrideVideo || product.videoUrl!}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={product.videoPoster || undefined}
                        onMouseEnter={(e) => {
                          if (isMounted && window.innerWidth >= 768) {
                            (e.currentTarget as HTMLVideoElement).play();
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Product Info - Below Image (No Card) */}
                <div className="space-y-2">
                    {/* Rating - Trustpilot Stars */}
                    <div className="flex items-center mb-2">
                      <img 
                        src="/trustpilot-stars-new.png" 
                        alt="Trustpilot sterren" 
                        className="h-5 w-auto mr-2"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({reviewCount} beoordelingen)</span>
                    </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Product Description (clamp to 1 line) */}
                  <p
                    className="text-gray-600 text-sm leading-relaxed"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>

                </div>
                </Link>
                
                {/* Product Variants - Bottom (colors, monitor arms, leg colors, etc.) - Outside Link to prevent video trigger */}
                {(() => {
                  // Find meaningful options (not just 'Title: Default Title')
                  const meaningfulOptions = product.options?.filter((option: any) => {
                    return !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title');
                  }) || [];

                  if (meaningfulOptions.length === 0) {
                    return null;
                  }

                  // For bureaus, prioritize showing leg color alongside other options
                  const isDesk = product.name.toLowerCase().includes('bureau') || 
                                 product.category?.toLowerCase().includes('bureau') ||
                                 product.tags?.some((tag: string) => tag.toLowerCase().includes('bureau'));
                  
                  let optionsToDisplay = meaningfulOptions;
                  
                  if (isDesk && meaningfulOptions.length > 1) {
                    // For desks, try to show leg color + one other option
                    const legColorOption = meaningfulOptions.find((option: any) => 
                      option.name.toLowerCase().includes('leg') && option.name.toLowerCase().includes('color')
                    );
                    const otherOption = meaningfulOptions.find((option: any) => 
                      !option.name.toLowerCase().includes('leg')
                    );
                    
                    if (legColorOption && otherOption) {
                      optionsToDisplay = [otherOption, legColorOption]; // Show main option first, then leg color
                    } else {
                      optionsToDisplay = meaningfulOptions.slice(0, 2); // Show first 2 options
                    }
                  } else {
                    // For non-desks, show the first meaningful option
                    optionsToDisplay = [meaningfulOptions[0]];
                  }

                  if (optionsToDisplay.length === 0) {
                    return null;
                  }

                  // Color mapping (same as in product detail page)
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

                  // Flatten all option values into a single array with max 5 items
                  const allOptionValues: Array<{
                    optionName: string,
                    value: string,
                    isColorOption: boolean,
                    isEnkelDubbelOption: boolean
                  }> = [];
                  
                  optionsToDisplay.forEach((option: any) => {
                    const lowerName = option.name.toLowerCase();
                    const isColorOption = lowerName.includes('kleur') || lowerName.includes('color');
                    const isEnkelDubbelOption = option.values.some((val: string) => 
                      val.toLowerCase().includes('enkel') || val.toLowerCase().includes('dubbel')
                    );
                    
                    option.values.forEach((value: string) => {
                      allOptionValues.push({
                        optionName: option.name,
                        value,
                        isColorOption,
                        isEnkelDubbelOption
                      });
                    });
                  });
                  
                  // Show only first 5 items total, always show +10 if there are more than 5
                  const itemsToShow = allOptionValues.slice(0, 5);
                  const hasMoreItems = allOptionValues.length > 5;
                  
                  const handleVariantClick = (optionName: string, optionValue: string) => {
                    setSelectedVariants(prev => ({
                      ...prev,
                      [`${product.id}-${optionName}`]: optionValue
                    }));
                  };

                  return (
                    <div className="flex items-center space-x-2 pt-1">
                      <div className="flex space-x-1">
                        {itemsToShow.map((item, itemIndex) => {
                          const currentValue = selectedVariants[`${product.id}-${item.optionName}`] || 
                            optionsToDisplay.find((opt: any) => opt.name === item.optionName)?.values[0];
                          const isSelected = currentValue === item.value;
                          
                          if (item.isColorOption) {
                            const bgColor = colorMap[item.value] || '#E5E7EB';
                            return (
                              <button
                                key={itemIndex}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleVariantClick(item.optionName, item.value);
                                }}
                                className={`w-5 h-5 rounded-full border-2 cursor-pointer hover:border-gray-600 transition-all ${
                                  isSelected ? 'border-gray-900 scale-110' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: bgColor }}
                                title={`${item.optionName}: ${item.value}`}
                              />
                            );
                          } else if (item.isEnkelDubbelOption) {
                            // Special circles for enkel/dubbel monitor arm options
                            const isEnkel = item.value.toLowerCase().includes('enkel');
                            return (
                              <button
                                key={itemIndex}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleVariantClick(item.optionName, item.value);
                                }}
                                className={`relative w-5 h-5 rounded-full border-2 cursor-pointer hover:border-gray-600 transition-all overflow-hidden ${
                                  isSelected ? 'border-gray-900 scale-110' : 'border-gray-300'
                                }`}
                                title={`${item.optionName}: ${item.value}`}
                              >
                                {isEnkel ? (
                                  // Enkel: half wit, half zwart (vertical split)
                                  <>
                                    <div className="absolute inset-0 bg-white"></div>
                                    <div className="absolute top-0 right-0 w-1/2 h-full bg-black"></div>
                                  </>
                                ) : (
                                  // Dubbel: more black to show it's "double"
                                  <>
                                    <div className="absolute inset-0 bg-black"></div>
                                    <div className="absolute top-0 left-0 w-1/3 h-full bg-white"></div>
                                  </>
                                )}
                              </button>
                            );
                          } else {
                            // For other non-color options, show small circles with first letter
                            return (
                              <button
                                key={itemIndex}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleVariantClick(item.optionName, item.value);
                                }}
                                className={`w-5 h-5 rounded-full border-2 cursor-pointer hover:border-gray-600 transition-all flex items-center justify-center text-xs font-bold ${
                                  isSelected ? 'border-gray-900 bg-gray-900 text-white scale-110' : 'border-gray-300 bg-white text-gray-700'
                                }`}
                                title={`${item.optionName}: ${item.value}`}
                              >
                                {item.value.charAt(0).toUpperCase()}
                              </button>
                            );
                          }
                        })}
                      </div>
                      {hasMoreItems && (
                        <span className="text-xs text-gray-500 font-medium">+10</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {/* CSS to hide scrollbar */}
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
    </section>
  );
}