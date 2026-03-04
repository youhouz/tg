'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/compte';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-title text-center mb-8">Connexion</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-earth-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            minLength={8}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-sm text-earth-500 mt-4">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-earth-700 font-medium hover:underline">
          Creer un compte
        </Link>
      </p>
    </div>
  );
}
