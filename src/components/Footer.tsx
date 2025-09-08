import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-black" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/black logo 1.png" 
                alt="Bureau Stoel Shop Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Jouw specialist in premium bureaustoelen. 
              Ergonomisch comfort en kwaliteit staan bij ons voorop.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover-brown transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover-brown transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover-brown transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Snelle Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover-brown transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover-brown transition-colors">
                  Producten
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover-brown transition-colors">
                  Categorieën
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover-brown transition-colors">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Klantenservice</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover-brown transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover-brown transition-colors">
                  Verzending
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover-brown transition-colors">
                  Retourneren
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover-brown transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" style={{ color: '#d6a99e' }} />
                <span className="text-gray-700">info@bureaustoelshop.nl</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" style={{ color: '#d6a99e' }} />
                <span className="text-gray-700">+31 20 123 4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" style={{ color: '#d6a99e' }} />
                <span className="text-gray-700">Amsterdam, Nederland</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Nieuwsbrief</h3>
            <p className="text-gray-700 mb-4 text-sm">
              Blijf op de hoogte van nieuwe producten en exclusieve aanbiedingen.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Jouw e-mailadres"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6a99e] focus:ring-opacity-50 text-sm"
              />
              <button
                className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                style={{ backgroundColor: '#d6a99e' }}
              >
                Aanmelden
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-700">
          <p className="mb-6">&copy; STYLO 2025</p>
          
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/shopify 4,5 star rating.svg" 
              alt="4,5 sterren rating" 
              className="h-4"
            />
            <img 
              src="/Trustpilot-logo.png" 
              alt="Trustpilot logo" 
              className="h-6 ml-1"
            />
            <span className="text-gray-700 font-bold ml-1">Trustpilot</span>
          </div>
          
          {/* Payment Methods */}
          <div>
            <p className="text-sm text-gray-600 mb-4">Betaalmogelijkheden</p>
            <div className="flex flex-wrap justify-center gap-3">
              <img src="/svg icons/visa.svg" alt="Visa" className="h-6 w-auto" />
              <img src="/svg icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
              <img src="/svg icons/amex.svg" alt="American Express" className="h-6 w-auto" />
              <img src="/svg icons/ideal.svg" alt="iDEAL" className="h-6 w-auto" />
              <img src="/svg icons/paypal.svg" alt="PayPal" className="h-6 w-auto" />
              <img src="/svg icons/maestro.svg" alt="Maestro" className="h-6 w-auto" />
              <img src="/svg icons/klarna.svg" alt="Klarna" className="h-6 w-auto" />
              <img src="/svg icons/apple_pay.svg" alt="Apple Pay" className="h-6 w-auto" />
              <img src="/svg icons/google_pay.svg" alt="Google Pay" className="h-6 w-auto" />
              <img src="/svg icons/bancontact.svg" alt="Bancontact" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

