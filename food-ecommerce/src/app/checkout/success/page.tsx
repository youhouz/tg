import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="section-title mb-4">Commande confirmee !</h1>
      <p className="text-earth-600 mb-2">
        Merci pour votre commande. Vous recevrez un email de confirmation avec les details de suivi.
      </p>
      <p className="text-earth-500 text-sm mb-8">
        Votre vanille sera preparee et expediee sous 24h.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/compte/commandes" className="btn-primary">
          Voir mes commandes
        </Link>
        <Link href="/boutique" className="btn-secondary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
