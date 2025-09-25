import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | DESKNA - Ergonomische Werkplekken',
  description: 'Neem contact op met DESKNA voor vragen over ergonomische bureaustoelen en zit-sta bureaus. Persoonlijk advies, productinformatie en klantenservice. Bereikbaar via telefoon 085 060 2482, e-mail of contactformulier.',
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact met ons
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Heb je een vraag over onze producten of service? Neem gerust contact met ons op. 
            We helpen je graag verder!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Contactgegevens
            </h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefoon</h3>
                  <p className="text-gray-600">085 060 2482</p>
                  <p className="text-sm text-gray-500">Voor vragen en ondersteuning</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <p className="text-gray-600">info@deskna.nl</p>
                  <p className="text-sm text-gray-500">We reageren binnen 24 uur</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Openingstijden</h3>
                  <div className="text-gray-600">
                    <p>Maandag - Vrijdag: 07:00 - 16:00</p>
                    <p>Weekend: Gesloten</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                  <div className="text-gray-600">
                    <p>DESKNA</p>
                    <p>Nederland</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Snelle acties</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:0850602482"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Bel ons nu
                </a>
                <a 
                  href="mailto:info@deskna.nl"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Stuur e-mail
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Stuur ons een bericht
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Voornaam
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
                    Achternaam
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
                  E-mailadres
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
                  Telefoonnummer (optioneel)
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
                  Onderwerp
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer een onderwerp</option>
                  <option value="product-vraag">Productvraag</option>
                  <option value="bestelling">Bestelling</option>
                  <option value="retour">Retour/Ruiling</option>
                  <option value="technische-ondersteuning">Technische ondersteuning</option>
                  <option value="klacht">Klacht</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Beschrijf je vraag of opmerking..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Verstuur bericht
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-gray-600">
              Misschien staat je vraag hier al tussen
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hoe kan ik contact opnemen?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Je kunt ons bereiken via telefoon (085 060 2482), e-mail (info@deskna.nl) of via het contactformulier op deze pagina.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">Wat zijn de openingstijden?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We zijn bereikbaar van maandag tot vrijdag van 07:00 tot 16:00 uur.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hoe snel krijg ik antwoord?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We reageren binnen 24 uur op e-mails en berichten via het contactformulier. Voor telefonische vragen zijn we direct beschikbaar tijdens openingstijden.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">Kan ik langskomen in een showroom?</h3>
                <p className="text-gray-600 text-sm">
                  Neem contact met ons op om de mogelijkheden te bespreken en een afspraak in te plannen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
