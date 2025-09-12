export default function Kortingen() {
  const activeDeals = [
    {
      id: 1,
      title: "Herfst Deals",
      description: "Tot 25% korting op geselecteerde bureaustoelen",
      discount: "25%",
      validUntil: "31 maart 2025",
      code: "HERFST25",
      category: "Bureaustoelen"
    },
    {
      id: 2,
      title: "Bureau Bundle",
      description: "Koop een bureau + stoel en krijg 15% korting op het totaal",
      discount: "15%",
      validUntil: "15 februari 2025", 
      code: "BUNDLE15",
      category: "Combinatie"
    },
    {
      id: 3,
      title: "Eerste Bestelling",
      description: "10% korting voor nieuwe klanten op hun eerste bestelling",
      discount: "10%",
      validUntil: "Altijd geldig",
      code: "WELKOM10",
      category: "Nieuwe klanten"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Actieve Kortingen</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Profiteer van onze huidige aanbiedingen en bespaar op je bestelling
          </p>
        </div>

        {/* Active Deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activeDeals.map((deal) => (
            <div key={deal.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold text-white mb-4"
                  style={{ backgroundColor: '#FD8B51' }}
                >
                  {deal.discount}
                </div>
                <span className="inline-block px-3 py-1 bg-white text-gray-700 text-sm rounded-full">
                  {deal.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{deal.title}</h3>
              <p className="text-gray-600 text-center mb-6">{deal.description}</p>
              
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Kortingscode:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 px-3 py-2 rounded text-lg font-mono font-bold">
                      {deal.code}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(deal.code)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Kopieer code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                Geldig tot: {deal.validUntil}
              </div>
            </div>
          ))}
        </div>

        {/* How to use */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hoe gebruik je een kortingscode?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Winkelwagen</h3>
              <p className="text-sm text-gray-600">Voeg producten toe aan je winkelwagen</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Checkout</h3>
              <p className="text-sm text-gray-600">Ga naar de checkout pagina</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Code invoeren</h3>
              <p className="text-sm text-gray-600">Vul de kortingscode in het daarvoor bestemde veld</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Besparen!</h3>
              <p className="text-sm text-gray-600">De korting wordt automatisch toegepast</p>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Mis geen enkele aanbieding</h2>
          <p className="text-lg mb-6 opacity-90">
            Schrijf je in voor onze nieuwsbrief en ontvang exclusieve kortingen.
          </p>
          <a 
            href="/#newsletter" 
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Inschrijven voor nieuwsbrief
          </a>
        </div>
      </div>
    </div>
  );
}

