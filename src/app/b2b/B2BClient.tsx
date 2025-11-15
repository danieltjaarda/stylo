'use client';

import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface B2BClientProps {
  translations: Translations;
  locale: Locale;
}

export default function B2BClient({ translations, locale }: B2BClientProps) {
  const { t } = useTranslation(translations);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('b2b.header.title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('b2b.header.subtitle')}
          </p>
        </div>

        <div className="space-y-16">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(translations.b2b?.benefits || []).map((benefit: any, index: number) => {
              const icons = [
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>,
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>,
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ];

              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    {icons[index]}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Services */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('b2b.services.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(translations.b2b?.services?.items || []).map((service: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                  <ul className="space-y-3 text-gray-600">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-900 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('b2b.cta.title')}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t('b2b.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:info@deskna.nl?subject=${encodeURIComponent(t('b2b.cta.emailSubject'))}`}
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('b2b.cta.requestQuote')}
              </a>
              <a 
                href="tel:+31850602482" 
                className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                {t('b2b.cta.callForAdvice')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
