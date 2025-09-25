'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Package, Ruler, Wrench, Shield, Sparkles, Info } from 'lucide-react';

interface ProductDetails {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  seo: {
    title: string;
    description: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: Array<{
    url: string;
    altText: string;
    width: number;
    height: number;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    weight: number;
    weightUnit: string;
    sku: string;
  }>;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  metafields: {
    specifications?: { value: string; type: string };
    dimensions?: { value: string; type: string };
    materials?: { value: string; type: string };
    warranty?: { value: string; type: string };
    care_instructions?: { value: string; type: string };
    features?: { value: string; type: string };
  };
}

interface ProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productHandle: string;
}

export default function ProductInfoModal({ isOpen, onClose, productHandle }: ProductInfoModalProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('specifications');

  useEffect(() => {
    if (isOpen && productHandle) {
      fetchProductDetails();
    }
  }, [isOpen, productHandle]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching product details for:', productHandle);
      const response = await fetch(`/api/products/${productHandle}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.product) {
        setProductDetails(data.product);
        console.log('✅ Product details loaded:', data.product.title);
      } else {
        throw new Error(data.error || 'Failed to load product details');
      }
    } catch (err) {
      console.error('❌ Error fetching product details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseMetafieldValue = (value: string) => {
    try {
      // Try to parse as JSON first
      return JSON.parse(value);
    } catch {
      // If not JSON, return as string
      return value;
    }
  };

  const renderMetafieldContent = (metafield: { value: string; type: string }) => {
    const parsedValue = parseMetafieldValue(metafield.value);
    
    if (Array.isArray(parsedValue)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {parsedValue.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
          ))}
        </ul>
      );
    }
    
    if (typeof parsedValue === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(parsedValue).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium text-gray-700 capitalize">{key.replace('_', ' ')}:</span>
              <span className="text-gray-600">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return <p className="text-gray-600 whitespace-pre-wrap">{String(parsedValue)}</p>;
  };

  const tabs = [
    { id: 'specifications', label: 'Specificaties', icon: Package },
    { id: 'dimensions', label: 'Afmetingen', icon: Ruler },
    { id: 'materials', label: 'Materialen', icon: Sparkles },
    { id: 'warranty', label: 'Garantie', icon: Shield },
    { id: 'care_instructions', label: 'Onderhoud', icon: Wrench },
    { id: 'features', label: 'Features', icon: Info },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Product informatie laden...' : productDetails?.title || 'Product Details'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  )}

                  {error && (
                    <div className="text-center py-12">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 font-medium">Error loading product details</p>
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                        <button
                          onClick={fetchProductDetails}
                          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Probeer opnieuw
                        </button>
                      </div>
                    </div>
                  )}

                  {productDetails && !isLoading && !error && (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Product Informatie</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Merk:</span>
                              <span className="font-medium">{productDetails.vendor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{productDetails.productType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prijs:</span>
                              <span className="font-medium">
                                {formatPrice(
                                  productDetails.priceRange.minVariantPrice.amount,
                                  productDetails.priceRange.minVariantPrice.currencyCode
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Toegevoegd:</span>
                              <span className="font-medium">{formatDate(productDetails.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Varianten</h4>
                          <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                            {productDetails.variants.map((variant, index) => (
                              <div key={variant.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">{variant.title}</span>
                                <div className="text-right">
                                  <span className="font-medium">
                                    {formatPrice(variant.price.amount, variant.price.currencyCode)}
                                  </span>
                                  {variant.compareAtPrice && (
                                    <div className="text-xs text-gray-500 line-through">
                                      {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {productDetails.tags.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {productDetails.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Information Tabs */}
                      {Object.keys(productDetails.metafields).length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Gedetailleerde Informatie</h4>
                          
                          {/* Tab Navigation */}
                          <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
                            {tabs
                              .filter(tab => productDetails.metafields[tab.id as keyof typeof productDetails.metafields])
                              .map((tab) => {
                                const Icon = tab.icon;
                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                      activeTab === tab.id
                                        ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                  </button>
                                );
                              })}
                          </div>

                          {/* Tab Content */}
                          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                            {tabs
                              .filter(tab => tab.id === activeTab)
                              .map((tab) => {
                                const metafield = productDetails.metafields[tab.id as keyof typeof productDetails.metafields];
                                if (!metafield) return null;

                                return (
                                  <div key={tab.id}>
                                    <h5 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                      <tab.icon className="w-5 h-5 mr-2" />
                                      {tab.label}
                                    </h5>
                                    {renderMetafieldContent(metafield)}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {productDetails.description && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h4>
                          <div className="prose prose-sm max-w-none">
                            {productDetails.descriptionHtml ? (
                              <div dangerouslySetInnerHTML={{ __html: productDetails.descriptionHtml }} />
                            ) : (
                              <p className="text-gray-600 whitespace-pre-wrap">{productDetails.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sluiten
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
