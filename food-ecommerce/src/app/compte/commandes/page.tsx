'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default function MesCommandesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => { setOrders(data); setLoading(false); });
    }
  }, [session]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-earth-500 mb-4">Aucune commande pour le moment</p>
          <Link href="/boutique" className="btn-primary">Decouvrir la boutique</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="card p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono text-sm text-earth-500">#{order.orderNumber}</span>
                  <span className="mx-2 text-earth-300">|</span>
                  <span className="text-sm text-earth-500">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`badge ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-earth-600">
                  {order.items?.length || 0} article(s)
                </div>
                <span className="text-lg font-bold text-earth-900">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
              {order.trackingNumber && (
                <p className="text-sm text-earth-500 mt-2">
                  Suivi: <span className="font-mono">{order.trackingNumber}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
