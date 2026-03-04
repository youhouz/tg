'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDescription?: string | null;
    priceParticulier: number;
    pricePro?: number | null;
    unitLabel?: string | null;
    origin?: string | null;
    quality?: string | null;
    stock: number;
    isFeatured: boolean;
    images: { url: string; alt: string; isPrimary: boolean }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const isPro = (session?.user as any)?.accountType === 'PROFESSIONNEL';
  const price = isPro && product.pricePro ? product.pricePro : product.priceParticulier;
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: primaryImage?.url || '/images/placeholder.jpg',
      unitLabel: product.unitLabel || '',
      price,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(`${product.name} ajoute au panier`);
  };

  return (
    <Link href={`/boutique/${product.slug}`} className="card group">
      {/* Image */}
      <div className="relative aspect-square bg-earth-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-6xl text-earth-300 group-hover:scale-105 transition-transform duration-300">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            '🫘'
          )}
        </div>
        {product.isFeatured && (
          <span className="absolute top-2 left-2 badge bg-vanilla-500 text-earth-900">
            Coup de coeur
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-red-100 text-red-800 text-sm">Rupture de stock</span>
          </div>
        )}
        {isPro && product.pricePro && (
          <span className="absolute top-2 right-2 badge bg-earth-700 text-white">
            Prix PRO
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {product.origin && (
            <span className="text-xs text-earth-500 uppercase tracking-wider">
              {product.origin}
            </span>
          )}
          {product.quality && (
            <span className="text-xs text-vanilla-700 font-medium">
              {product.quality}
            </span>
          )}
        </div>
        <h3 className="font-serif font-semibold text-earth-900 mb-1 group-hover:text-earth-700 transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-earth-500 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-earth-900">{formatPrice(price)}</span>
            {product.unitLabel && (
              <span className="text-sm text-earth-500 ml-1">/ {product.unitLabel}</span>
            )}
          </div>
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-earth-700 text-white rounded-lg hover:bg-earth-800 transition-colors"
              aria-label={`Ajouter ${product.name} au panier`}
            >
              <ShoppingBagIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
