'use client';

import dynamic from "next/dynamic";

// Dynamically import non-critical components in a client component
export const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });
export const FloatingWhatsApp = dynamic(() => import("@/components/FloatingWhatsApp"), { ssr: false });
export const EmailPopup = dynamic(() => import("@/components/EmailPopup"), { ssr: false });
export const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });
export const GoogleAnalytics = dynamic(() => import("@/components/GoogleAnalytics"), { ssr: false });
export const GoogleAds = dynamic(() => import("@/components/GoogleAds"), { ssr: false });
export const MetaPixel = dynamic(() => import("@/components/MetaPixel"), { ssr: false });
export const MicrosoftClarity = dynamic(() => import("@/components/MicrosoftClarity"), { ssr: false });

