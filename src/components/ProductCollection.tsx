'use client';

import Link from 'next/link';
import { CheckCircle, Truck, Shield, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useState, useRef } from 'react';

interface ProductCollectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductCollection({ title, subtitle, products }: ProductCollectionProps) {
  const { addItem } = useCartStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatPrice = (price: number) => {
    return `€ ${price.toFixed(0)}`;
  };

  const getDiscountPercentage = (price: number) => {
    const originalPrice = price * 1.4; // Verhoogd voor meer realistische korting
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  return (
    <section className="py-16 bg-white relative -mt-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Desktronic Style */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          <Link 
            href="/products" 
            className="flex items-center text-[#6667AA] hover:text-[#5556AA] transition-colors font-medium"
          >
            <span className="mr-2">Bekijk de hele collectie</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Slider Container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => {
              const discountPercentage = getDiscountPercentage(product.price);
              const originalPrice = product.price * 1.4;

              return (
                <Link key={product.id} href={`/products/${product.handle || product.id}`}>
                  <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
                    
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6 overflow-hidden group-hover:bg-gray-100 transition-colors">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      
                      {/* Hover Video Effect - Placeholder */}
                      <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {/* 5 Star Rating */}
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="12" height="12" viewBox="0 0 10 10" fill="none" className="mr-0.5">
                                <path d="M5.25731 0L6.75844 3.46174L10.5146 3.81966L7.68619 6.31705L8.50651 10L5.25731 8.08174L2.00811 10L2.82843 6.31705L0 3.81966L3.75618 3.46174L5.25731 0Z" fill="#E2AE44"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">{product.rating}</span>
                          <span className="ml-1 text-gray-500">({product.reviews}+ beoordelingen)</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <Link href={`/products/${product.handle || product.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#6667AA] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Product Description */}
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      </div>

                      {/* Color Variants - Mock */}
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"></div>
                          <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"></div>
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all ${
              canScrollLeft ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all ${
              canScrollRight ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}