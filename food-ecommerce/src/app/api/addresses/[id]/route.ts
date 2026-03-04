import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
  }

  const address = await prisma.address.findFirst({
    where: { id: params.id, userId: (session.user as any).id },
  });

  if (!address) {
    return NextResponse.json({ error: 'Adresse introuvable' }, { status: 404 });
  }

  await prisma.address.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
