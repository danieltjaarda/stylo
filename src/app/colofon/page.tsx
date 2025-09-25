import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colofon | DESKNA',
  description: 'Colofon en bedrijfsgegevens van DESKNA, specialist in ergonomische bureaustoelen en zit-sta bureaus.',
};

export default function Colofon() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Colofon</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Informatie over Stylo en deze website
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Bedrijfsgegevens</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p><strong>Bedrijfsnaam:</strong> Stylo</p>
            <p><strong>Adres:</strong> Amsterdam, Nederland</p>
            <p><strong>Telefoon:</strong> 085 060 2482</p>
            <p><strong>E-mail:</strong> info@stylo.nl</p>
            <p><strong>Website:</strong> www.stylo.nl</p>
          </div>

          <h2>Website Informatie</h2>
          <p>
            Deze website is eigendom van Stylo en wordt gebruikt voor de verkoop van 
            bureaumeubilair en ergonomische werkplek oplossingen.
          </p>

          <h2>Intellectueel Eigendom</h2>
          <p>
            Alle content op deze website, inclusief teksten, afbeeldingen, logo's en design, 
            is eigendom van Stylo en beschermd door auteursrecht. Gebruik zonder toestemming 
            is niet toegestaan.
          </p>

          <h2>Disclaimer</h2>
          <p>
            Stylo streeft ernaar de informatie op deze website accuraat en up-to-date te houden. 
            Er kunnen echter geen rechten worden ontleend aan eventuele onjuistheden of verouderde informatie.
          </p>

          <h2>Cookies</h2>
          <p>
            Deze website maakt gebruik van cookies om de gebruikerservaring te verbeteren en 
            website statistieken bij te houden. Meer informatie hierover vind je in ons 
            <a href="/privacy" className="text-blue-600 hover:text-blue-800">privacybeleid</a>.
          </p>

          <h2>Klachten</h2>
          <p>
            Voor klachten over onze producten of diensten kun je contact opnemen via 
            <a href="mailto:info@stylo.nl" className="text-blue-600 hover:text-blue-800">info@stylo.nl</a> 
            of telefonisch via 085 060 2482.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Laatst bijgewerkt: Januari 2025
          </p>
        </div>
      </div>
    </div>
  );
}



