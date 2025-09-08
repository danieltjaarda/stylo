'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { getTotalItems, toggleCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = getTotalItems();
  const pathname = usePathname();
  
  // Only enable scroll effect on homepage
  const isHomepage = pathname === '/';

  useEffect(() => {
    if (!isHomepage) return;
    
    const handleScroll = () => {
      // Wanneer scrollY > 70vh (banner hoogte), verander header
      setIsScrolled(window.scrollY > window.innerHeight * 0.7);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomepage 
        ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className={`transition-colors ${
              isHomepage && !isScrolled
                ? 'text-white hover:text-gray-200'
                : 'text-gray-700 hover-brown'
            }`}>
              Shop alles
            </Link>
            <Link href="/products" className={`transition-colors ${
              isHomepage && !isScrolled
                ? 'text-white hover:text-gray-200'
                : 'text-gray-700 hover-brown'
            }`}>
              Producten
            </Link>
          </nav>

          {/* Center Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <img 
                src={isHomepage && !isScrolled ? "/white logo 1.png" : "/black logo 1.png"}
                alt="Logo" 
                className="h-8 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right Menu */}
          <div className="flex items-center justify-end space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link href="/categories" className={`transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}>
                Categorieën
              </Link>
              <Link href="/about" className={`transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}>
                Over Ons
              </Link>
            </nav>
            
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative p-2 transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: '#d6a99e' }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Zoek producten..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#d6a99e' }}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Link 
                href="/" 
                className="text-gray-700 hover-brown transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop alles
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover-brown transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Producten
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover-brown transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorieën
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover-brown transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Over Ons
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

