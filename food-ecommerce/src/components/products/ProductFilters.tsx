'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { value: '', label: 'Toutes les categories' },
  { value: 'GOUSSES', label: 'Gousses de vanille' },
  { value: 'POUDRE', label: 'Poudre de vanille' },
  { value: 'EXTRAIT', label: 'Extraits & Aromes' },
  { value: 'CAVIAR', label: 'Caviar de vanille' },
  { value: 'PREPARE', label: 'Preparations' },
  { value: 'COFFRET', label: 'Coffrets cadeaux' },
];

const origins = [
  { value: '', label: 'Toutes les origines' },
  { value: 'MADAGASCAR', label: 'Madagascar' },
  { value: 'TAHITI', label: 'Tahiti' },
  { value: 'COMORES', label: 'Comores' },
  { value: 'MEXIQUE', label: 'Mexique' },
  { value: 'OUGANDA', label: 'Ouganda' },
  { value: 'REUNION', label: 'Reunion' },
  { value: 'INDONESIE', label: 'Indonesie' },
];

const sortOptions = [
  { value: 'newest', label: 'Nouveautes' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix decroissant' },
  { value: 'name', label: 'Nom A-Z' },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/boutique?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={searchParams.get('category') || ''}
        onChange={(e) => updateFilter('category', e.target.value)}
        className="input-field w-auto text-sm"
        aria-label="Filtrer par categorie"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('origin') || ''}
        onChange={(e) => updateFilter('origin', e.target.value)}
        className="input-field w-auto text-sm"
        aria-label="Filtrer par origine"
      >
        {origins.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('sort') || 'newest'}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="input-field w-auto text-sm"
        aria-label="Trier par"
      >
        {sortOptions.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
