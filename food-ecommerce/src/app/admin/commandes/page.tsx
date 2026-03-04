import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice, formatDate, getStatusLabel, getStatusColor, getDeliveryLabel } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminCommandesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/connexion');

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, accountType: true } },
      items: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Gestion des commandes</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="text-left p-4 font-medium text-earth-600">Commande</th>
                <th className="text-left p-4 font-medium text-earth-600">Client</th>
                <th className="text-left p-4 font-medium text-earth-600">Date</th>
                <th className="text-left p-4 font-medium text-earth-600">Livraison</th>
                <th className="text-left p-4 font-medium text-earth-600">Statut</th>
                <th className="text-right p-4 font-medium text-earth-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-earth-50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/commandes/${order.id}`} className="font-mono text-earth-700 hover:text-earth-900 font-medium">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                    <p className="text-xs text-earth-500">
                      {order.user.email}
                      {order.user.accountType === 'PROFESSIONNEL' && (
                        <span className="ml-1 font-medium text-earth-700">[PRO]</span>
                      )}
                    </p>
                  </td>
                  <td className="p-4 text-earth-600">{formatDate(order.createdAt)}</td>
                  <td className="p-4 text-earth-600">{getDeliveryLabel(order.deliveryMode)}</td>
                  <td className="p-4">
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold">{formatPrice(Number(order.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
