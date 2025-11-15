import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Vergelijking - Vergelijk Bureaustoelen & Bureaus | DESKNA',
  description: 'Vergelijk eenvoudig verschillende ergonomische bureaustoelen en zit-sta bureaus. Bekijk specificaties, prijzen en functies naast elkaar om de beste keuze te maken voor jouw werkplek.',
  keywords: 'product vergelijking, bureaustoelen vergelijken, bureaus vergelijken, specificaties, prijsvergelijking',
  openGraph: {
    title: 'Vergelijk Bureaustoelen & Bureaus - DESKNA',
    description: 'Vind de perfecte match door producten naast elkaar te vergelijken',
    type: 'website',
  },
};

export default function VergelijkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






