'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPro = searchParams.get('type') === 'pro';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    accountType: isPro ? 'PROFESSIONNEL' : 'PARTICULIER',
    companyName: '',
    siret: '',
    tvaNumber: '',
    newsletter: false,
    rgpdConsent: false,
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rgpdConsent) {
      toast.error('Veuillez accepter la politique de confidentialite');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      // Auto-login
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      toast.success('Compte cree avec succes !');
      router.push('/compte');
    } catch {
      toast.error('Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="section-title text-center mb-2">Creer un compte</h1>
      <p className="text-center text-earth-500 mb-8">
        {form.accountType === 'PROFESSIONNEL' ? 'Compte Professionnel' : 'Compte Particulier'}
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {/* Account type toggle */}
        <div className="flex rounded-lg border border-earth-200 overflow-hidden">
          <button
            type="button"
            onClick={() => update('accountType', 'PARTICULIER')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              form.accountType === 'PARTICULIER'
                ? 'bg-earth-700 text-white'
                : 'bg-white text-earth-600 hover:bg-earth-50'
            }`}
          >
            Particulier
          </button>
          <button
            type="button"
            onClick={() => update('accountType', 'PROFESSIONNEL')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              form.accountType === 'PROFESSIONNEL'
                ? 'bg-earth-700 text-white'
                : 'bg-white text-earth-600 hover:bg-earth-50'
            }`}
          >
            Professionnel
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-earth-700 mb-1">Prenom *</label>
            <input id="firstName" type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-earth-700 mb-1">Nom *</label>
            <input id="lastName" type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input-field" required />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">Email *</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" required />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-earth-700 mb-1">Mot de passe * (min. 8 caracteres)</label>
          <input id="password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input-field" required minLength={8} />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-earth-700 mb-1">Telephone</label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
        </div>

        {/* Pro fields */}
        {form.accountType === 'PROFESSIONNEL' && (
          <>
            <hr className="border-earth-200" />
            <p className="text-sm font-medium text-earth-700">Informations professionnelles</p>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-earth-700 mb-1">Raison sociale *</label>
              <input id="companyName" type="text" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="siret" className="block text-sm font-medium text-earth-700 mb-1">SIRET *</label>
                <input id="siret" type="text" value={form.siret} onChange={(e) => update('siret', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label htmlFor="tvaNumber" className="block text-sm font-medium text-earth-700 mb-1">N&deg; TVA</label>
                <input id="tvaNumber" type="text" value={form.tvaNumber} onChange={(e) => update('tvaNumber', e.target.value)} className="input-field" />
              </div>
            </div>
          </>
        )}

        <hr className="border-earth-200" />

        <label className="flex items-start gap-2">
          <input type="checkbox" checked={form.newsletter} onChange={(e) => update('newsletter', e.target.checked)} className="mt-1" />
          <span className="text-sm text-earth-600">
            Je souhaite recevoir les offres et actualites par email
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" checked={form.rgpdConsent} onChange={(e) => update('rgpdConsent', e.target.checked)} className="mt-1" required />
          <span className="text-sm text-earth-600">
            J&apos;accepte la{' '}
            <Link href="/politique-confidentialite" className="underline">politique de confidentialite</Link>
            {' '}et le traitement de mes donnees personnelles *
          </span>
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creation du compte...' : 'Creer mon compte'}
        </button>
      </form>

      <p className="text-center text-sm text-earth-500 mt-4">
        Deja un compte ?{' '}
        <Link href="/connexion" className="text-earth-700 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-12 text-center">Chargement...</div>}>
      <InscriptionForm />
    </Suspense>
  );
}
