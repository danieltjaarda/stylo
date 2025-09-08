import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "TechShop - Jouw Tech Specialist",
  description: "Ontdek de nieuwste technologie en gadgets bij TechShop. Kwaliteit, snelle levering en uitstekende service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>
      <body
        className={`${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Cart />
      </body>
    </html>
  );
}
