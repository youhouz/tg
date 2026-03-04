import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Vanille Shop - Vanille premium de Madagascar et du monde',
    template: '%s | Vanille Shop',
  },
  description:
    'Decouvrez notre selection de vanilles premium : gousses de Madagascar, Tahiti, Comores. Vente aux particuliers et professionnels. Livraison rapide en France.',
  keywords: [
    'vanille',
    'gousse de vanille',
    'vanille Madagascar',
    'vanille bourbon',
    'vanille Tahiti',
    'acheter vanille',
    'vanille professionnels',
    'vanille bio',
    'extrait de vanille',
    'poudre de vanille',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Vanille Shop',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
