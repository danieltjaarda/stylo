'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

declare global {
  interface Window {
    clarity: any;
  }
}

export default function MicrosoftClarity() {
  const { consent } = useCookieConsent();
  const pathname = usePathname();

  useEffect(() => {
    // Don't load Clarity on checkout pages to avoid Shopify conflicts
    const isCheckoutPage = pathname?.includes('/checkout') || 
                          (typeof window !== 'undefined' && window.location.href.includes('checkout'));
    
    if (consent?.statistics && typeof window !== 'undefined' && !isCheckoutPage) {
      // Check if Clarity is already loaded
      if (window.clarity) {
        return;
      }

      // Microsoft Clarity implementation
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "tbt059mxwo");
      `;
      document.head.appendChild(script);

      console.log('Microsoft Clarity loaded');
    }
  }, [consent?.statistics, pathname]);

  // Clear Clarity if consent is withdrawn
  useEffect(() => {
    if (!consent?.statistics && typeof window !== 'undefined' && window.clarity) {
      // Stop Clarity tracking
      try {
        window.clarity('stop');
        console.log('Microsoft Clarity stopped');
      } catch (error) {
        console.warn('Error stopping Microsoft Clarity:', error);
      }
    }
  }, [consent?.statistics]);

  return null;
}
