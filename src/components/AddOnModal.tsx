'use client';

import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Star, ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { getShopifyProduct } from '@/services/shopifyService';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface AddOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  addOnId: string;
  addOnHandle?: string;
  onProductAdded?: (addOnId: string, addOnHandle?: string) => void;
}

export default function AddOnModal({ isOpen, onClose, addOnId, addOnHandle, onProductAdded }: AddOnModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const addItemSilent = useCartStore(state => state.addItemSilent);

  const fetchAddOnDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching add-on details for:', addOnHandle || addOnId);
      
      const productData = await getShopifyProduct(addOnHandle || addOnId);
      
      if (productData) {
        console.log('✅ Add-on product loaded:', productData);
        setProduct(productData);
        // Set first variant as default
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } else {
        setError('Product niet gevonden');
      }
    } catch (error) {
      console.error('❌ Error fetching add-on details:', error);
      setError('Fout bij het laden van productdetails');
    } finally {
      setLoading(false);
    }
  }, [addOnHandle, addOnId]);

  useEffect(() => {
    if (isOpen && (addOnId || addOnHandle)) {
      // Reset state when modal opens
      setAddedToCart(false);
      setQuantity(1);
      setSelectedVariant(null);
      fetchAddOnDetails();
    }
  }, [isOpen, addOnId, addOnHandle, fetchAddOnDetails]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant) return;

    // Create product object for cart
    const productForCart: Product = {
      id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      image: selectedVariant.image || product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      variants: product.variants,
      options: product.options,
      handle: product.handle,
    };

    // Add to cart silently (without opening cart)
    for (let i = 0; i < quantity; i++) {
      addItemSilent(productForCart);
    }
    
    setAddedToCart(true);
    
    // Notify parent component that product was added
    if (onProductAdded) {
      onProductAdded(addOnId, addOnHandle);
    }
    
    // Close modal after 1.5 seconds and reset state
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
    }, 1500);
  }, [product, selectedVariant, quantity, addItemSilent, onClose, onProductAdded, addOnId, addOnHandle]);

  const adjustQuantity = useCallback((change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }, [quantity]);

  const formatPrice = useCallback((price: number) => {
    return `€${price.toFixed(2)}`;
  }, []);

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Product Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="ml-3 text-gray-600">Product laden...</span>
                    </div>
                  )}

                  {error && (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={fetchAddOnDetails}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Opnieuw proberen
                      </button>
                    </div>
                  )}

                  {product && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Image */}
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={selectedVariant?.image || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Additional Images */}
                        {product.images && product.images.length > 1 && (
                          <div className="flex space-x-2 overflow-x-auto">
                            {product.images.slice(1, 5).map((image, index) => (
                              <div key={index} className="flex-shrink-0">
                                <img
                                  src={typeof image === 'string' ? image : image.url}
                                  alt={`${product.name} ${index + 2}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                                  onClick={() => {
                                    // Find variant with this image
                                    const variantWithImage = product.variants?.find((v: any) => v.image === image);
                                    if (variantWithImage) {
                                      setSelectedVariant(variantWithImage);
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-4">
                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating || 4.5} ({Math.floor(Math.random() * 200) + 50} reviews)
                          </span>
                        </div>

                        {/* Product Name */}
                        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>

                        {/* Price */}
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(selectedVariant?.price || product.price)}
                          </span>
                          {selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(selectedVariant.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Description - Limited to 2 lines */}
                        <div className="text-gray-700 text-sm leading-relaxed">
                          <p 
                            className="line-clamp-2"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {product.description}
                          </p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 1 && (
                          <div className="space-y-4">
                            {/* Variant selection */}
                            <div>
                              <label className="text-sm font-medium text-gray-900 mb-2 block">
                                Variant: {selectedVariant?.title || 'Selecteer variant'}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant: any) => {
                                  const isSelected = selectedVariant?.id === variant.id;
                                  
                                  return (
                                    <button
                                      key={variant.id}
                                      onClick={() => setSelectedVariant(variant)}
                                      className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                                        isSelected
                                          ? 'border-gray-900 bg-gray-900 text-white'
                                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                      }`}
                                    >
                                      {variant.title}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">Aantal:</label>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => adjustQuantity(-1)}
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                              onClick={() => adjustQuantity(1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={handleAddToCart}
                          disabled={addedToCart || !selectedVariant?.availableForSale}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                            addedToCart
                              ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                              : !selectedVariant?.availableForSale
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900'
                          }`}
                        >
                          {addedToCart ? (
                            <>
                              <Check className="w-5 h-5" />
                              <span>Toegevoegd aan winkelwagen</span>
                            </>
                          ) : !selectedVariant?.availableForSale ? (
                            <span>Niet beschikbaar</span>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              <span>Toevoegen aan winkelwagen</span>
                            </>
                          )}
                        </button>

                        {/* Features */}
                        <div className="pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">Gratis verzending</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">30 dagen retour</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">2 jaar garantie</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-700">Expert support</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
