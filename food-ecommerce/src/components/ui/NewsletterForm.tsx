'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('Inscription confirmee !');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        className="input-field flex-1"
        required
        aria-label="Adresse email pour la newsletter"
      />
      <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
        {loading ? 'Envoi...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
