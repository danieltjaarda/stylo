'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useStatisticsConsent } from '@/contexts/CookieConsentContext';

interface GoogleAdsProps {
  conversionId: string;
}

export default function GoogleAds({ conversionId }: GoogleAdsProps) {
  const hasStatisticsConsent = useStatisticsConsent();

  useEffect(() => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Wait for gtag to be available before initializing
      const initializeGoogleAds = () => {
        if (window.gtag) {
          window.gtag('config', conversionId);
        } else {
          // Retry after a short delay if gtag is not ready yet
          setTimeout(initializeGoogleAds, 100);
        }
      };
      
      // Small delay to ensure scripts are loaded
      setTimeout(initializeGoogleAds, 500);
    }
  }, [hasStatisticsConsent, conversionId]);

  // Don't load scripts if no consent
  if (!hasStatisticsConsent) {
    return null;
  }

  return (
    <>
      {/* Google Ads Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${conversionId}');
          `,
        }}
      />
    </>
  );
}

// Helper hook for tracking Google Ads conversions
export function useGoogleAds() {
  const hasStatisticsConsent = useStatisticsConsent();

  const trackConversion = (conversionLabel?: string, value?: number, currency?: string) => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Check if gtag is available before using it
      if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
        const conversionData: any = {
          send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}${conversionLabel ? '/' + conversionLabel : ''}`,
        };

        if (value !== undefined) {
          conversionData.value = value;
        }

        if (currency) {
          conversionData.currency = currency;
        }

        window.gtag('event', 'conversion', conversionData);
      } else {
        console.warn('Google Ads not loaded yet, conversion tracking skipped');
      }
    }
  };

  const trackPurchase = (transactionId: string, value: number, currency: string = 'EUR') => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: value,
          currency: currency,
        });
      } else {
        console.warn('Google Ads not loaded yet, purchase tracking skipped');
      }
    }
  };

  return {
    trackConversion,
    trackPurchase,
    hasConsent: hasStatisticsConsent,
  };
}
