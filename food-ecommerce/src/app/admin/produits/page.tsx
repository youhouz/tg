import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

export default async function AdminProduitsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/connexion');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Gestion des produits</h1>
        <Link href="/admin/produits/nouveau" className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Nouveau produit
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="text-left p-4 font-medium text-earth-600">Produit</th>
                <th className="text-left p-4 font-medium text-earth-600">Categorie</th>
                <th className="text-left p-4 font-medium text-earth-600">Origine</th>
                <th className="text-right p-4 font-medium text-earth-600">Prix</th>
                <th className="text-right p-4 font-medium text-earth-600">Prix PRO</th>
                <th className="text-right p-4 font-medium text-earth-600">Stock</th>
                <th className="text-center p-4 font-medium text-earth-600">Statut</th>
                <th className="text-center p-4 font-medium text-earth-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-earth-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-earth-100 rounded flex items-center justify-center text-sm flex-shrink-0">
                        {product.images[0] ? (
                          <img src={product.images[0].url} alt="" className="w-full h-full object-cover rounded" />
                        ) : '🫘'}
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-earth-600">{product.category}</td>
                  <td className="p-4 text-earth-600">{product.origin || '-'}</td>
                  <td className="p-4 text-right font-medium">{formatPrice(Number(product.priceParticulier))}</td>
                  <td className="p-4 text-right text-earth-600">{product.pricePro ? formatPrice(Number(product.pricePro)) : '-'}</td>
                  <td className="p-4 text-right">
                    <span className={product.stock <= product.stockAlert ? 'text-red-600 font-semibold' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`badge ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link href={`/admin/produits/${product.id}`} className="inline-flex p-2 text-earth-500 hover:text-earth-900 transition-colors">
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
