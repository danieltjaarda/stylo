import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alle Producten | DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus',
  description: 'Bekijk alle DESKNA producten: ergonomische bureaustoelen, elektrische zit-sta bureaus en kantooraccessoires. Filter op categorie, prijs en eigenschappen. Gratis verzending vanaf €50 en 30 dagen retourrecht.',
  keywords: 'producten, bureaustoelen, zit-sta bureaus, ergonomisch, kantoormeubels, filters, prijs',
  openGraph: {
    title: 'Alle Producten | DESKNA',
    description: 'Bekijk ons complete productassortiment met filters en categorieën',
    type: 'website',
    images: [
      {
        url: '/image met stoelen.webp',
        width: 1200,
        height: 630,
        alt: 'DESKNA Producten Overzicht',
      },
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}










