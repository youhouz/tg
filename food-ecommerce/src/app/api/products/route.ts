import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const origin = searchParams.get('origin');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const where: any = { isActive: true };

  if (category) where.category = category;
  if (origin) where.origin = origin;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  switch (sort) {
    case 'price_asc': orderBy.priceParticulier = 'asc'; break;
    case 'price_desc': orderBy.priceParticulier = 'desc'; break;
    case 'name': orderBy.name = 'asc'; break;
    default: orderBy.createdAt = 'desc';
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      priceParticulier: Number(p.priceParticulier),
      pricePro: p.pricePro ? Number(p.pricePro) : null,
    })),
    total,
    totalPages: Math.ceil(total / limit),
  });
}
