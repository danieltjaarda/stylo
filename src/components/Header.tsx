'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
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
    <header suppressHydrationWarning className={`sticky top-0 z-40 transition-all duration-300 relative ${
      isHomepage 
        ? (isScrolled ? 'bg-[#f9fafb]/80 backdrop-blur-lg md:bg-transparent' : 'bg-transparent')
        : 'bg-[#f9fafb]/80 backdrop-blur-lg md:bg-transparent'
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        (isHomepage && isScrolled) || !isHomepage ? 'md:bg-white/70 md:shadow-xl md:rounded-full md:border md:border-gray-200/30 md:mt-2 md:mb-2' : ''
      }`}>
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-3 items-center h-16">
          {/* Left Menu */}
          <nav className="flex items-center space-x-6">
            <Link href="/shop-alles" className={`transition-colors ${
              isHomepage && !isScrolled
                ? 'text-white hover:text-gray-200'
                : 'text-gray-700 hover-brown'
            }`}>
              Shop alles
            </Link>
            {/* Products mega menu */}
            <div className="relative group">
              <Link href="/shop-alles" className={`flex items-center space-x-1 transition-colors ${
                isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown'
              }`}>
                <span>Producten</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </Link>
              {/* Mega panel */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 absolute left-0 top-full pt-3 w-[800px]">
                <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100">
                  <div className="grid grid-cols-3 gap-10">
                    {/* Products Column */}
                    <div className="col-span-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Onze Producten</h3>
                      <div className="space-y-6">
                        <Link href="/verstelbare-bureaus" className="block p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md transition-all duration-300 group/item transform hover:scale-[1.02]">
                          <div className="text-lg font-semibold text-gray-900 mb-1 group-hover/item:text-gray-800 transition-colors">Zit-sta bureaus</div>
                          <div className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors">Elektrisch verstelbare bureaus voor een gezonde werkhouding</div>
                          <div className="mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <span className="text-xs font-medium text-blue-600">Bekijk collectie →</span>
                          </div>
                        </Link>
                        <Link href="/bureaustoelen" className="block p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md transition-all duration-300 group/item transform hover:scale-[1.02]">
                          <div className="text-lg font-semibold text-gray-900 mb-1 group-hover/item:text-gray-800 transition-colors">Bureau stoelen</div>
                          <div className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors">Ergonomische werkplekstoelen voor optimaal zitcomfort</div>
                          <div className="mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <span className="text-xs font-medium text-blue-600">Bekijk collectie →</span>
                          </div>
                        </Link>
                        <Link href="/shop-alles" className="block p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md transition-all duration-300 group/item transform hover:scale-[1.02]">
                          <div className="text-lg font-semibold text-gray-900 mb-1 group-hover/item:text-gray-800 transition-colors">Accessoires</div>
                          <div className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors">Monitorarmen, bureaulampen en andere kantooraccessoires</div>
                          <div className="mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <span className="text-xs font-medium text-blue-600">Bekijk collectie →</span>
                          </div>
                        </Link>
                        <div className="pt-4 border-t border-gray-200">
                          <Link href="/shop-alles" className="inline-flex items-center text-sm font-semibold hover:underline" style={{ color: '#2e572d' }}>
                            Bekijk alle producten →
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Featured Product Column */}
                    <Link href="/bureaustoelen" className="block rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:scale-105 group/featured">
                      <div className="p-6 bg-white group-hover/featured:bg-gray-50 transition-colors">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide group-hover/featured:text-gray-600 transition-colors">Aanbevolen</p>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover/featured:text-gray-800 transition-colors">SeatPro Ergonomische Stoel</h4>
                        <p className="text-sm text-gray-600 mb-4 group-hover/featured:text-gray-700 transition-colors">Premium ergonomie voor optimaal zitcomfort</p>
                        <div className="inline-flex items-center text-sm font-semibold transition-colors group-hover/featured:underline" style={{ color: '#2e572d' }}>
                          Bekijk product →
                        </div>
                      </div>
                      <div className="relative h-40 bg-gray-200 overflow-hidden">
                        <Image 
                          src="/svg icons/SeatPro 2.1.jpg" 
                          alt="SeatPro Ergonomische Bureau Stoel" 
                          fill
                          className="object-cover group-hover/featured:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Center Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={isHomepage && !isScrolled ? "/DESKNA LOGO WHITE.png" : "/DESKNA LOGO BLACK.png"}
                alt="Logo" 
                width={120}
                height={32}
                className="h-8 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right Menu */}
          <div className="flex items-center justify-end space-x-6">
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => {
                  const message = "Hallo! Ik wil graag contact opnemen.";
                  const phoneNumber = "+31850602482";
                  const encodedMessage = encodeURIComponent(message);
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className={`transition-colors ${
                  isMenuOpen 
                    ? 'text-gray-700 hover:text-gray-900'
                    : (isHomepage && !isScrolled
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700 hover-brown')
                }`}
              >
                Contact
              </button>
              <Link href="/over-ons" className={`transition-colors ${
                isMenuOpen 
                  ? 'text-gray-700 hover:text-gray-900'
                  : (isHomepage && !isScrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-gray-700 hover-brown')
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

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Left - Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 transition-colors ${
              isMenuOpen 
                ? 'text-gray-700 hover:text-gray-900'
                : (isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown')
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src={isMenuOpen ? "/DESKNA LOGO BLACK.png" : (isHomepage && !isScrolled ? "/DESKNA LOGO WHITE.png" : "/DESKNA LOGO BLACK.png")}
              alt="Logo" 
              width={120}
              height={32}
              className="h-8 w-auto transition-all duration-300"
            />
          </Link>

          {/* Right - Cart */}
          <button
            onClick={toggleCart}
            className={`relative p-2 transition-all duration-200 hover:scale-110 active:scale-95 active:rotate-12 ${cartAnimation} ${
              isMenuOpen 
                ? 'text-gray-700 hover:text-gray-900'
                : (isHomepage && !isScrolled
                  ? 'text-white hover:text-gray-200'
                  : 'text-gray-700 hover-brown')
            }`}
          >
            <ShoppingCart className="h-6 w-6 transition-transform duration-200" />
            {mounted && totalItems > 0 && (
              <span suppressHydrationWarning className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#d6a99e' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <Image 
                  src="/DESKNA LOGO BLACK.png"
                  alt="DESKNA Logo" 
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Menu Content */}
              <div className="flex-1 p-6 bg-white">
                {/* Navigation Links */}
                <div className="space-y-3">
                  <Link 
                    href="/shop-alles" 
                    className="flex items-center text-gray-900 hover:text-[#d6a99e] hover:bg-gray-50 transition-colors py-4 px-4 rounded-lg text-lg font-semibold border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop alles
                  </Link>
                  <Link 
                    href="/shop-alles" 
                    className="flex items-center text-gray-900 hover:text-[#d6a99e] hover:bg-gray-50 transition-colors py-4 px-4 rounded-lg text-lg font-semibold border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Producten
                  </Link>
                  <Link 
                    href="/shop-alles" 
                    className="flex items-center text-gray-900 hover:text-[#d6a99e] hover:bg-gray-50 transition-colors py-4 px-4 rounded-lg text-lg font-semibold border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accessoires
                  </Link>
                  <Link 
                    href="/over-ons" 
                    className="flex items-center text-gray-900 hover:text-[#d6a99e] hover:bg-gray-50 transition-colors py-4 px-4 rounded-lg text-lg font-semibold border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Over Ons
                  </Link>
                </div>
              </div>
              
              {/* Footer with Trustpilot */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center space-x-2 py-2">
                  <Image 
                    src="/trustpilot-stars-new.png" 
                    alt="Trustpilot sterren" 
                    width={120}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <span className="text-sm font-semibold text-gray-900">4,8</span>
                  <span className="text-xs text-gray-500">reviews</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

