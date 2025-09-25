import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over Ons | DESKNA - Specialist in Ergonomische Werkplekken',
  description: 'Leer meer over DESKNA, jouw specialist in ergonomische bureaustoelen en zit-sta bureaus. Onze missie is het creëren van gezonde en productieve werkplekken voor iedereen. Ontdek ons verhaal en onze waarden.',
};

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




