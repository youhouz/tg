import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { formatPrice, formatDate, getStatusLabel, getStatusColor, getDeliveryLabel } from '@/lib/utils';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';

interface Props {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/connexion');

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      address: true,
      items: { include: { product: { include: { images: { take: 1 } } } } },
      promoCode: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Commande #{order.orderNumber}</h1>
          <p className="text-earth-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-4">Articles</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-earth-50 rounded-lg">
                  <div className="w-12 h-12 bg-earth-200 rounded flex items-center justify-center text-lg flex-shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover rounded" />
                    ) : '🫘'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-earth-500">Quantite: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(Number(item.totalPrice))}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Update status */}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>

        <div className="space-y-6">
          {/* Client info */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-3">Client</h2>
            <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
            <p className="text-sm text-earth-500">{order.user.email}</p>
            <p className="text-sm text-earth-500">{order.user.phone}</p>
            {order.user.accountType === 'PROFESSIONNEL' && (
              <div className="mt-2 p-2 bg-earth-50 rounded text-sm">
                <p className="font-medium">Compte PRO</p>
                {order.user.companyName && <p>{order.user.companyName}</p>}
                {order.user.siret && <p>SIRET: {order.user.siret}</p>}
              </div>
            )}
          </div>

          {/* Address */}
          {order.address && (
            <div className="card p-6">
              <h2 className="font-serif font-semibold text-lg mb-3">Adresse</h2>
              <p className="text-sm text-earth-600">
                {order.address.firstName} {order.address.lastName}<br />
                {order.address.street}<br />
                {order.address.complement && <>{order.address.complement}<br /></>}
                {order.address.zipCode} {order.address.city}
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-lg mb-3">Total</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-500">Sous-total</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-500">Livraison ({getDeliveryLabel(order.deliveryMode)})</span>
                <span>{formatPrice(Number(order.shippingCost))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise{order.promoCode ? ` (${order.promoCode.code})` : ''}</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <hr className="border-earth-200" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total TTC</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
              <p className="text-xs text-earth-500">dont TVA: {formatPrice(Number(order.taxAmount))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
