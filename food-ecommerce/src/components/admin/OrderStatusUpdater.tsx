'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const statuses = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'CONFIRMEE', label: 'Confirmee' },
  { value: 'EN_PREPARATION', label: 'En preparation' },
  { value: 'EXPEDIEE', label: 'Expediee' },
  { value: 'LIVREE', label: 'Livree' },
  { value: 'ANNULEE', label: 'Annulee' },
  { value: 'REMBOURSEE', label: 'Remboursee' },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber: trackingNumber || undefined }),
      });

      if (res.ok) {
        toast.success('Commande mise a jour');
        router.refresh();
      } else {
        toast.error('Erreur de mise a jour');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="font-serif font-semibold text-lg mb-4">Mettre a jour la commande</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {status === 'EXPEDIEE' && (
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Numero de suivi</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="input-field"
              placeholder="Ex: 1Z999AA10123456784"
            />
          </div>
        )}
        <button onClick={handleUpdate} disabled={loading} className="btn-primary">
          {loading ? 'Mise a jour...' : 'Mettre a jour'}
        </button>
      </div>
    </div>
  );
}
