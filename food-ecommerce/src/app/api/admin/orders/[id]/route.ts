import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (body.status) {
      data.status = body.status;
      if (body.status === 'PAYEE' || body.status === 'CONFIRMEE') {
        data.paymentStatus = 'PAYEE';
      }
    }
    if (body.trackingNumber) data.trackingNumber = body.trackingNumber;

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur mise a jour' }, { status: 500 });
  }
}
