import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over Ons | DESKNA - Specialist in Ergonomische Werkplekken',
  description: 'Leer meer over DESKNA, jouw specialist in ergonomische bureaustoelen en zit-sta bureaus. Onze missie is het creëren van gezonde en productieve werkplekken voor iedereen. Ontdek ons verhaal en onze waarden.',
  keywords: 'over ons, DESKNA, missie, team, ergonomie specialist, bedrijfsinfo, verhaal',
  openGraph: {
    title: 'Over DESKNA - Ons Verhaal',
    description: 'Ontdek de mensen en passie achter DESKNA ergonomische werkplekken',
    type: 'website',
    images: [
      {
        url: '/Groepsfoto.png',
        width: 1200,
        height: 630,
        alt: 'DESKNA Team',
      },
    ],
  },
};

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}










