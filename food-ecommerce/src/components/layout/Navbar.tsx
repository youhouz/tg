'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/stores/cart-store';
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const categories = [
  { name: 'Gousses', href: '/boutique?category=GOUSSES' },
  { name: 'Poudre', href: '/boutique?category=POUDRE' },
  { name: 'Extraits', href: '/boutique?category=EXTRAIT' },
  { name: 'Caviar', href: '/boutique?category=CAVIAR' },
  { name: 'Preparations', href: '/boutique?category=PREPARE' },
  { name: 'Coffrets', href: '/boutique?category=COFFRET' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="bg-white border-b border-earth-100 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-earth-900 text-vanilla-100 text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p>Livraison offerte des 60EUR d&apos;achat</p>
          <div className="hidden md:flex gap-4">
            <Link href="/a-propos" className="hover:text-vanilla-300 transition-colors">
              Notre histoire
            </Link>
            <Link href="/blog" className="hover:text-vanilla-300 transition-colors">
              Blog & Recettes
            </Link>
            {session?.user && (session.user as any).accountType === 'PROFESSIONNEL' && (
              <span className="text-vanilla-400 font-medium">Espace PRO</span>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4" aria-label="Navigation principale">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-earth-800">
              Vanille<span className="text-vanilla-600">Shop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/boutique"
              className="text-earth-700 hover:text-earth-900 font-medium transition-colors"
            >
              Tous les produits
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-earth-600 hover:text-earth-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-earth-600 hover:text-earth-900 transition-colors"
              aria-label="Rechercher"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {session ? (
              <div className="relative group">
                <Link
                  href="/compte"
                  className="p-2 text-earth-600 hover:text-earth-900 transition-colors"
                  aria-label="Mon compte"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-earth-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-earth-100">
                    <p className="text-sm font-medium text-earth-900">{session.user?.name}</p>
                    <p className="text-xs text-earth-500">{session.user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/compte" className="block px-3 py-2 text-sm text-earth-700 hover:bg-earth-50">
                      Mon compte
                    </Link>
                    <Link href="/compte/commandes" className="block px-3 py-2 text-sm text-earth-700 hover:bg-earth-50">
                      Mes commandes
                    </Link>
                    <Link href="/compte/favoris" className="block px-3 py-2 text-sm text-earth-700 hover:bg-earth-50">
                      Mes favoris
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-3 py-2 text-sm text-earth-700 hover:bg-earth-50 font-medium">
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Deconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/connexion"
                className="p-2 text-earth-600 hover:text-earth-900 transition-colors"
                aria-label="Se connecter"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            )}

            <Link
              href="/panier"
              className="relative p-2 text-earth-600 hover:text-earth-900 transition-colors"
              aria-label={`Panier (${itemCount} articles)`}
            >
              <ShoppingBagIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-vanilla-500 text-earth-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-earth-600"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <form action="/boutique" method="get" className="relative">
              <input
                type="search"
                name="search"
                placeholder="Rechercher une vanille, une origine..."
                className="input-field pl-10"
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-earth-400" />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-earth-100 pt-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/boutique"
                className="px-3 py-2 text-earth-700 hover:bg-earth-50 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tous les produits
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="px-3 py-2 text-earth-600 hover:bg-earth-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="border-earth-100 my-2" />
              <Link
                href="/a-propos"
                className="px-3 py-2 text-earth-600 hover:bg-earth-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Notre histoire
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 text-earth-600 hover:bg-earth-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog & Recettes
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
