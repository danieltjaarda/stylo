'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCartStore();

  const total = getTotalPrice();
  const shipping = total > 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-60" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Winkelwagen
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={toggleCart}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Sluit paneel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <ShoppingBag className="h-12 w-12 mb-4" />
                          <p className="text-lg">Je winkelwagen is leeg</p>
                          <p className="text-sm">Voeg producten toe om te beginnen</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  €{item.product.price.toFixed(2)}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotaal:</span>
                            <span>€{total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Verzending:</span>
                            <span>
                              {shipping === 0 ? (
                                <span className="text-green-600">Gratis</span>
                              ) : (
                                `€${shipping.toFixed(2)}`
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-base border-t pt-2">
                            <span>Totaal:</span>
                            <span>€{finalTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="w-full text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center block"
                            style={{ backgroundColor: '#d6a99e' }}
                          >
                            Naar Checkout
                          </Link>
                          <button
                            onClick={clearCart}
                            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Winkelwagen Legen
                          </button>
                        </div>

                        {shipping > 0 && (
                          <p className="text-xs text-gray-600 mt-2 text-center">
                            Bestel nog €{(50 - total).toFixed(2)} voor gratis verzending!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}