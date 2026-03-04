'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ShoppingBagIcon,
  MapPinIcon,
  HeartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Mes commandes', href: '/compte/commandes', icon: ShoppingBagIcon, desc: 'Suivi et historique de commandes' },
  { name: 'Mes adresses', href: '/compte/adresses', icon: MapPinIcon, desc: 'Gerer mes adresses de livraison' },
  { name: 'Mes favoris', href: '/compte/favoris', icon: HeartIcon, desc: 'Mes produits favoris' },
];

export default function ComptePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion');
  }, [status, router]);

  if (status === 'loading') return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Chargement...</div>;
  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-earth-200 rounded-full flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-earth-600" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold">Bonjour {user.name}</h1>
          <p className="text-earth-500">{user.email}</p>
          {user.accountType === 'PROFESSIONNEL' && (
            <span className="badge bg-earth-700 text-white mt-1">Compte PRO</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="card p-6 group">
            <item.icon className="h-8 w-8 text-earth-400 group-hover:text-earth-700 transition-colors mb-3" />
            <h2 className="font-serif font-semibold text-earth-900 mb-1">{item.name}</h2>
            <p className="text-sm text-earth-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      {user.role === 'ADMIN' && (
        <div className="mt-8 p-4 bg-earth-100 rounded-xl">
          <Link href="/admin" className="font-medium text-earth-700 hover:text-earth-900">
            Acceder au tableau de bord administrateur &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
