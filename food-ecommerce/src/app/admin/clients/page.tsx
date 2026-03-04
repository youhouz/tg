import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default async function AdminClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/connexion');

  const clients = await prisma.user.findMany({
    where: { role: { in: ['CLIENT', 'PRO'] } },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title mb-8">Gestion des clients</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="text-left p-4 font-medium text-earth-600">Client</th>
                <th className="text-left p-4 font-medium text-earth-600">Email</th>
                <th className="text-left p-4 font-medium text-earth-600">Type</th>
                <th className="text-left p-4 font-medium text-earth-600">Entreprise</th>
                <th className="text-center p-4 font-medium text-earth-600">Commandes</th>
                <th className="text-center p-4 font-medium text-earth-600">Fidelite</th>
                <th className="text-left p-4 font-medium text-earth-600">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-earth-50 transition-colors">
                  <td className="p-4 font-medium">{client.firstName} {client.lastName}</td>
                  <td className="p-4 text-earth-600">{client.email}</td>
                  <td className="p-4">
                    <span className={`badge ${client.accountType === 'PROFESSIONNEL' ? 'bg-earth-700 text-white' : 'bg-earth-100 text-earth-700'}`}>
                      {client.accountType === 'PROFESSIONNEL' ? 'PRO' : 'Particulier'}
                    </span>
                  </td>
                  <td className="p-4 text-earth-600">{client.companyName || '-'}</td>
                  <td className="p-4 text-center">{client._count.orders}</td>
                  <td className="p-4 text-center">{client.loyaltyPoints} pts</td>
                  <td className="p-4 text-earth-600">{formatDate(client.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
