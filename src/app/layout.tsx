import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { StickyCartProvider } from "@/contexts/StickyCartContext";
import { getLocale, getTranslations } from "@/lib/i18n-server";
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

export async function generateMetadata(): Promise<Metadata> {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return {
    title: translations.seo.title,
    description: translations.seo.description,
    keywords: translations.seo.keywords,
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
    metadataBase: new URL(locale === 'sv' ? 'https://deskna.se' : 'https://deskna.nl'),
    openGraph: {
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'nl_NL',
      url: locale === 'sv' ? 'https://deskna.se' : 'https://deskna.nl',
      siteName: 'DESKNA',
      title: translations.seo.title,
      description: translations.seo.description,
      images: [
        {
          url: '/banner.webp',
          width: 1200,
          height: 630,
          alt: 'DESKNA',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.seo.title,
      description: translations.seo.description,
      images: ['/banner.webp'],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const translations = await getTranslations();
  
  return (
    <html lang={locale === 'sv' ? 'sv' : 'nl'}>
      <head>
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
            <Header translations={translations} locale={locale} />
          <main className="flex-1">
            {children}
          </main>
          <Footer translations={translations} locale={locale} />
          <Cart translations={translations} locale={locale} />
          <FloatingWhatsApp />
          <EmailPopup translations={translations} locale={locale} />
          <CookieBanner translations={translations} locale={locale} />
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
