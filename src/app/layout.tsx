import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import EmailPopup from "@/components/EmailPopup";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAds from "@/components/GoogleAds";
import MetaPixel from "@/components/MetaPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus",
  description: "Ontdek de perfecte ergonomische bureaustoelen en elektrische zit-sta bureaus bij DESKNA. In hoogte verstelbare bureaus, ergonomische stoelen en kantooraccessoires voor jouw ideale werkplek. Gratis verzending, 5 jaar garantie en 30 dagen retourneren.",
  icons: {
    icon: '/favicon logo.png',
    shortcut: '/favicon logo.png',
    apple: '/favicon logo.png',
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
