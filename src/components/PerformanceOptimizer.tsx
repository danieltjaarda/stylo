'use client';

import { useEffect } from 'react';

/**
 * PerformanceOptimizer component
 * Implements various performance optimizations for the webshop
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload important images that are above the fold
      const criticalImages = [
        '/banner.webp',
        '/banner mobile 3.0.png',
        '/DESKNA LOGO BLACK.png',
        '/DESKNA LOGO WHITE.png',
        '/trustpilot-stars-new.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize font loading
    const optimizeFonts = () => {
      // Preload font display swap
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      fontLink.href = '/fonts/nunito-v16-latin-regular.woff2';
      document.head.appendChild(fontLink);
    };

    // Lazy load non-critical scripts
    const loadNonCriticalScripts = () => {
      // Load analytics scripts after interaction or after 3 seconds
      const loadAnalytics = () => {
        // This will be handled by the dynamic imports in layout.tsx
      };

      // Load after user interaction or timeout
      const events = ['click', 'scroll', 'keydown', 'touchstart'];
      const loadOnInteraction = () => {
        loadAnalytics();
        events.forEach(event => {
          document.removeEventListener(event, loadOnInteraction);
        });
      };

      events.forEach(event => {
        document.addEventListener(event, loadOnInteraction, { passive: true });
      });

      // Fallback timeout
      setTimeout(loadAnalytics, 3000);
    };

    // Prefetch important pages
    const prefetchImportantPages = () => {
      const importantPages = [
        '/products',
        '/bureaustoelen', 
        '/verstelbare-bureaus',
        '/shop-alles'
      ];

      // Only prefetch on desktop and when user is not on mobile data
      if (window.innerWidth > 768 && navigator.connection?.effectiveType !== '2g') {
        importantPages.forEach(href => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          document.head.appendChild(link);
        });
      }
    };

    // Run optimizations
    preloadCriticalResources();
    optimizeFonts();
    loadNonCriticalScripts();
    
    // Delay prefetching to avoid blocking critical resources
    setTimeout(prefetchImportantPages, 2000);

    // Cleanup function
    return () => {
      // Remove event listeners if component unmounts
    };
  }, []);

  // This component doesn't render anything
  return null;
}




