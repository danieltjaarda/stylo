'use client';

import { Shield, User, MapPin, Package, Globe, Lock, Eye, Edit, Trash2, Pause, Download, X, Mail, Phone, MapPinIcon } from 'lucide-react';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface PrivacyClientProps {
  translations: Translations;
  locale: Locale;
}

export default function PrivacyClient({ translations, locale }: PrivacyClientProps) {
  const { t } = useTranslation(translations);

  const icons = {
    0: <User className="w-5 h-5 text-gray-600 mr-3" />,
    1: <MapPin className="w-5 h-5 text-gray-600 mr-3" />,
    2: <Package className="w-5 h-5 text-gray-600 mr-3" />,
    3: <Globe className="w-5 h-5 text-gray-600 mr-3" />
  };

  const rightIcons = {
    0: <Eye className="w-5 h-5 text-gray-600" />,
    1: <Edit className="w-5 h-5 text-gray-600" />,
    2: <Trash2 className="w-5 h-5 text-gray-600" />,
    3: <Pause className="w-5 h-5 text-gray-600" />,
    4: <Download className="w-5 h-5 text-gray-600" />,
    5: <X className="w-5 h-5 text-gray-600" />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('privacy.header.title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('privacy.header.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            
            {(translations.privacy?.sections || []).map((section: any, sectionIndex: number) => (
              <section key={sectionIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  {section.title}
                </h2>
                
                {section.content && (
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {section.content.map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {section.intro && (
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>{section.intro}</p>
                    
                    {section.categories && section.categories.map((category: any, catIndex: number) => (
                      <div key={catIndex} className="border border-gray-200 rounded-lg p-6 my-6">
                        <div className="flex items-center mb-4">
                          {icons[catIndex as keyof typeof icons]}
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                        </div>
                        <ul className="space-y-2 text-gray-700 ml-8">
                          {category.items.map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {section.purposes && (
                      <ul className="space-y-3 text-gray-700 ml-6">
                        {section.purposes.map((purpose: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-6 h-6 bg-gray-200 rounded-full mr-3 mt-0.5 flex-shrink-0"></span>
                            {purpose}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.rights && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {section.rights.map((right: any, rightIndex: number) => (
                          <div key={rightIndex} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-gray-900 flex-1">{right.title}</h3>
                              {rightIcons[rightIndex as keyof typeof rightIcons]}
                            </div>
                            <p className="text-gray-700 text-sm">{right.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                {t('privacy.contact.title')}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{t('privacy.contact.intro')}</p>
                
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <p className="font-semibold text-gray-900 mb-4">{t('privacy.contact.company')}</p>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-3" />
                      <span>{t('privacy.contact.email')}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-3" />
                      <span>{t('privacy.contact.phone')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-gray-500 mr-3" />
                      <span>{t('privacy.contact.address')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              {t('privacy.lastUpdated')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
