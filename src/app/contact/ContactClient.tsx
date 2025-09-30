'use client';

import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface ContactClientProps {
  translations: Translations;
  locale: Locale;
}

export default function ContactClient({ translations, locale }: ContactClientProps) {
  const { t } = useTranslation(translations);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('contact.header.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact.header.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('contact.info.title')}
            </h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.phone.title')}</h3>
                  <p className="text-gray-600">{t('contact.info.phone.number')}</p>
                  <p className="text-sm text-gray-500">{t('contact.info.phone.description')}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.email.title')}</h3>
                  <p className="text-gray-600">{t('contact.info.email.address')}</p>
                  <p className="text-sm text-gray-500">{t('contact.info.email.description')}</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.hours.title')}</h3>
                  <div className="text-gray-600">
                    <p>{t('contact.info.hours.weekdays')}</p>
                    <p>{t('contact.info.hours.weekend')}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('contact.info.address.title')}</h3>
                  <div className="text-gray-600">
                    <p>{t('contact.info.address.company')}</p>
                    <p>{t('contact.info.address.country')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">{t('contact.info.quickActions.title')}</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`tel:${t('contact.info.phone.number').replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t('contact.info.quickActions.call')}
                </a>
                <a 
                  href={`mailto:${t('contact.info.email.address')}`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t('contact.info.quickActions.email')}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('contact.form.title')}
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.firstName')}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.lastName')}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.subject.label')}
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('contact.form.subject.placeholder')}</option>
                  <option value="product-vraag">{t('contact.form.subject.options.productQuestion')}</option>
                  <option value="bestelling">{t('contact.form.subject.options.order')}</option>
                  <option value="retour">{t('contact.form.subject.options.return')}</option>
                  <option value="technische-ondersteuning">{t('contact.form.subject.options.support')}</option>
                  <option value="klacht">{t('contact.form.subject.options.complaint')}</option>
                  <option value="anders">{t('contact.form.subject.options.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message.label')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('contact.form.message.placeholder')}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {t('contact.form.submit')}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('contact.faq.title')}
            </h2>
            <p className="text-gray-600">
              {t('contact.faq.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(translations.contact?.faq?.questions || []).map((faq: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
