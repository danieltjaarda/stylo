'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useStatisticsConsent } from '@/contexts/CookieConsentContext';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const hasStatisticsConsent = useStatisticsConsent();

  useEffect(() => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Wait for gtag to be available before initializing
      const initializeGA = () => {
        if (window.gtag) {
          window.gtag('config', measurementId, {
            page_title: document.title,
            page_location: window.location.href,
          });
        } else {
          // Retry after a short delay if gtag is not ready yet
          setTimeout(initializeGA, 100);
        }
      };
      
      // Small delay to ensure scripts are loaded
      setTimeout(initializeGA, 500);
    }
  }, [hasStatisticsConsent, measurementId]);

  // Don't load scripts if no consent
  if (!hasStatisticsConsent) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Helper hook for tracking events
export function useGoogleAnalytics() {
  const hasStatisticsConsent = useStatisticsConsent();

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Check if gtag is available before using it
      if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      } else {
        console.warn('Google Analytics not loaded yet, event tracking skipped');
      }
    }
  };

  const trackPageView = (pageTitle: string, pagePath: string) => {
    if (hasStatisticsConsent && typeof window !== 'undefined') {
      // Check if gtag is available before using it
      if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
          page_title: pageTitle,
          page_location: `${window.location.origin}${pagePath}`,
        });
      } else {
        console.warn('Google Analytics not loaded yet, page view tracking skipped');
      }
    }
  };

  return {
    trackEvent,
    trackPageView,
    hasConsent: hasStatisticsConsent,
  };
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
