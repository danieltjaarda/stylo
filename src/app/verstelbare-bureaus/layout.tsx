import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verstelbare Bureaus & Zit-Sta Bureaus | DESKNA - Elektrisch Hoogte Verstelbaar',
  description: 'Elektrische zit-sta bureaus voor een gezondere werkdag. Stil motorensysteem, geheugenstanden en stabiel frame. Wissel moeiteloos tussen zitten en staan. Gratis verzending en montage service beschikbaar.',
  keywords: 'zit-sta bureaus, verstelbare bureaus, elektrisch bureau, sta bureau, hoogte verstelbaar, ergonomisch bureau',
  openGraph: {
    title: 'Verstelbare Zit-Sta Bureaus | DESKNA',
    description: 'Elektrische bureaus voor een gezonde en actieve werkdag',
    type: 'website',
    images: [
      {
        url: '/banner.webp',
        width: 1200,
        height: 630,
        alt: 'DESKNA Verstelbare Zit-Sta Bureaus',
      },
    ],
  },
};

export default function VerstelbareBureausLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}










