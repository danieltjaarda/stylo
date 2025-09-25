import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | DESKNA - Veilig Afrekenen',
  description: 'Veilig en eenvoudig afrekenen bij DESKNA. Meerdere betaalmethoden, gratis verzending vanaf €50 en snelle levering van je ergonomische werkplek producten.',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




