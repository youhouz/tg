import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetails } from '@/components/products/ProductDetails';

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      variants: true,
      reviews: {
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    priceParticulier: Number(product.priceParticulier),
    pricePro: product.pricePro ? Number(product.pricePro) : null,
    weight: product.weight ? Number(product.weight) : null,
    variants: product.variants.map((v) => ({
      ...v,
      priceParticulier: Number(v.priceParticulier),
      pricePro: v.pricePro ? Number(v.pricePro) : null,
      weight: v.weight ? Number(v.weight) : null,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Produit introuvable' };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      price: product.priceParticulier,
      priceCurrency: 'EUR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        ).toFixed(1),
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-earth-500 mb-6" aria-label="Fil d'Ariane">
          <a href="/" className="hover:text-earth-700">Accueil</a>
          <span className="mx-2">/</span>
          <a href="/boutique" className="hover:text-earth-700">Boutique</a>
          <span className="mx-2">/</span>
          <span className="text-earth-900">{product.name}</span>
        </nav>

        <ProductDetails product={product} />
      </div>
    </>
  );
}
