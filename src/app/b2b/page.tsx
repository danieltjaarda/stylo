import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Oplossingen | DESKNA - Zakelijke Ergonomische Werkplekken',
  description: 'Professionele ergonomische werkplek oplossingen voor bedrijven. Bulk kortingen op zit-sta bureaus en bureaustoelen, maatwerk service, verlengde garantie en dedicated accountmanagement voor zakelijke klanten en grote organisaties.',
};

export default function B2B() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">B2B Oplossingen</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Professionele werkplek oplossingen voor bedrijven van elke omvang
          </p>
        </div>

        <div className="space-y-16">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Volume kortingen</h3>
              <p className="text-gray-600">
                Aantrekkelijke prijzen bij grotere aantallen voor uw hele kantoor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Persoonlijk advies</h3>
              <p className="text-gray-600">
                Onze ergonomie experts helpen bij het inrichten van uw kantoor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Volledige service</h3>
              <p className="text-gray-600">
                Van advies tot levering en montage - wij regelen alles voor u.
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Onze B2B Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Kantoor Inrichting</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Volledige kantoor ergonomie analyse</li>
                  <li>• Maatwerk oplossingen voor uw ruimte</li>
                  <li>• 3D visualisatie van uw nieuwe kantoor</li>
                  <li>• Projectmanagement van A tot Z</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Leasing & Financiering</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Flexibele leasing opties</li>
                  <li>• Betaling op factuur mogelijk</li>
                  <li>• Gespreide betalingen</li>
                  <li>• Zakelijke garantievoorwaarden</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Onderhoud & Service</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Preventief onderhoudscontracten</li>
                  <li>• 24/7 technische support</li>
                  <li>• Snelle reparatieservice</li>
                  <li>• Vervanging bij defecten</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Training & Educatie</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Ergonomie workshops voor medewerkers</li>
                  <li>• Instructie voor optimaal gebruik</li>
                  <li>• Gezondheid & welzijn programma's</li>
                  <li>• Online training modules</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-900 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Klaar voor een professionele werkplek?</h2>
            <p className="text-xl mb-8 opacity-90">
              Laat ons een offerte op maat maken voor uw bedrijf.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@stylo.nl?subject=B2B Offerte Aanvraag" 
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Vraag offerte aan
              </a>
              <a 
                href="tel:+31620176727" 
                className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Bel voor advies
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





