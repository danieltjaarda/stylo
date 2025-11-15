'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Heart, Award, Users, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { Translations, Locale, useTranslation } from '@/lib/i18n-shared';

interface OverOnsProps {
  translations: Translations;
  locale: Locale;
}

export default function OverOns({ translations, locale }: OverOnsProps) {
  const { t } = useTranslation(translations);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                  {t('about.breadcrumb.home')}
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-medium">
                  {t('about.breadcrumb.about')}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('about.hero.title')} <span className="text-orange-500">{t('about.hero.titleBrand')}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('about.hero.subtitle')}
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{t('about.hero.stats.customers.number')}</div>
                  <div className="text-sm text-gray-600">{t('about.hero.stats.customers.label')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{t('about.hero.stats.rating.number')}</div>
                  <div className="text-sm text-gray-600">{t('about.hero.stats.rating.label')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{t('about.hero.stats.experience.number')}</div>
                  <div className="text-sm text-gray-600">{t('about.hero.stats.experience.label')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/Groepsfoto.png"
                  alt="DESKNA team"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('about.mission.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(translations.about?.mission?.values || []).map((value: any, index: number) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {index === 0 && <Award className="w-8 h-8 text-orange-600" />}
                  {index === 1 && <Target className="w-8 h-8 text-orange-600" />}
                  {index === 2 && <Heart className="w-8 h-8 text-orange-600" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.story.title')}
              </h2>
              <div className="space-y-6 text-gray-600">
                {(translations.about?.story?.content || []).map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8">
                <Link 
                  href="/shop-alles"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t('about.story.cta')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  {(translations.about?.story?.stats || []).map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-2">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(translations.about?.team?.members || []).map((member: any, index: number) => {
              const images = ['/Chris winter.webp', '/Joep.webp', '/Krisel Woltman.webp'];
              return (
                <div key={index} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image
                      src={images[index]}
                      alt={member.name}
                      width={192}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose DESKNA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.whyUs.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('about.whyUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(translations.about?.whyUs?.features || []).map((feature: any, index: number) => {
              const icons = [
                <CheckCircle className="w-8 h-8 text-green-600" />,
                <Users className="w-8 h-8 text-blue-600" />,
                <Award className="w-8 h-8 text-purple-600" />,
                <Star className="w-8 h-8 text-yellow-600" />
              ];
              const bgColors = ['bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-yellow-100'];

              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${bgColors[index]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {icons[index]}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop-alles"
              className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('about.cta.shopNow')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/quiz"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('about.cta.takeQuiz')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}