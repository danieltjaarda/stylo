import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retourneren & Terugbetalingen | DESKNA',
  description: 'Eenvoudig en gratis retourneren binnen 30 dagen. Lees alles over ons retourbeleid en hoe je jouw bestelling kunt retourneren.',
};

export default function Returns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Retourneren en Terugbetalingen</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Niet tevreden? Geen probleem. Retourneer je bestelling eenvoudig en gratis.
          </p>
        </div>

        <div className="space-y-12">
          {/* Return Policy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retourbeleid</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">30 dagen bedenktijd</h3>
              <p className="text-green-800">
                Je hebt 30 dagen de tijd om je bestelling te retourneren vanaf de dag van ontvangst. 
                Geen vragen, geen gedoe - gewoon gratis retourneren.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Wat kun je retourneren?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Alle bureaustoelen in originele staat</li>
                  <li>• Bureaus in originele verpakking</li>
                  <li>• Accessoires ongebruikt</li>
                  <li>• Producten zonder beschadigingen</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Wat niet?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Producten op maat gemaakt</li>
                  <li>• Beschadigde items door misbruik</li>
                  <li>• Producten zonder originele verpakking</li>
                  <li>• Hygiëne artikelen (kussens) na gebruik</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retourproces</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact opnemen</h3>
                <p className="text-sm text-gray-600">Neem contact met ons op via email of telefoon</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Retourlabel</h3>
                <p className="text-sm text-gray-600">Je ontvangt een gratis retourlabel per email</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Inpakken</h3>
                <p className="text-sm text-gray-600">Pak het product in met originele verpakking</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ophalen</h3>
                <p className="text-sm text-gray-600">Wij halen het product gratis bij je op</p>
              </div>
            </div>
          </div>

          {/* Refund Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Terugbetaling</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Verwerkingstijd</h3>
                  <p className="text-gray-600 text-sm mb-2">• Terugbetaling binnen 5-10 werkdagen</p>
                  <p className="text-gray-600 text-sm mb-2">• Na ontvangst en controle van het product</p>
                  <p className="text-gray-600 text-sm">• Automatische verwerking naar oorspronkelijke betaalmethode</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kosten</h3>
                  <p className="text-gray-600 text-sm mb-2">• Retourzending: Gratis</p>
                  <p className="text-gray-600 text-sm mb-2">• Ophaalservice: Gratis</p>
                  <p className="text-gray-600 text-sm">• Geen administratiekosten</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact for Returns */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Retour aanmelden</h2>
            <p className="text-lg mb-6 opacity-90">
              Wil je een product retourneren? Neem contact met ons op.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@stylo.nl" 
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Email ons
              </a>
              <a 
                href="tel:+31620176727" 
                className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors"
              >
                Bel ons
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





