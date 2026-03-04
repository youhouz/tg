import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

export const metadata: Metadata = {
  title: 'Boutique - Toute notre selection de vanille',
  description:
    'Decouvrez notre gamme de vanilles premium : gousses, poudre, extraits, caviar. Origines Madagascar, Tahiti, Comores. Tarifs particuliers et professionnels.',
};

interface Props {
  searchParams: {
    category?: string;
    origin?: string;
    sort?: string;
    search?: string;
    page?: string;
  };
}

const PRODUCTS_PER_PAGE = 12;

async function getProducts(searchParams: Props['searchParams']) {
  const where: any = { isActive: true };

  if (searchParams.category) {
    where.category = searchParams.category;
  }
  if (searchParams.origin) {
    where.origin = searchParams.origin;
  }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  switch (searchParams.sort) {
    case 'price_asc':
      orderBy.priceParticulier = 'asc';
      break;
    case 'price_desc':
      orderBy.priceParticulier = 'desc';
      break;
    case 'name':
      orderBy.name = 'asc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const page = parseInt(searchParams.page || '1');
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE,
      include: {
        images: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      priceParticulier: Number(p.priceParticulier),
      pricePro: p.pricePro ? Number(p.pricePro) : null,
    })),
    totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
    currentPage: page,
  };
}

export default async function BoutiquePage({ searchParams }: Props) {
  const { products, totalPages, currentPage } = await getProducts(searchParams);

  const categoryLabels: Record<string, string> = {
    GOUSSES: 'Gousses de vanille',
    POUDRE: 'Poudre de vanille',
    EXTRAIT: 'Extraits & Aromes',
    CAVIAR: 'Caviar de vanille',
    PREPARE: 'Preparations',
    COFFRET: 'Coffrets cadeaux',
  };

  const title = searchParams.category
    ? categoryLabels[searchParams.category] || 'Boutique'
    : 'Toute notre selection';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-earth-500 mb-6" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-earth-700">Accueil</a>
        <span className="mx-2">/</span>
        <span className="text-earth-900">Boutique</span>
        {searchParams.category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-earth-900">
              {categoryLabels[searchParams.category]}
            </span>
          </>
        )}
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">{title}</h1>
          <p className="text-earth-500 mt-1">{products.length} produit(s)</p>
        </div>
        <Suspense fallback={<div>Chargement des filtres...</div>}>
          <ProductFilters />
        </Suspense>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/boutique?${new URLSearchParams({
                    ...searchParams,
                    page: page.toString(),
                  }).toString()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-earth-700 text-white'
                      : 'bg-white text-earth-700 border border-earth-200 hover:bg-earth-50'
                  }`}
                >
                  {page}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-earth-500 mb-4">Aucun produit trouve</p>
          <a href="/boutique" className="btn-secondary">
            Voir tous les produits
          </a>
        </div>
      )}
    </div>
  );
}
