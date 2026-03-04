'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBagIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Props {
  product: any;
}

export function ProductDetails({ product }: Props) {
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const isPro = (session?.user as any)?.accountType === 'PROFESSIONNEL';

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const currentPrice = selectedVariant
    ? (isPro && selectedVariant.pricePro ? selectedVariant.pricePro : selectedVariant.priceParticulier)
    : (isPro && product.pricePro ? product.pricePro : product.priceParticulier);

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const outOfStock = currentStock <= 0;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: `${product.name}${selectedVariant ? ` - ${selectedVariant.label}` : ''}`,
      image: product.images[0]?.url || '/images/placeholder.jpg',
      unitLabel: selectedVariant?.label || product.unitLabel || '',
      price: currentPrice,
      quantity,
      stock: currentStock,
    });
    toast.success(`${product.name} ajoute au panier`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <div className="aspect-square bg-earth-100 rounded-xl overflow-hidden mb-4">
          {product.images.length > 0 ? (
            <img
              src={product.images[selectedImage]?.url}
              alt={product.images[selectedImage]?.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl text-earth-300">
              🫘
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img: any, i: number) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? 'border-earth-700' : 'border-transparent'
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.origin && (
            <span className="badge bg-earth-100 text-earth-700">{product.origin}</span>
          )}
          {product.quality && (
            <span className="badge bg-vanilla-100 text-vanilla-800">{product.quality}</span>
          )}
        </div>

        <h1 className="text-3xl font-serif font-bold text-earth-900 mb-2">{product.name}</h1>

        {/* Rating */}
        {product.reviews.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${star <= avgRating ? 'text-vanilla-500' : 'text-earth-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-earth-500">
              ({product.reviews.length} avis)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-6">
          <span className="text-3xl font-bold text-earth-900">{formatPrice(currentPrice)}</span>
          {product.unitLabel && (
            <span className="text-earth-500 ml-2">/ {product.unitLabel}</span>
          )}
          {isPro && product.pricePro && (
            <span className="ml-3 badge bg-earth-700 text-white">Tarif PRO</span>
          )}
        </div>

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Conditionnement
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVariant(null)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  !selectedVariant
                    ? 'border-earth-700 bg-earth-700 text-white'
                    : 'border-earth-200 text-earth-700 hover:border-earth-400'
                }`}
              >
                {product.unitLabel || 'Standard'}
              </button>
              {product.variants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    selectedVariant?.id === variant.id
                      ? 'border-earth-700 bg-earth-700 text-white'
                      : 'border-earth-200 text-earth-700 hover:border-earth-400'
                  }`}
                  disabled={variant.stock <= 0}
                >
                  {variant.label} - {formatPrice(isPro && variant.pricePro ? variant.pricePro : variant.priceParticulier)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-earth-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 text-earth-600 hover:text-earth-900 transition-colors"
              aria-label="Diminuer la quantite"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-4 font-medium text-earth-900 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="p-3 text-earth-600 hover:text-earth-900 transition-colors"
              aria-label="Augmenter la quantite"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>

        {/* Stock info */}
        {!outOfStock && currentStock <= 10 && (
          <p className="text-sm text-orange-600 mb-4">
            Plus que {currentStock} en stock !
          </p>
        )}

        {/* Delivery info */}
        <div className="border border-earth-200 rounded-xl p-4 space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <TruckIcon className="h-5 w-5 text-earth-500 flex-shrink-0" />
            <span>Livraison offerte des 60EUR d&apos;achat - Expedition sous 24h</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheckIcon className="h-5 w-5 text-earth-500 flex-shrink-0" />
            <span>Qualite premium garantie - Vanille 100% naturelle</span>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-earth max-w-none mb-8">
          <h2 className="text-xl font-serif font-semibold mb-3">Description</h2>
          <p className="text-earth-700 leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>

        {/* Product details table */}
        <div className="mb-8">
          <h2 className="text-xl font-serif font-semibold mb-3">Informations produit</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {product.origin && (
              <>
                <dt className="text-earth-500">Origine</dt>
                <dd className="text-earth-900 font-medium">{product.origin}</dd>
              </>
            )}
            {product.quality && (
              <>
                <dt className="text-earth-500">Qualite</dt>
                <dd className="text-earth-900 font-medium">{product.quality}</dd>
              </>
            )}
            {product.weight && (
              <>
                <dt className="text-earth-500">Poids</dt>
                <dd className="text-earth-900 font-medium">{product.weight}g</dd>
              </>
            )}
            <dt className="text-earth-500">Conservation</dt>
            <dd className="text-earth-900 font-medium">{product.conservation}</dd>
            {product.allergens.length > 0 && (
              <>
                <dt className="text-earth-500 font-semibold text-red-700">Allergenes</dt>
                <dd className="text-red-700 font-medium">{product.allergens.join(', ')}</dd>
              </>
            )}
            {product.ingredients && (
              <>
                <dt className="text-earth-500">Ingredients</dt>
                <dd className="text-earth-900">{product.ingredients}</dd>
              </>
            )}
            {product.lotNumber && (
              <>
                <dt className="text-earth-500">N&deg; de lot</dt>
                <dd className="text-earth-900">{product.lotNumber}</dd>
              </>
            )}
            {product.ddm && (
              <>
                <dt className="text-earth-500">DDM</dt>
                <dd className="text-earth-900">{new Date(product.ddm).toLocaleDateString('fr-FR')}</dd>
              </>
            )}
          </dl>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-serif font-semibold mb-4">
              Avis clients ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="border border-earth-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'text-vanilla-500' : 'text-earth-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-earth-900">
                        {review.user.firstName} {review.user.lastName[0]}.
                      </span>
                    </div>
                    <span className="text-xs text-earth-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {review.title && <p className="font-medium text-earth-900 mb-1">{review.title}</p>}
                  {review.comment && <p className="text-sm text-earth-600">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
