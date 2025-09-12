import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-black" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Onze hardlopers */}
          <div>
            <div className="mb-6">
              <img 
                src="/black logo 1.png" 
                alt="STYLO Logo" 
                className="h-8 w-auto"
              />
            </div>
            <h3 className="text-lg font-medium mb-6 text-black">Onze hardlopers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products/homeone-bureau" className="text-gray-600 hover:text-black transition-colors text-sm">
                  HomeOne bureau
                </Link>
              </li>
              <li>
                <Link href="/products/homepro-bureau" className="text-gray-600 hover:text-black transition-colors text-sm">
                  HomePro bureau
                </Link>
              </li>
              <li>
                <Link href="/products/sitone-ergonomische-bureustoel" className="text-gray-600 hover:text-black transition-colors text-sm">
                  SitOne ergonomische bureustoel
                </Link>
              </li>
              <li>
                <Link href="/products/sitpro-ergonomische-bureustoel" className="text-gray-600 hover:text-black transition-colors text-sm">
                  SitPro ergonomische bureustoel
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Alle producten
                </Link>
              </li>
              <li>
                <Link href="/products?category=zit-sta-bureaus" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Zit-Sta bureaus
                </Link>
              </li>
              <li>
                <Link href="/products?category=ergonomische-bureaustoelen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Ergonomische bureaustoelen
                </Link>
              </li>
              <li>
                <Link href="/products?category=verstelbare-bureauframes" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Verstelbare bureauframes
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessoires" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Hulp */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">Hulp</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/b2b" className="text-gray-600 hover:text-black transition-colors text-sm">
                  B2B
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Retourneren en Terugbetalingen
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Verzending
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Contact met ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Bronnen */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">Bronnen</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/montagehandleidingen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Montagehandleidingen
                </Link>
              </li>
              <li>
                <Link href="/kortingen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  Actieve kortingen
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact met ons */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">Contact met ons</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <span className="text-gray-600">📞</span>
                <span className="ml-2 text-gray-600">NL: +31 620 176 727</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">📞</span>
                <span className="ml-2 text-gray-600">BE: +32 620 176 727</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">✉️</span>
                <span className="ml-2 text-gray-600">info@stylo.nl</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">🕒</span>
                <span className="ml-2 text-gray-600">Ma - Vr | 07:00 - 16:00 uur</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Newsletter - aligned with first column */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Blijf op de hoogte van ons laatste nieuws</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Voer je e-mailadres in"
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                />
                <button 
                  className="px-6 py-3 rounded-r-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#9dafaa' }}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div></div>

            {/* Social Media - aligned with Hulp column */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Volg ons</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div></div>

            {/* Certificates and Trustpilot - aligned with Contact column */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Certificeringen:</h3>
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="/svg icons/certificaat 1.svg.png" 
                  alt="TÜV Rheinland" 
                  className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
                <img 
                  src="/svg icons/WOTY_badge-certified2025.svg" 
                  alt="Website of the Year 2025 Certified Badge" 
                  className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              
              {/* Trustpilot in same column */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-black font-medium">Uitstekend</span>
                  <img 
                    src="/trustpilot stars.png" 
                    alt="5 sterren Trustpilot" 
                    className="h-4 w-auto"
                  />
                </div>
                <div className="text-sm text-black mt-1">
                  1.500+ beoordelingen
                </div>
              </div>
            </div>
          </div>

          {/* Bottom links and payment */}
          <div className="mt-8 pt-8 border-t border-gray-300 flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4 lg:mb-0">
              <span>© 2025 Stylo. Alle rechten voorbehouden.</span>
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy-beleid</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Algemene Voorwaarden</Link>
              <Link href="/colofon" className="hover:text-black transition-colors">Colofon</Link>
              <Link href="/herroepingsrecht" className="hover:text-black transition-colors">Herroepingsrecht</Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <img src="/svg icons/paypal.svg" alt="PayPal" className="h-6 w-auto" />
              <img src="/svg icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
              <img src="/svg icons/visa.svg" alt="Visa" className="h-6 w-auto" />
              <img src="/svg icons/amex.svg" alt="American Express" className="h-6 w-auto" />
              <img src="/svg icons/klarna.svg" alt="Klarna" className="h-6 w-auto" />
              <img src="/svg icons/apple_pay.svg" alt="Apple Pay" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

