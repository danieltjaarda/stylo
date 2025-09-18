'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Filter, Grid, List, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/products';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchParams = useSearchParams();

  // Check if we're on a specific category page
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Get current category from URL
  const currentCategory = searchParams.get('category') || selectedCategory;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockProducts.map(product => product.category)));
    return ['all', ...cats];
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedCategory, sortBy]);

  // Check if we're on bureau stoelen category
  const isBureauStoelenCategory = currentCategory === 'ergonomische-bureaustoelen';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section for Bureau Stoelen */}
      {isBureauStoelenCategory && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8 text-sm text-gray-600">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-gray-900">Homepage</Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-900">Ergonomische bureaustoelen</li>
                </ol>
              </nav>
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SitOne Card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    21% korting
                  </span>
                </div>
                <div className="relative p-8 h-[500px] flex flex-col">
                  <div className="z-10">
                    <span className="text-sm font-semibold uppercase tracking-wide mb-2 block" style={{ color: '#fe8b51' }}>Nieuw</span>
                    <h2 className="text-4xl font-bold mb-4 text-white">SeatPro</h2>
                  </div>
                  <div className="flex-1 flex items-end justify-between">
                    <Link
                      href="/products/sitone-ergonomische-bureustoel"
                      className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-colors z-10"
                      style={{ backgroundColor: '#9dafaa' }}
                    >
                      Meer leren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[500px]">
                      <img
                        src="/svg icons/SeatPro schim 1.1.jpg"
                        alt="SitOne bureausstoel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SitPro Card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900">
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    16% korting
                  </span>
                </div>
                <div className="relative p-8 h-[500px] flex flex-col">
                  <div className="z-10">
                    <span className="text-sm font-semibold uppercase tracking-wide mb-2 block" style={{ color: '#fe8b51' }}>Nieuw</span>
                    <h2 className="text-4xl font-bold mb-4 text-white">SeatPro</h2>
                  </div>
                  <div className="flex-1 flex items-end justify-between">
                    <Link
                      href="/products/seatpro-ergonomische-bureau-stoel"
                      className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-colors z-10"
                      style={{ backgroundColor: '#9dafaa' }}
                    >
                      Meer leren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[500px]">
                      <img
                        src="/svg icons/SeatPro 2.1.jpg"
                        alt="SitPro bureausstoel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isBureauStoelenCategory ? 'Ergonomische Bureau Stoelen' : 'Alle Producten'}
          </h1>
          <p className="text-gray-600">
            {isBureauStoelenCategory 
              ? 'Ontdek ons complete assortiment premium ergonomische bureau stoelen' 
              : 'Ontdek ons complete assortiment premium kantoorproducten'
            }
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d6a99e]"
              >
                <option value="all">Alle Categorieën</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d6a99e]"
              >
                <option value="name">Sorteer op Naam</option>
                <option value="price-low">Prijs: Laag naar Hoog</option>
                <option value="price-high">Prijs: Hoog naar Laag</option>
                <option value="rating">Hoogste Beoordeling</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'grid' ? { backgroundColor: '#d6a99e' } : {}}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'list' ? { backgroundColor: '#d6a99e' } : {}}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 'en' : ''} gevonden
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Geen producten gevonden voor de geselecteerde filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

