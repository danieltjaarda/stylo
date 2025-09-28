'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useStickyCart } from '@/contexts/StickyCartContext';

interface StickyAddToCartProps {
  productTitle: string;
  productPrice: string;
  compareAtPrice?: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  originalButtonRef: React.RefObject<HTMLButtonElement | null>;
  isVisible?: boolean;
}

export default function StickyAddToCart({
  productTitle,
  productPrice,
  compareAtPrice,
  quantity,
  onQuantityChange,
  onAddToCart,
  originalButtonRef,
  isVisible = true
}: StickyAddToCartProps) {
  const [showSticky, setShowSticky] = useState(false);
  const { setStickyCartVisible } = useStickyCart();

  useEffect(() => {
    const handleScroll = () => {
      if (!originalButtonRef.current) return;

      const rect = originalButtonRef.current.getBoundingClientRect();
      const isOriginalVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      const shouldShowSticky = !isOriginalVisible && isVisible;
      setShowSticky(shouldShowSticky);
      setStickyCartVisible(shouldShowSticky);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [originalButtonRef, isVisible]);

  return (
    <div className={`fixed bottom-6 left-4 right-4 z-50 transition-all duration-500 ease-in-out transform ${
      showSticky 
        ? 'translate-y-0 opacity-100' 
        : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 ease-out">
          <div className="flex items-center justify-between gap-3">
            {/* Product Info - Compact */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-900 truncate mb-1">
                {productTitle || 'DeskOne Bureau'}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  €{productPrice || '249.00'}
                </span>
                {compareAtPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    €{compareAtPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls - Compact */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
              >
                <Minus className="w-2.5 h-2.5 text-gray-700" />
              </button>
              <span className="w-6 text-center text-xs font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-6 h-6 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
              >
                <Plus className="w-2.5 h-2.5 text-gray-700" />
              </button>
            </div>

            {/* Add to Cart Button - Compact */}
            <button
              onClick={onAddToCart}
              className="bg-gray-900/90 backdrop-blur-sm text-white py-2 px-3 rounded-xl font-medium hover:bg-gray-800/90 transition-all duration-200 flex items-center space-x-1.5 flex-shrink-0 shadow-lg"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="text-xs">Toevoegen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
