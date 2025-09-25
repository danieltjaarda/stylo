'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useMarketingConsent } from '@/contexts/CookieConsentContext';
import { trackPageView } from '@/lib/metaPixel';

interface MetaPixelProps {
  pixelId: string;
}

/**
 * Meta Pixel Component - Hybride Setup
 * 
 * Deze component handelt:
 * - Base pixel loading
 * - Automatic PageView tracking
 * 
 * Shopify handelt:
 * - Purchase events via Facebook & Instagram app + Conversions API
 */
export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const hasMarketingConsent = useMarketingConsent();
  const pathname = usePathname();
  const lastTrackedPathnameRef = useRef<string | null>(null);

  // Initialize pixel once
  useEffect(() => {
    if (hasMarketingConsent && typeof window !== 'undefined') {
      // Global check to prevent any duplicate initialization
      if ((window as any).fbqGlobalInitialized) {
        console.log('Meta Pixel already globally initialized, skipping');
        return;
      }
      
      // Wait for fbq to be available before initializing
      const initializePixel = () => {
        if (window.fbq) {
          console.log(`Initializing Meta Pixel: ${pixelId}`);
          window.fbq('init', pixelId);
          
          // Mark pixel as globally initialized to prevent duplicates
          (window as any).fbqGlobalInitialized = true;
          console.log('Meta Pixel initialization complete');
        } else {
          // Retry after a short delay if fbq is not ready yet
          setTimeout(initializePixel, 100);
        }
      };
      
      // Small delay to ensure scripts are loaded
      setTimeout(initializePixel, 500);
    }
  }, [hasMarketingConsent, pixelId]);

  // Track PageView only on real pathname changes (not query param changes)
  useEffect(() => {
    if (hasMarketingConsent && pathname && typeof window !== 'undefined') {
      // Only track if pathname actually changed from previous pathname
      if (lastTrackedPathnameRef.current !== pathname) {
        console.log(`📄 PageView - Pathname changed: ${lastTrackedPathnameRef.current} → ${pathname}`);
        
        // Wait a bit to ensure fbq is ready
        const trackPageViewDelayed = () => {
          if (typeof window.fbq === 'function') {
            // Use simple window-based deduplication (not sessionStorage)
            const windowKey = `pageview_${pathname.replace(/\//g, '_')}`;
            
            if (!(window as any)[windowKey]) {
              trackPageView();
              (window as any)[windowKey] = true;
              console.log(`📄 PageView - Tracked for ${pathname}`);
            } else {
              console.log(`📄 PageView - Already tracked for ${pathname} in this window, skipping`);
            }
            
            lastTrackedPathnameRef.current = pathname;
          } else {
            setTimeout(trackPageViewDelayed, 100);
          }
        };
        
        setTimeout(trackPageViewDelayed, 600);
      } else {
        console.log(`📄 PageView - Pathname unchanged (${pathname}), skipping`);
      }
    }
  }, [pathname, hasMarketingConsent]);

  // Don't load scripts if no consent
  if (!hasMarketingConsent) {
    return null;
  }

  return (
    <>
      {/* Meta Pixel Script - Only load once globally */}
      <Script
        id={`meta-pixel-${pixelId}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Only initialize if not already done
            if (!window.fbqScriptLoaded) {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              // Mark script as loaded
              window.fbqScriptLoaded = true;
              console.log('Meta Pixel script loaded');
            }
          `,
        }}
      />
      {/* No-script fallback */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * @deprecated Use useMetaPixelTracking from @/lib/metaPixel instead
 * Legacy hook for backward compatibility
 */
export function useMetaPixel() {
  const hasMarketingConsent = useMarketingConsent();

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (hasMarketingConsent && typeof window !== 'undefined') {
      // Check if fbq is available before using it
      if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, parameters);
      } else {
        console.warn('Meta Pixel not loaded yet, event tracking skipped');
      }
    }
  };

  const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (hasMarketingConsent && typeof window !== 'undefined') {
      // Check if fbq is available before using it
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', eventName, parameters);
      } else {
        console.warn('Meta Pixel not loaded yet, custom event tracking skipped');
      }
    }
  };

  return {
    trackEvent,
    trackCustomEvent,
    hasConsent: hasMarketingConsent,
  };
}

// TypeScript declaration for fbq
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}
