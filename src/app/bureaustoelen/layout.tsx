import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ergonomische Bureaustoelen | DESKNA - Comfort & Ondersteuning',
  description: 'Ontdek onze collectie ergonomische bureaustoelen voor optimaal zitcomfort. Verstelbare rugsteun, armleuningen en hoogwaardige materialen. Gratis verzending en 5 jaar garantie op alle bureaustoelen.',
};

export default function BureauStoelenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




