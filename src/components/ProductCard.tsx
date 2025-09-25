'use client';

import Link from 'next/link';
import { CheckCircle, Truck, Shield } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return `€ ${price.toFixed(0)}`;
  };

  const getDiscountPercentage = (price: number) => {
    const originalPrice = product.compareAtPrice || price * 1.2;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Get product path - use handle if available, otherwise id
  const productPath = product.handle ? product.handle : encodeURIComponent(product.id);
  const discountPercentage = getDiscountPercentage(product.price);
  const originalPrice = product.compareAtPrice || product.price * 1.2;

  return (
    <Link href={`/products/${productPath}`} className="group block">
      {/* Discount Badge - Floating */}
      <div className="relative mb-4">
        <div className="absolute top-3 left-3 z-10">
          <span className="text-white px-3 py-1 rounded text-xs font-bold shadow-sm"
            style={{ backgroundColor: '#FD8B51' }}>
            {discountPercentage}% korting
          </span>
        </div>

        {/* Product Media - Image with hover effects */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '280px' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
          />
          <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({product.reviews} beoordelingen)</span>
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
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Product Variants - Bottom (colors, monitor arms, leg colors, etc.) */}
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
    </Link>
  );
}