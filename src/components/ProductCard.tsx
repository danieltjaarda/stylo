'use client';

import Link from 'next/link';
import { CheckCircle, Truck, Shield } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  const getDiscountPercentage = (price: number) => {
    const originalPrice = price * 1.2;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const getProductFeatures = (product: Product) => {
    const features = [
      { icon: CheckCircle, text: "Volledig aanpasbaar" },
      { icon: Shield, text: "Perfect voor elk seizoen" },
      { icon: Truck, text: "Volledig comfort" }
    ];
    return features.slice(0, 3);
  };

  const discountPercentage = getDiscountPercentage(product.price);
  const originalPrice = product.price * 1.2;
  const features = getProductFeatures(product);
  
  // Different hover colors based on product ID - Custom palette
  const getHoverColor = (productId: string) => {
    const colors = [
      'group-hover:bg-[#D6A99D]', // Warm pink/beige
      'group-hover:bg-[#FBF3D5]', // Cream yellow
      'group-hover:bg-[#D6DAC8]', // Sage green
      'group-hover:bg-[#9CAFAA]'  // Muted teal
    ];
    const index = parseInt(productId) - 1;
    return colors[index % colors.length];
  };
  const hoverColor = getHoverColor(product.id);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 relative group">
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-[#D6A99D] text-black px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
            {discountPercentage}% korting
          </span>
        </div>


        
        {/* Product Image - Square */}
        <div className="relative aspect-square bg-white flex items-center justify-center p-3 overflow-hidden">
          {/* Background Circle - Always Visible */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-48 h-48 bg-gray-200 ${hoverColor} transition-all duration-500 ease-out rounded-full`}></div>
          </div>
          
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain relative z-10"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-white border border-gray-200 px-3 py-1 rounded-full">
              <img 
                src="/Trustpilot-logo.png" 
                alt="Trustpilot" 
                className="h-4 w-4 mr-1"
              />
              <span className="text-gray-900 text-sm font-semibold">
                {product.rating}
              </span>
            </div>
          </div>

          {/* Product Name and Price */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 leading-tight flex-1 pr-3">
              {product.name}
            </h3>
            <div className="flex items-baseline space-x-1 flex-shrink-0">
              <span className="text-base font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Features List */}
          <div className="space-y-2 mb-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600">
                <feature.icon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>


        </div>
      </div>
    </Link>
  );
}