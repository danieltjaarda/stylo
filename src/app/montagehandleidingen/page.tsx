export default function Montagehandleidingen() {
  const manuals = [
    {
      id: 1,
      title: "HomeOne Bureau - Montagehandleiding",
      description: "Stap-voor-stap instructies voor het monteren van uw HomeOne zit-sta bureau",
      type: "Bureau",
      downloadUrl: "#",
      videoUrl: "#"
    },
    {
      id: 2,
      title: "SeatPro Bureustoel - Montage",
      description: "Complete gids voor het in elkaar zetten van uw SeatPro ergonomische bureustoel",
      type: "Bureustoel", 
      downloadUrl: "#",
      videoUrl: "#"
    },
    {
      id: 3,
      title: "Monitorarm - Installatie",
      description: "Handleiding voor het correct installeren van uw monitorarm",
      type: "Accessoire",
      downloadUrl: "#",
      videoUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Montagehandleidingen</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Stap-voor-stap instructies voor het monteren van uw Stylo producten
          </p>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Algemene Montagetips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Voor de montage</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Controleer of alle onderdelen aanwezig zijn</li>
                <li>• Zorg voor voldoende ruimte (2x2 meter)</li>
                <li>• Leg een deken neer om krassen te voorkomen</li>
                <li>• Houd het meegeleverde gereedschap bij de hand</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Tijdens de montage</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Volg de instructies stap voor stap</li>
                <li>• Draai schroeven eerst handvast aan</li>
                <li>• Controleer alle verbindingen voor gebruik</li>
                <li>• Gemiddelde montagetijd: 30-45 minuten</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Manuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {manuals.map((manual) => (
            <div key={manual.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full mb-3">
                  {manual.type}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{manual.title}</h3>
                <p className="text-gray-600 text-sm">{manual.description}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <a 
                  href={manual.downloadUrl}
                  className="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6-2V4" />
                  </svg>
                  PDF Downloaden
                </a>
                <a 
                  href={manual.videoUrl}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                  </svg>
                  Video Bekijken
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Montage Service */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Liever laten monteren?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Geen tijd of zin om zelf te monteren? Onze professionals doen het graag voor u.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">€49</div>
              <p className="text-sm text-gray-600">Montagekosten</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">2-5</div>
              <p className="text-sm text-gray-600">Werkdagen levertijd</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <p className="text-sm text-gray-600">Professioneel gemonteerd</p>
            </div>
          </div>
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Montageservice boeken
          </a>
        </div>

        {/* Help */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hulp nodig bij de montage?</h2>
          <p className="text-gray-600 mb-6">
            Kom je er niet uit? Ons team helpt je graag verder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@stylo.nl" 
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Email ondersteuning
            </a>
            <a 
              href="tel:+31620176727" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Bel voor hulp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

