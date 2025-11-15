import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { StickyCartProvider } from "@/contexts/StickyCartContext";
// import PerformanceOptimizer from "@/components/PerformanceOptimizer"; // Temporarily disabled
// import PerformanceMonitor from "@/components/PerformanceMonitor"; // Temporarily disabled
// Import dynamically loaded client components
import {
  Cart,
  FloatingWhatsApp,
  EmailPopup,
  CookieBanner,
  GoogleAnalytics,
  GoogleAds,
  GoogleTagManager,
  MetaPixel,
  MicrosoftClarity
} from "@/components/ClientComponents";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus",
  description: "Ontdek de perfecte ergonomische bureaustoelen en elektrische zit-sta bureaus bij DESKNA. In hoogte verstelbare bureaus, ergonomische stoelen en kantooraccessoires voor jouw ideale werkplek. Gratis verzending, 5 jaar garantie en 30 dagen retourneren.",
  keywords: "ergonomische bureaustoelen, zit-sta bureaus, verstelbare bureaus, kantoormeubels, thuiswerken, ergonomie, werkplek, bureaustoelen",
  authors: [{ name: "DESKNA" }],
  creator: "DESKNA",
  publisher: "DESKNA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon logo.png',
    shortcut: '/favicon logo.png',
    apple: '/favicon logo.png',
  },
  metadataBase: new URL('https://deskna.nl'),
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://deskna.nl',
    siteName: 'DESKNA',
    title: 'DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus',
    description: 'Ontdek de perfecte ergonomische bureaustoelen en elektrische zit-sta bureaus bij DESKNA.',
    images: [
      {
        url: '/banner.webp',
        width: 1200,
        height: 630,
        alt: 'DESKNA - Ergonomische Werkplekken',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus',
    description: 'Ontdek de perfecte ergonomische bureaustoelen en elektrische zit-sta bureaus bij DESKNA.',
    images: ['/banner.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Schema.org structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DESKNA",
    "url": "https://deskna.nl",
    "logo": "https://deskna.nl/DESKNA LOGO BLACK.png",
    "description": "Specialist in ergonomische bureaustoelen en zit-sta bureaus voor kantoor en thuiswerken",
    "email": "info@deskna.nl",
    "telephone": "+31850602482",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL",
      "addressLocality": "Nederland"
    },
    "sameAs": [
      "https://www.trustpilot.com/review/deskna.nl",
      "https://www.instagram.com/deskna.nl",
      "https://www.linkedin.com/company/deskna"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1370",
      "bestRating": "5",
      "worstRating": "1"
    },
    "foundingDate": "2019",
    "priceRange": "€€",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Ergonomische Werkplekken",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Ergonomische Bureaustoelen",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Ergonomische Bureaustoelen",
                "category": "Kantoormeubels"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Zit-Sta Bureaus",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Elektrische Verstelbare Bureaus",
                "category": "Kantoormeubels"
              }
            }
          ]
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DESKNA",
    "url": "https://deskna.nl",
    "description": "Ergonomische bureaustoelen en zit-sta bureaus voor een gezonde werkplek",
    "publisher": {
      "@type": "Organization",
      "name": "DESKNA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://deskna.nl/DESKNA LOGO BLACK.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://deskna.nl/shop-alles?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "nl-NL"
  };

  return (
    <html lang="nl">
      <head>
        {/* Global Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        
        {/* Google Tag Manager Script */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                `,
              }}
            />
            <script
              src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              async
            />
          </>
        )}
      </head>
      <body
        className={`${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        
        <CookieConsentProvider>
          <StickyCartProvider>
            {/* <PerformanceOptimizer /> */}
            {/* <PerformanceMonitor /> */}
            <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Cart />
          <FloatingWhatsApp />
          <EmailPopup />
          <CookieBanner />
          </StickyCartProvider>
          
          {/* Conditional Analytics Scripts */}
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          )}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
          {/* Google Ads - Hardcoded for reliability */}
          <GoogleAds conversionId="AW-17560490538" />
          {/* Meta Pixel - Hardcoded for reliability */}
          <MetaPixel pixelId="593923060471624" />
          {/* Microsoft Clarity - Hardcoded for reliability */}
          <MicrosoftClarity />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
