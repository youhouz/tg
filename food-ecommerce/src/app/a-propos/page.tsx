import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Notre histoire - Vanille Shop',
  description: 'Decouvrez l\'histoire de Vanille Shop, notre passion pour la vanille et notre engagement qualite aupres des producteurs.',
};

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title mb-4">Notre histoire</h1>
        <p className="text-lg text-earth-600 max-w-2xl mx-auto">
          Depuis notre creation, nous parcourons le monde a la recherche des meilleures
          vanilles pour les amoureux de saveurs authentiques.
        </p>
      </div>

      <div className="prose prose-earth max-w-none">
        <div className="bg-earth-100 rounded-2xl p-8 mb-10 text-center">
          <span className="text-6xl block mb-4">🌱</span>
          <h2 className="text-2xl font-serif font-bold mb-3">La passion de la vanille</h2>
          <p className="text-earth-600">
            Vanille Shop est ne de la rencontre entre un amour de la gastronomie et une
            fascination pour la vanille, cette orchidee precieuse qui demande patience
            et savoir-faire. Nous travaillons en direct avec des producteurs a Madagascar,
            Tahiti, aux Comores et au Mexique pour vous offrir des vanilles d&apos;exception.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card p-6 text-center">
            <span className="text-3xl block mb-3">🤝</span>
            <h3 className="font-serif font-semibold mb-2">Commerce equitable</h3>
            <p className="text-sm text-earth-600">
              Nous remunerons justement nos producteurs et soutenons le developpement
              local dans les regions de production.
            </p>
          </div>
          <div className="card p-6 text-center">
            <span className="text-3xl block mb-3">🔍</span>
            <h3 className="font-serif font-semibold mb-2">Tracabilite complete</h3>
            <p className="text-sm text-earth-600">
              Chaque lot de vanille est trace de la plantation a votre cuisine,
              garantissant qualite et authenticite.
            </p>
          </div>
          <div className="card p-6 text-center">
            <span className="text-3xl block mb-3">✨</span>
            <h3 className="font-serif font-semibold mb-2">Qualite premium</h3>
            <p className="text-sm text-earth-600">
              Nos vanilles sont selectionnees, controlees et conditionnees avec le
              plus grand soin pour preserver tous leurs aromes.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Prets a decouvrir nos vanilles ?</h2>
          <div className="flex justify-center gap-4">
            <Link href="/boutique" className="btn-primary">
              Voir la boutique
            </Link>
            <Link href="/inscription?type=pro" className="btn-secondary">
              Espace Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
