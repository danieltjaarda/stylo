import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verstelbare Bureaus & Zit-Sta Bureaus | DESKNA - Elektrisch Hoogte Verstelbaar',
  description: 'Elektrische zit-sta bureaus voor een gezondere werkdag. Stil motorensysteem, geheugenstanden en stabiel frame. Wissel moeiteloos tussen zitten en staan. Gratis verzending en montage service beschikbaar.',
};

export default function VerstelbareBureausLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




