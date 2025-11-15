import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kortingen & Acties - Tot 40% Korting op Bureaustoelen & Bureaus | DESKNA',
  description: 'Profiteer van onze actuele kortingen en acties op ergonomische bureaustoelen en zit-sta bureaus. Scherpe prijzen, outlet deals en seizoensaanbiedingen. Gratis verzending op alle producten.',
  keywords: 'kortingen, acties, outlet, deals, bureaustoelen aanbieding, bureaus aanbieding',
  openGraph: {
    title: 'Actuele Kortingen & Outlet Deals - DESKNA',
    description: 'Scherpe prijzen op ergonomische werkplek producten',
    type: 'website',
  },
};

export default function KortingenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






