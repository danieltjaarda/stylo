'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import EmailPopupTrigger from './EmailPopupTrigger';
import { subscribeToKlaviyo, trackKlaviyoEvent, sendDiscountEmail } from '@/services/klaviyoService';

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('deskna-email-popup-seen');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // If popup was seen before, show trigger button
      setShowTrigger(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user has seen the popup
    localStorage.setItem('deskna-email-popup-seen', 'true');
    // Show trigger button after closing
    setShowTrigger(true);
  };

  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  const handleSaveLater = () => {
    handleClose();
    // Set a shorter delay for next time (1 day)
    localStorage.setItem('deskna-email-popup-delay', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // Subscribe to Klaviyo with new enhanced API
      const result = await subscribeToKlaviyo(email, undefined, {
        popup_source: 'discount_popup',
        discount_type: '5_percent',
        page_url: window.location.href,
        user_agent: navigator.userAgent
      });

      if (result.success) {
        // The discount code is now generated server-side and returned
        const discountCode = result.discountCode;
        const expiresAt = result.expiresAt;
        const subscriptionStatus = result.subscriptionStatus;
        const doubleOptInEnabled = result.doubleOptInEnabled;
        
        console.log('✅ Newsletter signup successful:', {
          discountCode,
          expiresAt,
          subscriptionStatus,
          doubleOptInEnabled,
          isIdempotent: result.isIdempotent
        });

        // Store discount code in localStorage for user reference
        if (discountCode) {
          localStorage.setItem('deskna-discount-code', discountCode);
        }
        if (expiresAt) {
          localStorage.setItem('deskna-discount-expires', expiresAt);
        }

        setIsSubmitted(true);
        localStorage.setItem('deskna-email-popup-seen', 'true');
        
        // Show different message based on status
        if (result.demoMode) {
          alert(`🎉 Demo Mode: Je kortingscode is ${discountCode}! (Klaviyo integratie is uitgeschakeld)`);
        } else if (subscriptionStatus === 'profile_creation_failed') {
          alert(`🎉 Je kortingscode is ${discountCode}! (Profiel kon niet worden aangemaakt, maar kortingscode werkt wel)`);
        } else if (doubleOptInEnabled && subscriptionStatus === 'pending') {
          alert(`🎉 Je kortingscode is ${discountCode}! Check ook je email om je inschrijving te bevestigen.`);
        } else if (subscriptionStatus === 'not_subscribed_to_list') {
          alert(`🎉 Je kortingscode is ${discountCode}! (Newsletter lijst niet geconfigureerd)`);
        }
        
        // Close popup after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setShowTrigger(true);
        }, 2000);
      } else {
        console.error('Newsletter signup failed:', result.error);
        alert('Er ging iets mis bij het aanmelden. Probeer het opnieuw.');
      }
      
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      alert('Er ging iets mis bij het aanmelden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-2xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                
                {/* Bureau image floating above popup */}
                <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative w-[600px] h-80">
                    <Image
                      src="/svg icons/transparant bureau.png"
                      alt="DESKNA Bureau"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
                
                {/* Close button */}
                <button
                  type="button"
                  className="absolute right-4 top-4 z-30 rounded-full bg-white/90 p-2 text-gray-400 hover:text-gray-600 hover:bg-white transition-colors shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <span className="sr-only">Sluiten</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Header with extra padding for floating image */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 px-8 pt-24 pb-4 rounded-t-2xl">
                  <div className="h-8"></div> {/* Spacer for floating image */}
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                  {!isSubmitted ? (
                    <>
                      {/* Title */}
                      <div className="text-center mb-6 mt-4">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">
                          Ontgrendel <span style={{ color: '#fe8b51' }}>voor 5% korting!</span>
                        </h2>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Voer je e-mailadres in"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || !email}
                          className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? 'BEZIG...' : 'ONTGRENDEL JE KORTING'}
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveLater}
                          className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          KORTING BEWAREN VOOR LATER
                        </button>
                      </form>

                    </>
                  ) : (
                    /* Success state */
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Bedankt!</h3>
                      <p className="text-gray-600 mb-4">
                        Je kortingscode is onderweg naar je inbox!
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium p-3 border border-gray-200 rounded-lg">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Check ook je spam/ongewenste e-mail folder!</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo tab at bottom */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-full w-20 h-16 flex items-center justify-center shadow-lg">
                    <Image
                      src="/logo e-mail.png"
                      alt="DESKNA"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        </Dialog>
      </Transition.Root>
      
      {/* Trigger button - show when appropriate */}
      {showTrigger && !isOpen && (
        <EmailPopupTrigger onOpenPopup={handleOpenPopup} />
      )}
    </>
   );
}
