import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { NewsletterForm } from '@/components/ui/NewsletterForm';

const featuredCategories = [
  {
    name: 'Gousses de Vanille',
    description: 'Gousses premium selectionnees a la main',
    href: '/boutique?category=GOUSSES',
    image: '/images/gousses.jpg',
  },
  {
    name: 'Poudre de Vanille',
    description: 'Vanille moulue pure, sans additifs',
    href: '/boutique?category=POUDRE',
    image: '/images/poudre.jpg',
  },
  {
    name: 'Extraits & Aromes',
    description: 'Extraits naturels de vanille',
    href: '/boutique?category=EXTRAIT',
    image: '/images/extrait.jpg',
  },
  {
    name: 'Coffrets Cadeaux',
    description: 'Offrez l\'excellence de la vanille',
    href: '/boutique?category=COFFRET',
    image: '/images/coffret.jpg',
  },
];

const origins = [
  { name: 'Madagascar', flag: '🇲🇬', description: 'Vanille Bourbon, la reference mondiale' },
  { name: 'Tahiti', flag: '🇵🇫', description: 'Notes florales et anisees uniques' },
  { name: 'Comores', flag: '🇰🇲', description: 'Richesse aromatique exceptionnelle' },
  { name: 'Mexique', flag: '🇲🇽', description: 'Le berceau historique de la vanille' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-earth-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-950/90 to-earth-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-vanilla-500/20 text-vanilla-300 rounded-full text-sm font-medium mb-4">
              Particuliers & Professionnels
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
              La vanille d&apos;exception,{' '}
              <span className="text-vanilla-400">directe producteur</span>
            </h1>
            <p className="text-lg text-earth-300 mb-8 leading-relaxed">
              Decouvrez notre selection de vanilles premium en provenance directe des
              meilleures plantations du monde. Qualite garantie pour vos creations culinaires.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/boutique" className="btn-accent text-lg px-8 py-4">
                Decouvrir la boutique
              </Link>
              <Link href="/boutique?accountType=PRO" className="btn-secondary border-vanilla-400 text-vanilla-400 hover:bg-vanilla-400 hover:text-earth-900 text-lg px-8 py-4">
                Espace Professionnel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-white border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🚚', text: 'Livraison offerte des 60EUR' },
              { icon: '🌿', text: 'Vanille 100% naturelle' },
              { icon: '⭐', text: 'Qualite premium garantie' },
              { icon: '📦', text: 'Expedition sous 24h' },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1 py-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-earth-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">Nos produits</h2>
          <p className="text-earth-600 max-w-xl mx-auto">
            Une gamme complete de produits a base de vanille, de la gousse brute aux
            preparations pretes a l&apos;emploi.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="card group p-6 text-center">
              <div className="h-32 bg-earth-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-vanilla-100 transition-colors">
                <span className="text-4xl text-earth-400 group-hover:text-earth-600 transition-colors">
                  {cat.name === 'Gousses de Vanille' ? '🫘' :
                   cat.name === 'Poudre de Vanille' ? '✨' :
                   cat.name === 'Extraits & Aromes' ? '🧴' : '🎁'}
                </span>
              </div>
              <h3 className="font-serif font-semibold text-earth-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-earth-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Origines */}
      <section className="bg-earth-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Nos origines</h2>
            <p className="text-earth-300 max-w-xl mx-auto">
              Chaque origine possede son terroir unique qui donne a la vanille des aromes distincts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {origins.map((origin) => (
              <Link
                key={origin.name}
                href={`/boutique?origin=${origin.name.toUpperCase()}`}
                className="bg-earth-700/50 rounded-xl p-6 hover:bg-earth-700 transition-colors"
              >
                <span className="text-3xl mb-3 block">{origin.flag}</span>
                <h3 className="font-serif font-semibold text-lg mb-1">{origin.name}</h3>
                <p className="text-earth-400 text-sm">{origin.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Espace Pro */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-earth-100 to-vanilla-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="badge bg-earth-700 text-white mb-3">Espace Professionnel</span>
            <h2 className="section-title mb-4">
              Vous etes patissier, restaurateur ou artisan ?
            </h2>
            <p className="text-earth-600 mb-6 leading-relaxed">
              Beneficiez de tarifs professionnels, de conditionnements adaptes et d&apos;un
              service dedie. Commande en gros, factures pro, livraison express.
            </p>
            <ul className="space-y-2 mb-6 text-earth-700">
              <li className="flex items-center gap-2">
                <span className="text-vanilla-600">&#10003;</span> Tarifs degressifs selon volume
              </li>
              <li className="flex items-center gap-2">
                <span className="text-vanilla-600">&#10003;</span> Facturation professionnelle (TVA)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-vanilla-600">&#10003;</span> Conditionnements professionnels
              </li>
              <li className="flex items-center gap-2">
                <span className="text-vanilla-600">&#10003;</span> Interlocuteur dedie
              </li>
            </ul>
            <Link href="/inscription?type=pro" className="btn-primary">
              Creer mon compte Pro
            </Link>
          </div>
          <div className="w-full md:w-80 h-64 bg-earth-200 rounded-xl flex items-center justify-center">
            <span className="text-6xl">👨‍🍳</span>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-vanilla-100 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="section-title mb-3">Restez informe</h2>
          <p className="text-earth-600 mb-6">
            Recevez nos offres exclusives, nouvelles arrivages et recettes a la vanille.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
