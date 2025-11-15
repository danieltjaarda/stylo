'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useStatisticsConsent } from '@/contexts/CookieConsentContext';

interface GoogleTagManagerProps {
  gtmId: string;
}

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const hasStatisticsConsent = useStatisticsConsent();

  useEffect(() => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Initialize dataLayer if not already present
      window.dataLayer = window.dataLayer || [];
      
      // Push GTM start event
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      console.log('GTM initialized with consent');
    }
  }, [hasStatisticsConsent, gtmId]);

  // Don't load scripts if no consent
  if (!hasStatisticsConsent) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      
      {/* Google Tag Manager (noscript) - This will be added to the body */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

// Helper hook for GTM dataLayer events
export function useGTMDataLayer() {
  const hasStatisticsConsent = useStatisticsConsent();

  const pushEvent = (event: string, data?: Record<string, any>) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event,
        ...data,
      });
      console.log('GTM Event pushed:', { event, ...data });
    }
  };

  const pushPageView = (pageTitle: string, pagePath: string) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: pageTitle,
        page_location: `${window.location.origin}${pagePath}`,
        page_path: pagePath,
      });
      console.log('GTM Page view pushed:', { pageTitle, pagePath });
    }
  };

  const pushPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'purchase',
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
      console.log('GTM Purchase event pushed:', { transactionId, value, currency, items });
    }
  };

  const pushAddToCart = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'add_to_cart',
        currency: currency,
        value: value,
        items: items,
      });
      console.log('GTM Add to cart event pushed:', { currency, value, items });
    }
  };

  const pushViewItem = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_item',
        currency: currency,
        value: value,
        items: items,
      });
      console.log('GTM View item event pushed:', { currency, value, items });
    }
  };

  const pushBeginCheckout = (currency: string, value: number, items: any[]) => {
    if (hasStatisticsConsent && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'begin_checkout',
        currency: currency,
        value: value,
        items: items,
      });
      console.log('GTM Begin checkout event pushed:', { currency, value, items });
    }
  };

  return {
    pushEvent,
    pushPageView,
    pushPurchase,
    pushAddToCart,
    pushViewItem,
    pushBeginCheckout,
    hasConsent: hasStatisticsConsent,
  };
}

// TypeScript declaration for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}
