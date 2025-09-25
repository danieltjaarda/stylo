import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Alles | DESKNA - Volledige Collectie Ergonomische Werkplekken',
  description: 'Shop de volledige DESKNA collectie: bureaustoelen, zit-sta bureaus, monitorarmen en accessoires. Alles voor jouw perfecte ergonomische werkplek op één plek. Gratis verzending en expert advies.',
};

export default function ShopAllesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




