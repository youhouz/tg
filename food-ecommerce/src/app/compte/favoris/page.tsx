'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';

export default function MesFavorisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/favorites')
        .then((r) => r.json())
        .then((data) => { setFavorites(data); setLoading(false); });
    }
  }, [session]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Mes favoris</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-earth-500 mb-4">Aucun favori pour le moment</p>
          <Link href="/boutique" className="btn-primary">Decouvrir la boutique</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav: any) => (
            <ProductCard key={fav.product.id} product={fav.product} />
          ))}
        </div>
      )}
    </div>
  );
}
