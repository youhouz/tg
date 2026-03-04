'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, getDeliveryLabel } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  complement?: string;
  zipCode: string;
  city: string;
  country: string;
  isDefault: boolean;
}

const deliveryModes = [
  { value: 'DOMICILE', label: 'Livraison a domicile', price: 5.90, delay: '2-3 jours ouvrables' },
  { value: 'POINT_RELAIS', label: 'Point relais', price: 3.90, delay: '3-5 jours ouvrables' },
  { value: 'CLICK_COLLECT', label: 'Retrait en boutique', price: 0, delay: 'Sous 24h' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('DOMICILE');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/addresses')
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data);
          const defaultAddr = data.find((a: Address) => a.isDefault);
          if (defaultAddr) setSelectedAddress(defaultAddr.id);
        });
    }
  }, [session]);

  const subtotal = getTotal();
  const selectedDelivery = deliveryModes.find((d) => d.value === deliveryMode)!;
  const shippingCost = subtotal >= 60 ? 0 : selectedDelivery.price;
  const total = subtotal + shippingCost - promoDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setPromoDiscount(data.discount);
        toast.success(`Code promo applique : -${formatPrice(data.discount)}`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Erreur de validation du code promo');
    }
  };

  const handleSubmit = async () => {
    if (!selectedAddress && deliveryMode !== 'CLICK_COLLECT') {
      toast.error('Veuillez selectionner une adresse de livraison');
      return;
    }
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          addressId: selectedAddress || undefined,
          deliveryMode,
          deliveryNotes,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erreur lors de la creation de la commande');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-earth-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Finaliser ma commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery address */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-4">Adresse de livraison</h2>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === addr.id
                        ? 'border-earth-700 bg-earth-50'
                        : 'border-earth-200 hover:border-earth-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">{addr.label}</p>
                      <p className="text-sm text-earth-600">
                        {addr.firstName} {addr.lastName}, {addr.street}
                        {addr.complement ? `, ${addr.complement}` : ''}, {addr.zipCode} {addr.city}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-earth-500 mb-3">Aucune adresse enregistree</p>
                <Link href="/compte/adresses" className="btn-secondary text-sm">
                  Ajouter une adresse
                </Link>
              </div>
            )}
          </div>

          {/* Delivery mode */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-4">Mode de livraison</h2>
            <div className="space-y-3">
              {deliveryModes.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    deliveryMode === mode.value
                      ? 'border-earth-700 bg-earth-50'
                      : 'border-earth-200 hover:border-earth-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={mode.value}
                      checked={deliveryMode === mode.value}
                      onChange={() => setDeliveryMode(mode.value)}
                    />
                    <div>
                      <p className="font-medium">{mode.label}</p>
                      <p className="text-sm text-earth-500">{mode.delay}</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {subtotal >= 60 && mode.value !== 'CLICK_COLLECT'
                      ? 'Offert'
                      : mode.price === 0
                      ? 'Gratuit'
                      : formatPrice(mode.price)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery notes */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-4">Instructions de livraison</h2>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Instructions particulieres pour la livraison (optionnel)"
              className="input-field"
              rows={3}
            />
          </div>

          {/* Promo code */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-4">Code promotionnel</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Entrez votre code"
                className="input-field flex-1"
              />
              <button onClick={handleApplyPromo} className="btn-secondary">
                Appliquer
              </button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-lg mb-4">Recapitulatif</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                  <span className="text-earth-600 truncate mr-2">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-earth-200 mb-3" />
            <div className="space-y-2 text-sm">
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
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <hr className="border-earth-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total TTC</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Redirection vers le paiement...' : `Payer ${formatPrice(total)}`}
            </button>
            <p className="text-xs text-earth-500 text-center mt-3">
              Paiement securise par Stripe. Vos donnees bancaires ne sont pas stockees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
