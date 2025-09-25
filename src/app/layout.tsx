import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
// import PerformanceMonitor from "@/components/PerformanceMonitor"; // Temporarily disabled
// Import dynamically loaded client components
import {
  Cart,
  FloatingWhatsApp,
  EmailPopup,
  CookieBanner,
  GoogleAnalytics,
  GoogleAds,
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
  return (
    <html lang="nl">
      <body
        className={`${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <CookieConsentProvider>
          <PerformanceOptimizer />
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
          
          {/* Conditional Analytics Scripts */}
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
