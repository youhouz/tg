import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const isPro = (session.user as any).accountType === 'PROFESSIONNEL';
    const body = await req.json();
    const { items, addressId, deliveryMode, deliveryNotes, promoCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Fetch products and validate stock
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true, images: { where: { isPrimary: true }, take: 1 } },
    });

    const lineItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Produit introuvable: ${item.productId}` }, { status: 400 });
      }

      let price: number;
      let stock: number;
      let name = product.name;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: `Variante introuvable` }, { status: 400 });
        }
        price = Number(isPro && variant.pricePro ? variant.pricePro : variant.priceParticulier);
        stock = variant.stock;
        name = `${product.name} - ${variant.label}`;
      } else {
        price = Number(isPro && product.pricePro ? product.pricePro : product.priceParticulier);
        stock = product.stock;
      }

      if (item.quantity > stock) {
        return NextResponse.json({ error: `Stock insuffisant pour ${name}` }, { status: 400 });
      }

      subtotal += price * item.quantity;

      lineItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: price * item.quantity,
        name,
        image: product.images[0]?.url,
      });
    }

    // Calculate shipping
    const shippingCost = subtotal >= 60 ? 0 : deliveryMode === 'CLICK_COLLECT' ? 0 : deliveryMode === 'POINT_RELAIS' ? 3.90 : 5.90;

    // Handle promo code
    let discount = 0;
    let promoCodeId: string | null = null;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (promo && promo.isActive && (!promo.validUntil || promo.validUntil > new Date())) {
        if (!promo.maxUses || promo.usedCount < promo.maxUses) {
          if (!promo.minOrderAmount || subtotal >= Number(promo.minOrderAmount)) {
            switch (promo.type) {
              case 'POURCENTAGE':
                discount = subtotal * (Number(promo.value) / 100);
                break;
              case 'MONTANT_FIXE':
                discount = Number(promo.value);
                break;
              case 'LIVRAISON_GRATUITE':
                discount = shippingCost;
                break;
            }
            promoCodeId = promo.id;
          }
        }
      }
    }

    const taxAmount = (subtotal + shippingCost - discount) * 0.2 / 1.2; // TVA 20% incluse
    const total = subtotal + shippingCost - discount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressId: addressId || null,
        deliveryMode: deliveryMode as any,
        subtotal,
        shippingCost,
        discount,
        taxAmount,
        total,
        promoCodeId,
        deliveryNotes,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // Update promo code usage
    if (promoCodeId) {
      await prisma.promoCode.update({
        where: { id: promoCodeId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: session.user.email!,
      metadata: { orderId: order.id },
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      ...(shippingCost > 0 && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: Math.round(shippingCost * 100), currency: 'eur' },
              display_name: deliveryMode === 'POINT_RELAIS' ? 'Point relais' : 'Livraison a domicile',
            },
          },
        ],
      }),
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    });

    // Update order with Stripe payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: stripeSession.id },
    });

    // Update stock
    for (const item of lineItems) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ url: stripeSession.url, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Erreur lors de la commande' }, { status: 500 });
  }
}
