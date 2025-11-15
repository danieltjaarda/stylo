import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Alles | DESKNA - Volledige Collectie Ergonomische Werkplekken',
  description: 'Shop de volledige DESKNA collectie: bureaustoelen, zit-sta bureaus, monitorarmen en accessoires. Alles voor jouw perfecte ergonomische werkplek op één plek. Gratis verzending en expert advies.',
  keywords: 'shop alles, complete collectie, bureaustoelen, zit-sta bureaus, kantoormeubels, ergonomische producten',
  openGraph: {
    title: 'Shop Alles - Volledige Collectie | DESKNA',
    description: 'Ontdek ons complete assortiment ergonomische werkplek producten',
    type: 'website',
    images: [
      {
        url: '/banner.webp',
        width: 1200,
        height: 630,
        alt: 'DESKNA Complete Collectie',
      },
    ],
  },
};

export default function ShopAllesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}










