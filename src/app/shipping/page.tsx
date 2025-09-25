import { Metadata } from 'next';
import { Truck, Clock, Package, Shield, MapPin, Euro } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verzending & Levering | DESKNA',
  description: 'Alles over onze verzending en levering van ergonomische bureaustoelen en zit-sta bureaus. Gratis verzending vanaf €50, snelle levering binnen 2-5 werkdagen en veilige verpakking voor al je DESKNA kantoorproducten.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verzending & Levering
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bij DESKNA zorgen we voor snelle, veilige en betrouwbare levering van al je ergonomische kantoorproducten.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Verzendopties
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Standard Shipping */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Package className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Standaard Verzending</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>2-5 werkdagen</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Euro className="w-5 h-5 mr-2" />
                  <span>Gratis bij bestellingen vanaf €50</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Nederland & België</span>
                </div>
              </div>
            </div>

            {/* Express Shipping */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Truck className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Express Verzending</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>1-2 werkdagen</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Euro className="w-5 h-5 mr-2" />
                  <span>€9,95 verzendkosten</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Nederland</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Verzendkosten
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Nederland (standaard)</span>
                <span className="font-medium">Gratis vanaf €50</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Nederland (express)</span>
                <span className="font-medium">€9,95</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">België</span>
                <span className="font-medium">€12,95</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Duitsland</span>
                <span className="font-medium">€19,95</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Grote producten
            </h3>
            <p className="text-gray-600 mb-4">
              Voor grote producten zoals zit-sta bureaus hanteren we speciale verzendkosten:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Zit-sta bureaus: €49,95</li>
              <li>• Bureau accessoires: Gratis vanaf €50</li>
              <li>• Combinatie orders: Hoogste tarief van toepassing</li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Levertijden
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Op voorraad</h3>
                <p className="text-gray-600">
                  Producten die op voorraad zijn worden binnen 1-2 werkdagen verzonden.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Op bestelling</h3>
                <p className="text-gray-600">
                  Sommige producten worden speciaal voor jou besteld. Levertijd: 2-4 weken.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Maatwerk</h3>
                <p className="text-gray-600">
                  Maatwerk producten hebben een levertijd van 4-6 weken.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Packaging & Security */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Veilige verpakking
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Al onze producten worden zorgvuldig verpakt om beschadiging tijdens transport te voorkomen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stevige verpakking</h3>
              <p className="text-sm text-gray-600">
                Dubbelwandige kartonnen dozen en beschermend materiaal
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verzekerde verzending</h3>
              <p className="text-sm text-gray-600">
                Alle pakketten zijn verzekerd tegen verlies en beschadiging
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track & Trace</h3>
              <p className="text-sm text-gray-600">
                Volg je bestelling realtime met onze track & trace service
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Veelgestelde vragen over verzending
          </h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Wanneer wordt mijn bestelling verzonden?
              </h3>
              <p className="text-gray-600">
                Bestellingen die voor 16:00 zijn geplaatst en betaald, worden dezelfde dag nog verzonden (werkdagen).
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kan ik mijn bestelling volgen?
              </h3>
              <p className="text-gray-600">
                Ja, zodra je bestelling is verzonden ontvang je een Track & Trace code per e-mail waarmee je de status kunt volgen.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Wat als ik niet thuis ben bij levering?
              </h3>
              <p className="text-gray-600">
                De bezorger probeert het pakket af te leveren. Als je niet thuis bent, wordt het naar een afhaalpunt gebracht of krijg je een nieuwe bezorgtijd aangeboden.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Leveren jullie ook in het weekend?
              </h3>
              <p className="text-gray-600">
                Standaard leveren we van maandag tot en met vrijdag. Weekend levering is mogelijk tegen meerprijs voor bepaalde producten.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vragen over je verzending?
          </h2>
          <p className="text-gray-600 mb-6">
            Ons klantenservice team staat klaar om je te helpen met al je vragen over verzending en levering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact opnemen
            </a>
            <a 
              href="tel:0850602482" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              085 060 2482
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
