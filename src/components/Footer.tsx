import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, ArrowRight } from 'lucide-react';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface FooterProps {
  translations: Translations;
  locale: Locale;
}

export default function Footer({ translations, locale }: FooterProps) {
  const { t } = useTranslation(translations);
  return (
    <footer className="text-black" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Topproducten */}
          <div>
            <div className="mb-6">
              <img 
                src="/DESKNA LOGO BLACK.png" 
                alt="DESKNA Logo" 
                className="h-8 w-auto"
              />
            </div>
            <h3 className="text-lg font-medium mb-6 text-black">{t('footer.topProducts.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products/777-test-product" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.topProducts.deskOne')}
                </Link>
              </li>
              <li>
                <Link href="/products/deskpro" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.topProducts.deskPro')}
                </Link>
              </li>
              <li>
                <Link href="/products/seatpro-ergonomische-bureau-stoel" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.topProducts.seatPro')}
                </Link>
              </li>
              <li>
                <Link href="/products/monitorarm-enkel" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.topProducts.monitorArm')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">{t('footer.shop.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop-alles" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.shop.allProducts')}
                </Link>
              </li>
              <li>
                <Link href="/verstelbare-bureaus" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.shop.sitStandDesks')}
                </Link>
              </li>
              <li>
                <Link href="/bureaustoelen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.shop.ergonomicChairs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hulp */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">{t('footer.help.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/b2b" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.help.b2b')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.help.returnsRefunds')}
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.help.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.help.shipping')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.help.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Bronnen */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">{t('footer.resources.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.resources.blog')}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.resources.quiz')}
                </Link>
              </li>
              <li>
                <Link href="/montagehandleidingen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.resources.montageGuides')}
                </Link>
              </li>
              <li>
                <Link href="/kortingen" className="text-gray-600 hover:text-black transition-colors text-sm">
                  {t('footer.resources.discounts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact met ons */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-black">{t('footer.contact.title')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <span className="text-gray-600">📞</span>
                <span className="ml-2 text-gray-600">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">✉️</span>
                <span className="ml-2 text-gray-600">{locale === 'sv' ? 'info@deskna.se' : t('footer.contact.email')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">🕒</span>
                <span className="ml-2 text-gray-600">{t('footer.contact.hours')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Newsletter - aligned with first column */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">{t('footer.stayUpToDate.title')}</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('footer.stayUpToDate.inputPlaceholder')}
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
              <h3 className="text-lg font-medium mb-4 text-black">{t('footer.socialMedia.followUs')}</h3>
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
              <h3 className="text-lg font-medium mb-4 text-black">{t('footer.certifications.title')}</h3>
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
                  <span className="text-black font-medium">{t('footer.trustpilot.excellent')}</span>
                  <img 
                    src="/trustpilot-stars-new.png" 
                    alt="5 sterren Trustpilot" 
                    className="h-4 w-auto"
                  />
                </div>
                <div className="text-sm text-black mt-1">
                  {t('footer.trustpilot.reviews')}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom links and payment */}
          <div className="mt-8 pt-8 border-t border-gray-300 flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4 lg:mb-0">
              <span>{t('footer.copyright')}</span>
              <Link href="/privacy" className="hover:text-black transition-colors">{t('footer.privacyPolicy')}</Link>
              <Link href="/terms" className="hover:text-black transition-colors">{t('footer.terms')}</Link>
              <Link href="/colofon" className="hover:text-black transition-colors">{t('footer.colophon')}</Link>
              <Link href="/herroepingsrecht" className="hover:text-black transition-colors">{t('footer.rightOfWithdrawal')}</Link>
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

