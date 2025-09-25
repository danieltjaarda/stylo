import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alle Producten | DESKNA - Ergonomische Bureaustoelen & Zit-Sta Bureaus',
  description: 'Bekijk alle DESKNA producten: ergonomische bureaustoelen, elektrische zit-sta bureaus en kantooraccessoires. Filter op categorie, prijs en eigenschappen. Gratis verzending vanaf €50 en 30 dagen retourrecht.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




