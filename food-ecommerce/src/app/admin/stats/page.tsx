import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/connexion');

  const [revenue, ordersByStatus, topProducts, clientsByType, recentSubscribers] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, _count: true, where: { paymentStatus: 'PAYEE' } }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    }),
    prisma.user.groupBy({ by: ['accountType'], _count: true, where: { role: { in: ['CLIENT', 'PRO'] } } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  // Fetch product names for top products
  const topProductIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });
  const productNames = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Statistiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <p className="text-sm text-earth-500 mb-1">Chiffre d&apos;affaires total</p>
          <p className="text-3xl font-bold text-earth-900">{formatPrice(Number(revenue._sum.total || 0))}</p>
          <p className="text-sm text-earth-500 mt-1">{revenue._count} commandes payees</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-earth-500 mb-1">Panier moyen</p>
          <p className="text-3xl font-bold text-earth-900">
            {revenue._count > 0 ? formatPrice(Number(revenue._sum.total || 0) / revenue._count) : '0 EUR'}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-earth-500 mb-1">Abonnes newsletter</p>
          <p className="text-3xl font-bold text-earth-900">{recentSubscribers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders by status */}
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg mb-4">Commandes par statut</h2>
          <div className="space-y-3">
            {ordersByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-earth-600">{item.status}</span>
                <span className="font-semibold">{item._count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg mb-4">Produits les plus vendus</h2>
          <div className="space-y-3">
            {topProducts.map((item, i) => (
              <div key={item.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-earth-400 font-mono w-6">{i + 1}.</span>
                  <span className="text-sm text-earth-700 truncate max-w-[200px]">
                    {productNames[item.productId] || item.productId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{item._sum.quantity} vendus</span>
                  <span className="text-xs text-earth-500 ml-2">
                    ({formatPrice(Number(item._sum.totalPrice || 0))})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients by type */}
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg mb-4">Repartition clients</h2>
          <div className="space-y-3">
            {clientsByType.map((item) => (
              <div key={item.accountType} className="flex items-center justify-between">
                <span className="text-sm text-earth-600">
                  {item.accountType === 'PROFESSIONNEL' ? 'Professionnels' : 'Particuliers'}
                </span>
                <span className="font-semibold">{item._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
