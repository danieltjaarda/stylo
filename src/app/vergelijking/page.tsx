'use client';

import { useState, useEffect } from 'react';
import { Check, X, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function ProductComparison() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['', '']);
  const [compareProducts, setCompareProducts] = useState<any[]>([null, null]);
  const addToCart = useCartStore(state => state.addItem);

  // Pre-select eerste twee producten voor demo
  useEffect(() => {
    const firstTwoProducts = mockProducts.slice(0, 2).map(p => p.id);
    setSelectedProducts(firstTwoProducts);
  }, []);

  // Update vergelijkingsproducten wanneer selectie verandert
  useEffect(() => {
    const products = selectedProducts.map(id => 
      id ? mockProducts.find(p => p.id === id) || null : null
    );
    setCompareProducts(products);
  }, [selectedProducts]);

  const handleProductSelect = (productId: string, index: number) => {
    const newSelected = [...selectedProducts];
    newSelected[index] = productId;
    setSelectedProducts(newSelected);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const getFeatureValue = (product: any, feature: string) => {
    if (!product) return null;
    
    const features: { [key: string]: (p: any) => string | boolean } = {
      'Prijs': (p) => `€${p.price.toFixed(2)}`,
      'Categorie': (p) => p.category,
      'Voorraad': (p) => p.stock > 0,
      'Rating': (p) => `${p.rating}/5`,
      'Reviews': (p) => `${p.reviews} reviews`,
      'Ergonomisch': (p) => p.category.includes('ergonomische') || p.name.toLowerCase().includes('ergonomisch'),
      'Hoogteverstelling': (p) => p.category.includes('bureau') || p.name.toLowerCase().includes('bureau'),
      'Wielen': (p) => p.category.includes('stoel'),
      'Opvouwbaar': (p) => p.name.toLowerCase().includes('opvouwbaar') || p.name.toLowerCase().includes('inklapbaar'),
      'Materiaal': (p) => p.category.includes('hout') ? 'Hout' : p.category.includes('staal') ? 'Staal' : 'Mixed materiaal',
      'Garantie': (p) => '2 jaar',
      'Gratis verzending': (p) => true,
      'Retourperiode': (p) => '30 dagen',
    };

    const featureFunc = features[feature];
    if (featureFunc) {
      return featureFunc(product);
    }
    return null;
  };

  const features = [
    'Prijs',
    'Categorie', 
    'Voorraad',
    'Rating',
    'Reviews',
    'Ergonomisch',
    'Hoogteverstelling',
    'Wielen',
    'Opvouwbaar',
    'Materiaal',
    'Garantie',
    'Gratis verzending',
    'Retourperiode'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Vergelijk alle producten
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Vind het perfecte product voor jouw werkplek
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white">
          <table className="w-full border-collapse">
            {/* Product Selection Row */}
            <thead>
              <tr>
                <th className="text-left p-6 w-1/3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Keuzemenu</span>
                </th>
                {[0, 1].map(index => (
                  <th key={index} className="p-6 w-1/3 border-b border-gray-200">
                    <div className="relative">
                      <select
                        value={selectedProducts[index] || ''}
                        onChange={(e) => handleProductSelect(e.target.value, index)}
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-sm"
                      >
                        <option value="">Selecteer een product</option>
                        {mockProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Product Images & Basic Info */}
              <tr>
                <td className="p-6 border-b border-gray-100 font-medium text-gray-500 text-sm">
                  Uitvoering
                </td>
                {compareProducts.map((product, index) => (
                  <td key={index} className="p-6 border-b border-gray-100 text-center">
                    {product ? (
                      <div className="space-y-4">
                        <div className="relative group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-48 h-48 object-cover rounded-lg mx-auto shadow-sm"
                          />
                          <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full shadow-md hover:shadow-lg">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < Math.floor(product.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.reviews})</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Geen product geselecteerd</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Nieuw Badge */}
              <tr className="bg-gray-50">
                <td className="p-6 border-b border-gray-100"></td>
                {compareProducts.map((product, index) => (
                  <td key={index} className="p-6 border-b border-gray-100 text-center">
                    {product && (
                      <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                        Nieuw
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="p-6 border-b border-gray-100 font-medium text-gray-500 text-sm">
                  Prijs
                </td>
                {compareProducts.map((product, index) => (
                  <td key={index} className="p-6 border-b border-gray-100 text-center">
                    {product && (
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          €{product.price.toFixed(2)}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            €{product.compareAtPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr className="bg-gray-50">
                <td className="p-6 border-b border-gray-100"></td>
                {compareProducts.map((product, index) => (
                  <td key={index} className="p-6 border-b border-gray-100 text-center">
                    {product && (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          In Winkelwagen
                        </button>
                        <Link
                          href={`/products/${product.id}`}
                          className="block w-full text-blue-600 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                        >
                          Meer informatie
                        </Link>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Features Section Header */}
              <tr>
                <td colSpan={3} className="p-6 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Specificaties</h2>
                </td>
              </tr>

              {/* Features Comparison */}
              {features.map((feature, featureIndex) => (
                <tr key={feature} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-6 font-medium text-gray-900 border-b border-gray-100 text-sm">
                    {feature}
                  </td>
                  {compareProducts.map((product, productIndex) => (
                    <td key={productIndex} className="p-6 text-center border-b border-gray-100">
                      {product ? (
                        <div className="flex items-center justify-center">
                          {(() => {
                            const value = getFeatureValue(product, feature);
                            if (typeof value === 'boolean') {
                              return value ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <X className="w-5 h-5 text-red-500" />
                              );
                            } else if (value) {
                              return (
                                <span className="text-gray-900 text-sm font-medium">
                                  {value}
                                </span>
                              );
                            } else {
                              return <span className="text-gray-400 text-sm">—</span>;
                            }
                          })()}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="py-12 text-center">
          <p className="text-gray-600 mb-4">
            Selecteer producten in de dropdowns hierboven om ze te vergelijken
          </p>
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
          >
            Bekijk alle producten →
          </Link>
        </div>
      </div>
    </div>
  );
}