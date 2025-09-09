'use client';

import Link from 'next/link';
import { CheckCircle, Truck, Shield, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface ProductCollectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductCollection({ title, subtitle, products }: ProductCollectionProps) {
  const { addItem } = useCartStore();

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

  return (
    <section className="py-16 bg-white relative -mt-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Desktronic Style */}
        <div className="flex items-start justify-between mb-12">
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
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm mt-2"
          >
            <span className="mr-2">Bekijk de hele collectie</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid - Desktronic Style (No Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const discountPercentage = getDiscountPercentage(product.price);
            const originalPrice = product.price * 1.2;

            // Korting badge kleuren zoals Desktronic
            const badgeTexts = [
              'Bespaar tot wel 29%',
              '21% korting', 
              'Bespaar tot wel 27%',
              '16% korting'
            ];
            const badgeColors = [
              'bg-red-500',
              'bg-orange-500', 
              'bg-red-600',
              'bg-blue-600'
            ];
            const badgeText = badgeTexts[index % badgeTexts.length];
            const badgeColor = badgeColors[index % badgeColors.length];

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
                {/* Discount Badge - Floating */}
                <div className="relative mb-4">
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`${badgeColor} text-white px-3 py-1 rounded text-xs font-medium shadow-sm`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Product Image - Standalone */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '280px' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                {/* Product Info - Below Image (No Card) */}
                <div className="space-y-2">
                    {/* Rating - 4.5 Stars Style */}
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {/* 4 Full Stars - Green */}
                        {[...Array(4)].map((_, i) => (
                          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#00B67A" className="mr-0.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                        {/* Half Star - Green */}
                        <div className="relative mr-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#E5E5E5" className="absolute">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#00B67A" className="relative" style={{clipPath: 'inset(0 50% 0 0)'}}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({product.reviews || 150} beoordelingen)</span>
                    </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Product Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
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

                  {/* Color Variants - Bottom */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex space-x-1">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"></div>
                      <div className="w-5 h-5 rounded-full bg-amber-800 border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"></div>
                      <div className="w-5 h-5 rounded-full bg-white border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-400 border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">+10</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CSS to hide scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}