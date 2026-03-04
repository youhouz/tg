import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    const promo = await prisma.promoCode.findUnique({ where: { code } });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'Code promo invalide' }, { status: 400 });
    }

    if (promo.validUntil && promo.validUntil < new Date()) {
      return NextResponse.json({ error: 'Code promo expire' }, { status: 400 });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: 'Code promo epuise' }, { status: 400 });
    }

    if (promo.minOrderAmount && subtotal < Number(promo.minOrderAmount)) {
      return NextResponse.json({
        error: `Montant minimum: ${Number(promo.minOrderAmount)}EUR`,
      }, { status: 400 });
    }

    let discount = 0;
    switch (promo.type) {
      case 'POURCENTAGE':
        discount = subtotal * (Number(promo.value) / 100);
        break;
      case 'MONTANT_FIXE':
        discount = Math.min(Number(promo.value), subtotal);
        break;
      case 'LIVRAISON_GRATUITE':
        discount = 5.90;
        break;
    }

    return NextResponse.json({ discount, type: promo.type, value: Number(promo.value) });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
