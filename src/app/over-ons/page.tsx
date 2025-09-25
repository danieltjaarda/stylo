'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Heart, Award, Users, CheckCircle, Star, ChevronRight } from 'lucide-react';

export default function OverOns() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-gray-900 font-medium">
                  Over Ons
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
                Over <span className="text-orange-500">DESKNA</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Wij zijn gepassioneerd over het creëren van ergonomische werkplekken die niet alleen 
                comfort bieden, maar ook bijdragen aan een gezondere en productievere werkdag.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">1500+</div>
                  <div className="text-sm text-gray-600">Tevreden klanten</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">4.8</div>
                  <div className="text-sm text-gray-600">Sterren rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">5+</div>
                  <div className="text-sm text-gray-600">Jaar ervaring</div>
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
              Onze Missie & Waarden
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bij DESKNA geloven we dat iedereen recht heeft op een gezonde en comfortabele werkplek. 
              Daarom ontwikkelen we producten die niet alleen functioneel zijn, maar ook bijdragen aan je welzijn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kwaliteit */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kwaliteit</h3>
              <p className="text-gray-600">
                Wij gebruiken alleen de beste materialen en productietechnieken om producten te maken 
                die jarenlang meegaan en hun functionaliteit behouden.
              </p>
            </div>

            {/* Ergonomie */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ergonomie</h3>
              <p className="text-gray-600">
                Elke product wordt ontworpen met de menselijke anatomie in gedachten, zodat je 
                comfortabel en gezond kunt werken, dag in dag uit.
              </p>
            </div>

            {/* Service */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service</h3>
              <p className="text-gray-600">
                Van snelle levering tot uitstekende klantenservice - wij zorgen voor een zorgeloze 
                ervaring van bestelling tot montage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ons Verhaal
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  DESKNA is ontstaan uit de frustratie over de slechte kwaliteit en hoge prijzen 
                  van ergonomische werkplekproducten. Wij zagen te veel mensen worstelen met 
                  rugklachten en oncomfortabele werkplekken.
                </p>
                <p>
                  Daarom besloten we om zelf de beste ergonomische bureaus en stoelen te ontwikkelen. 
                  Producten die niet alleen betaalbaar zijn, maar ook voldoen aan de hoogste 
                  kwaliteitseisen en ergonomische standaarden.
                </p>
                <p>
                  Vandaag de dag helpen we meer dan 1500 tevreden klanten met het creëren van 
                  hun perfecte werkplek. En dat is nog maar het begin.
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  href="/shop-alles"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Bekijk onze producten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">25</div>
                    <div className="text-sm text-gray-600">Minuten montage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">5</div>
                    <div className="text-sm text-gray-600">Jaar garantie</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Duurzaam</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
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
              Ons Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ontmoet de mensen achter DESKNA - een team van experts die gepassioneerd zijn 
              over ergonomie en klanttevredenheid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src="/Chris winter.webp"
                  alt="Chris"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chris</h3>
              <p className="text-orange-500 font-medium mb-3">Product Manager</p>
              <p className="text-gray-600 text-sm">
                Verantwoordelijk voor productinnovatie en kwaliteitscontrole. 
                Chris zorgt ervoor dat elk product voldoet aan onze hoge standaarden.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src="/Joep.webp"
                  alt="Joep"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Joep</h3>
              <p className="text-orange-500 font-medium mb-3">Customer Success</p>
              <p className="text-gray-600 text-sm">
                Joep zorgt ervoor dat elke klant de beste ervaring heeft, van bestelling 
                tot montage en nazorg.
              </p>
            </div>

            {/* Expert Partner */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src="/Krisel Woltman.webp"
                  alt="Drs. Kristel Woltman"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drs. Kristel Woltman</h3>
              <p className="text-orange-500 font-medium mb-3">Ergonomie Expert</p>
              <p className="text-gray-600 text-sm">
                Als fysiotherapeut adviseert Kristel ons over de ergonomische aspecten 
                van onze producten voor optimale gezondheidsvoordelen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose DESKNA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom DESKNA?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ontdek wat ons onderscheidt van andere aanbieders van werkplekproducten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Snelle Levering</h3>
              <p className="text-gray-600 text-sm">Binnen 1-2 werkdagen geleverd</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">Persoonlijk advies van specialisten</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kwaliteitsgarantie</h3>
              <p className="text-gray-600 text-sm">5 jaar garantie op alle producten</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hoge Waardering</h3>
              <p className="text-gray-600 text-sm">4.8/5 sterren van 1500+ klanten</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Klaar voor je perfecte werkplek?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Ontdek onze collectie ergonomische bureaus en stoelen en ervaar het verschil 
            dat kwaliteit en comfort maken.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop-alles"
              className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Shop nu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/quiz"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Doe de werkplek quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
