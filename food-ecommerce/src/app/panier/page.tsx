'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const shippingCost = subtotal >= 60 ? 0 : 5.90;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBagIcon className="h-16 w-16 text-earth-300 mx-auto mb-4" />
        <h1 className="section-title mb-3">Votre panier est vide</h1>
        <p className="text-earth-500 mb-6">Decouvrez notre selection de vanilles premium</p>
        <Link href="/boutique" className="btn-primary">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Mon panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="card p-4 flex gap-4">
              <div className="w-24 h-24 bg-earth-100 rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🫘</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-earth-900 truncate">{item.name}</h3>
                {item.unitLabel && (
                  <p className="text-sm text-earth-500">{item.unitLabel}</p>
                )}
                <p className="text-lg font-bold text-earth-900 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-earth-400 hover:text-red-500 transition-colors"
                  aria-label="Supprimer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center border border-earth-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="p-2 text-earth-600 hover:text-earth-900"
                    aria-label="Diminuer"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    className="p-2 text-earth-600 hover:text-earth-900"
                    aria-label="Augmenter"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-lg mb-4">Recapitulatif</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-600">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Livraison</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Offerte</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-earth-500">
                  Plus que {formatPrice(60 - subtotal)} pour la livraison gratuite
                </p>
              )}
              <hr className="border-earth-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-6 text-center">
              Commander
            </Link>
            <button
              onClick={clearCart}
              className="w-full mt-3 text-sm text-earth-500 hover:text-red-500 transition-colors"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
