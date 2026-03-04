import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json([], { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await req.json();

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { userId, ...body },
  });

  return NextResponse.json(address);
}
