'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { toggleCart } = useCartStore();
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartAnimation, setCartAnimation] = useState('');
  const [previousTotalItems, setPreviousTotalItems] = useState(totalItems);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => { setMounted(true); }, []);
  
  // Only enable scroll effect on homepage
  const isHomepage = pathname === '/';

  // Trigger cart animation when items are added
  useEffect(() => {
    if (totalItems > previousTotalItems) {
      setCartAnimation('animate-cart-shake');
      const timer = setTimeout(() => {
        setCartAnimation('');
      }, 600);
      return () => clearTimeout(timer);
    }
    setPreviousTotalItems(totalItems);
  }, [totalItems, previousTotalItems]);

  useEffect(() => {
    if (!isHomepage) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.7);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  return (
    <header suppressHydrationWarning className={`sticky top-0 z-40 transition-all duration-300 ${
      isHomepage 
        ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
        : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left Menu */}
          <nav className="hidden md:flex items-center space-x-6">
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
            {/* Mega menu trigger */}
            <div className="relative group">
              <Link href="/categories" className={`transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}>
                Categorieën
              </Link>
              {/* Mega panel */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-2 w-[720px] bg-white shadow-2xl rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Populair</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/products?filter=bureaus" className="text-gray-800 hover:text-gray-900">Bureaus</Link></li>
                      <li><Link href="/products?filter=bureaustoelen" className="text-gray-800 hover:text-gray-900">Bureaustoelen</Link></li>
                      <li><Link href="/products?filter=verlichting" className="text-gray-800 hover:text-gray-900">Verlichting</Link></li>
                      <li><Link href="/products?filter=accessoires" className="text-gray-800 hover:text-gray-900">Accessoires</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Collecties</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/products?filter=limited" className="text-gray-800 hover:text-gray-900">Limited Edition</Link></li>
                      <li><Link href="/products?filter=massief-hout" className="text-gray-800 hover:text-gray-900">Massief Hout</Link></li>
                      <li><Link href="/products?filter=compact" className="text-gray-800 hover:text-gray-900">Compact</Link></li>
                      <li><Link href="/products?filter=thuiswerk" className="text-gray-800 hover:text-gray-900">Thuiswerk</Link></li>
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="p-4 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">Uitgelicht</p>
                      <p className="text-sm font-bold text-gray-900 mb-2">Stabiele bureau frames</p>
                      <Link href="/products?filter=frames" className="inline-flex items-center text-sm font-medium" style={{ color: '#d6a99e' }}>
                        Bekijk collectie
                      </Link>
                    </div>
                    <img src="/svg icons/bureau poten.jpg" alt="Uitgelicht" className="w-full h-28 object-cover" />
                  </div>
                </div>
              </div>
            </div>
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
              className={`relative p-2 transition-all duration-200 hover:scale-110 active:scale-95 active:rotate-12 ${cartAnimation} ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}
            >
              <ShoppingCart className="h-6 w-6 transition-transform duration-200" />
              {mounted && totalItems > 0 && (
                <span suppressHydrationWarning className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#d6a99e' }}>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a99e] focus:border-transparent"
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

