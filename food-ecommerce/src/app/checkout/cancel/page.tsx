import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <XCircleIcon className="h-20 w-20 text-red-400 mx-auto mb-6" />
      <h1 className="section-title mb-4">Paiement annule</h1>
      <p className="text-earth-600 mb-8">
        Votre paiement a ete annule. Aucun montant n&apos;a ete debite.
        Votre panier a ete conserve.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/panier" className="btn-primary">
          Retour au panier
        </Link>
        <Link href="/boutique" className="btn-secondary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
