export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "5 Tips voor een Ergonomische Werkplek",
      excerpt: "Ontdek hoe je jouw werkplek kunt optimaliseren voor betere gezondheid en productiviteit.",
      date: "15 januari 2025",
      readTime: "5 min",
      category: "Ergonomie"
    },
    {
      id: 2,
      title: "Zit-Sta Bureau: Waarom de Investering het Waard is",
      excerpt: "De voordelen van een zit-sta bureau en hoe het je werkdag kan transformeren.",
      date: "10 januari 2025",
      readTime: "7 min",
      category: "Productadvies"
    },
    {
      id: 3,
      title: "De Perfecte Bureustoel Kiezen: Complete Gids",
      excerpt: "Alles wat je moet weten over het kiezen van de juiste bureustoel voor jouw behoeften.",
      date: "5 januari 2025",
      readTime: "10 min",
      category: "Koopadvies"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Tips, advies en nieuws over ergonomische werkplekken
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{post.category}</span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <a 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700"
                >
                  Lees meer
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meer artikelen komen binnenkort</h2>
          <p className="text-gray-600 mb-6">
            We werken hard aan meer nuttige content over ergonomie en werkplekoptimalisatie.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Stel een vraag
          </a>
        </div>
      </div>
    </div>
  );
}

