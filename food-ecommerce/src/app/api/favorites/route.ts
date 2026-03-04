import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json([], { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: (session.user as any).id },
    include: { product: { include: { images: true } } },
  });

  return NextResponse.json(
    favorites.map((f) => ({
      ...f,
      product: {
        ...f.product,
        priceParticulier: Number(f.product.priceParticulier),
        pricePro: f.product.pricePro ? Number(f.product.pricePro) : null,
      },
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
  }

  const { productId } = await req.json();
  const userId = (session.user as any).id;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId, productId } });
  return NextResponse.json({ favorited: true });
}
