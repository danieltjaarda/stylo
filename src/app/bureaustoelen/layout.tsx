import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ergonomische Bureaustoelen | DESKNA - Comfort & Ondersteuning',
  description: 'Ontdek onze collectie ergonomische bureaustoelen voor optimaal zitcomfort. Verstelbare rugsteun, armleuningen en hoogwaardige materialen. Gratis verzending en 5 jaar garantie op alle bureaustoelen.',
  keywords: 'ergonomische bureaustoelen, bureaustoel, mesh stoel, verstelbare stoel, kantoorstoel, thuiswerken',
  openGraph: {
    title: 'Ergonomische Bureaustoelen | DESKNA',
    description: 'Premium bureaustoelen voor optimaal zitcomfort en ondersteuning',
    type: 'website',
    images: [
      {
        url: '/image met stoelen.webp',
        width: 1200,
        height: 630,
        alt: 'DESKNA Ergonomische Bureaustoelen',
      },
    ],
  },
};

export default function BureauStoelenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}










