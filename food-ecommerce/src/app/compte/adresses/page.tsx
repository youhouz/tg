'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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

export default function MesAdressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: 'Domicile', firstName: '', lastName: '', street: '',
    complement: '', zipCode: '', city: '', country: 'France', isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/addresses').then((r) => r.json()).then(setAddresses);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const addr = await res.json();
      setAddresses((prev) => [...prev, addr]);
      setShowForm(false);
      setForm({ label: 'Domicile', firstName: '', lastName: '', street: '', complement: '', zipCode: '', city: '', country: 'France', isDefault: false });
      toast.success('Adresse ajoutee');
    } else {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Adresse supprimee');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Mes adresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Libelle</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-field" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Prenom *</label>
                <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Nom *</label>
                <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" required />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Adresse *</label>
              <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Complement</label>
              <input type="text" value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Code postal *</label>
              <input type="text" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="input-field" required pattern="\d{5}" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Ville *</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" required />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            <span className="text-sm text-earth-600">Adresse par defaut</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{addr.label}</span>
                  {addr.isDefault && <span className="badge bg-vanilla-100 text-vanilla-800">Par defaut</span>}
                </div>
                <p className="text-sm text-earth-600">
                  {addr.firstName} {addr.lastName}<br />
                  {addr.street}<br />
                  {addr.complement && <>{addr.complement}<br /></>}
                  {addr.zipCode} {addr.city}, {addr.country}
                </p>
              </div>
              <button onClick={() => handleDelete(addr.id)} className="text-earth-400 hover:text-red-500 transition-colors" aria-label="Supprimer">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
