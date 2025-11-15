import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Werkplek Advies Quiz - Vind Jouw Perfecte Bureaustoel | DESKNA',
  description: 'Doe de gratis werkplek quiz en ontdek welke ergonomische bureaustoel en bureau perfect bij jouw situatie passen. Persoonlijk advies op basis van jouw werkgewoonten, lichaamslengte en budget. Resultaten in 2 minuten.',
  keywords: 'werkplek quiz, bureaustoel advies, ergonomie test, werkplek advies, bureaustoel kiezen',
  openGraph: {
    title: 'Vind Jouw Perfecte Werkplek Setup - Gratis Quiz',
    description: 'Ontdek in 2 minuten welke ergonomische bureaustoel en bureau perfect bij jou passen',
    type: 'website',
    images: ['/banner.webp'],
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






