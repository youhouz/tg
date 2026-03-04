import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';

async function getStats() {
  const [totalOrders, totalRevenue, totalProducts, totalClients, recentOrders, lowStock] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAYEE' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: { in: ['CLIENT', 'PRO'] } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true, accountType: true } } },
      }),
      prisma.product.findMany({
        where: { stock: { lte: prisma.product.fields.stockAlert } },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
    ]);

  return {
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.total || 0),
    totalProducts,
    totalClients,
    recentOrders,
    lowStock,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/connexion');
  }

  const stats = await getStats();

  const statCards = [
    { label: 'Chiffre d\'affaires', value: formatPrice(stats.totalRevenue), icon: CurrencyEuroIcon, color: 'bg-green-100 text-green-700' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingBagIcon, color: 'bg-blue-100 text-blue-700' },
    { label: 'Produits', value: stats.totalProducts, icon: CubeIcon, color: 'bg-vanilla-100 text-vanilla-800' },
    { label: 'Clients', value: stats.totalClients, icon: UsersIcon, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Tableau de bord</h1>
        <div className="flex gap-2">
          <Link href="/admin/produits/nouveau" className="btn-primary text-sm">
            + Nouveau produit
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-earth-500">{stat.label}</p>
                <p className="text-2xl font-bold text-earth-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-semibold text-lg">Dernieres commandes</h2>
            <Link href="/admin/commandes" className="text-sm text-earth-600 hover:text-earth-900">
              Voir tout &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-earth-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{order.user.firstName} {order.user.lastName}</p>
                  <p className="text-xs text-earth-500">
                    #{order.orderNumber}
                    {order.user.accountType === 'PROFESSIONNEL' && (
                      <span className="ml-1 text-earth-700 font-medium">[PRO]</span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(Number(order.total))}</p>
                  <p className="text-xs text-earth-500">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg mb-4">Alertes stock</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-earth-500 text-sm">Aucune alerte de stock</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStock.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/admin/produits/${product.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-earth-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-earth-500">{product.category}</p>
                  </div>
                  <span className={`badge ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {product.stock === 0 ? 'Rupture' : `${product.stock} restants`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link href="/admin/commandes" className="card p-4 text-center hover:bg-earth-50">
          <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-earth-500" />
          <span className="text-sm font-medium">Commandes</span>
        </Link>
        <Link href="/admin/produits" className="card p-4 text-center hover:bg-earth-50">
          <CubeIcon className="h-8 w-8 mx-auto mb-2 text-earth-500" />
          <span className="text-sm font-medium">Produits</span>
        </Link>
        <Link href="/admin/clients" className="card p-4 text-center hover:bg-earth-50">
          <UsersIcon className="h-8 w-8 mx-auto mb-2 text-earth-500" />
          <span className="text-sm font-medium">Clients</span>
        </Link>
        <Link href="/admin/stats" className="card p-4 text-center hover:bg-earth-50">
          <CurrencyEuroIcon className="h-8 w-8 mx-auto mb-2 text-earth-500" />
          <span className="text-sm font-medium">Statistiques</span>
        </Link>
      </div>
    </div>
  );
}
