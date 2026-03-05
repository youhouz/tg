'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { slugify } from '@/lib/utils';

const categories = ['GOUSSES', 'POUDRE', 'EXTRAIT', 'CAVIAR', 'PREPARE', 'COFFRET'];
const origins = ['MADAGASCAR', 'TAHITI', 'COMORES', 'MEXIQUE', 'OUGANDA', 'PAPOUASIE', 'REUNION', 'INDONESIE'];
const qualities = ['GOURMET', 'TK', 'ROUGE', 'NOIRE', 'GIVRÉE'];
const conservations = ['AMBIANT', 'FRAIS', 'SEC'];

export default function NouveauProduitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', shortDescription: '',
    category: 'GOUSSES', origin: 'MADAGASCAR', quality: 'GOURMET',
    priceParticulier: '', pricePro: '', weight: '', unitLabel: '',
    allergens: '', ingredients: '', conservation: 'AMBIANT',
    stock: '0', stockAlert: '5', isActive: true, isFeatured: false,
    metaTitle: '', metaDescription: '', minOrderPro: '',
  });

  const update = (field: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name') next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          priceParticulier: parseFloat(form.priceParticulier),
          pricePro: form.pricePro ? parseFloat(form.pricePro) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          stock: parseInt(form.stock),
          stockAlert: parseInt(form.stockAlert),
          minOrderPro: form.minOrderPro ? parseInt(form.minOrderPro) : null,
          allergens: form.allergens ? JSON.stringify(form.allergens.split(',').map((s: string) => s.trim())) : '[]',
        }),
      });

      if (res.ok) {
        toast.success('Produit cree');
        router.push('/admin/produits');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Nouveau produit</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">Informations generales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Nom du produit *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => update('slug', e.target.value)} className="input-field bg-earth-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Description courte</label>
              <input type="text" value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Description complete *</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field" rows={5} required />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Categorie *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Origine</label>
              <select value={form.origin} onChange={(e) => update('origin', e.target.value)} className="input-field">
                {origins.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Qualite</label>
              <select value={form.quality} onChange={(e) => update('quality', e.target.value)} className="input-field">
                {qualities.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">Prix et stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Prix particulier (EUR) *</label>
              <input type="number" step="0.01" value={form.priceParticulier} onChange={(e) => update('priceParticulier', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Prix professionnel (EUR)</label>
              <input type="number" step="0.01" value={form.pricePro} onChange={(e) => update('pricePro', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Poids (g)</label>
              <input type="number" step="0.01" value={form.weight} onChange={(e) => update('weight', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Libelle unite (ex: 5 gousses)</label>
              <input type="text" value={form.unitLabel} onChange={(e) => update('unitLabel', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Alerte stock</label>
              <input type="number" value={form.stockAlert} onChange={(e) => update('stockAlert', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Qte min. PRO</label>
              <input type="number" value={form.minOrderPro} onChange={(e) => update('minOrderPro', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">Informations alimentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Allergenes (separes par des virgules)</label>
              <input type="text" value={form.allergens} onChange={(e) => update('allergens', e.target.value)} className="input-field" placeholder="Ex: fruits a coques, gluten" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-earth-700 mb-1">Ingredients</label>
              <textarea value={form.ingredients} onChange={(e) => update('ingredients', e.target.value)} className="input-field" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Conservation</label>
              <select value={form.conservation} onChange={(e) => update('conservation', e.target.value)} className="input-field">
                {conservations.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-serif font-semibold text-lg">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Meta titre</label>
            <input type="text" value={form.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Meta description</label>
            <textarea value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} className="input-field" rows={2} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
              <span className="text-sm">Produit actif</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
              <span className="text-sm">Coup de coeur</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creation...' : 'Creer le produit'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
