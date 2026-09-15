'use client';

import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatEUR } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getOptimizedImageUrl, getResponsiveSrcSet, FALLBACK_PRODUCT_IMAGE } from '@/lib/image';

interface ProductCardProps {
  product: Product;
}

const getCountryFlag = (country?: string): string => {
  if (!country) return '🌏';
  const c = country.toLowerCase();
  if (c.includes('japan')) return '🇯🇵';
  if (c.includes('korea')) return '🇰🇷';
  if (c.includes('thailand')) return '🇹🇭';
  if (c.includes('china') || c.includes('taiwan')) return '🇨🇳';
  if (c.includes('india')) return '🇮🇳';
  if (c.includes('vietnam')) return '🇻🇳';
  if (c.includes('philippin')) return '🇵🇭';
  if (c.includes('malaysia')) return '🇲🇾';
  if (c.includes('indonesia')) return '🇮🇩';
  if (c.includes('ireland')) return '🇮🇪';
  return '🌏';
};

function ProductCardComponent({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const rawImage = product.images && product.images.length > 0 && product.images[0]
    ? product.images[0]
    : (product.category?.image || FALLBACK_PRODUCT_IMAGE);

  const mainImage = getOptimizedImageUrl(rawImage, 400);
  const imageSrcSet = getResponsiveSrcSet(rawImage, [200, 320, 480, 640]);

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const dietaryList = product.dietaryTags
    ? product.dietaryTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || product.stock <= 0) return;

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAdding(false);
    }
  }, [adding, product.id, product.stock, addToCart]);

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/90 hover:border-stone-400/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5">
      {/* Top Image Container with Clean Photography Backdrop */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#FAF9F7] to-[#F2F0EC] p-4 flex items-center justify-center">
        {/* Subtle ambient texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#2C2C2A_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <Link href={`/products/${product.slug}`} className="relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={mainImage}
            srcSet={imageSrcSet || undefined}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 240px"
            alt={product.name}
            className={`max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-all duration-500 ease-out ${
              imgLoaded ? 'opacity-100' : 'opacity-80 blur-[1px]'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
              setImgLoaded(true);
            }}
          />
        </Link>

        {/* Bestseller Ribbon Badge (Pinwheel Yellow / Amber Role) */}
        {product.isBestSeller && (
          <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none z-20">
            <div className="bg-brand-yellow-base text-brand-yellow-dark font-black text-[9px] uppercase tracking-wider py-1 text-center rotate-45 transform translate-x-7 translate-y-3 shadow-xs border-b border-white/40">
              Bestseller
            </div>
          </div>
        )}

        {/* Origin & Discount Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-20">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-stone-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-stone-200/80">
            <span>{getCountryFlag(product.originCountry)}</span>
            <span className="hidden sm:inline">{product.originCountry || 'Imported'}</span>
          </span>

          {discountPercent > 0 && (
            <span className="bg-brand-red-base text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-xs z-20 ${
            product.isBestSeller ? 'hidden' : ''
          } ${
            isFavorited
              ? 'bg-brand-red-light text-brand-red-base hover:bg-brand-red-light/80'
              : 'bg-white/90 text-stone-500 hover:bg-white hover:text-brand-red-base'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-brand-red-base' : ''}`} />
        </button>

        {/* Out of Stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-30">
            <span className="bg-brand-red-base text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-card">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Brand & Pack Size */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-brand-teal-dark">
            {product.brand || 'Asianmix'}
          </span>
          {product.weight && (
            <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              {product.weight}
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-charcoal-dark transition">
          <h3 className="text-sm font-bold text-stone-900 line-clamp-2 min-h-[38px] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Dietary & Stock Badges */}
        <div className="flex items-center justify-between gap-1 my-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {dietaryList.slice(0, 1).map((tag) => {
              const isSpicy = tag.toLowerCase().includes('spic') || tag.toLowerCase().includes('hot') || tag.toLowerCase().includes('chilli');
              const isGreenTag = tag.toLowerCase().includes('veg') || tag.toLowerCase().includes('halal') || tag.toLowerCase().includes('organic');
              return (
                <span
                  key={tag}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSpicy
                      ? 'bg-brand-red-light text-brand-red-dark border-brand-red-border'
                      : isGreenTag
                      ? 'bg-brand-green-light text-brand-green-dark border-brand-green-border'
                      : 'bg-brand-teal-light text-brand-teal-dark border-brand-teal-border'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Stock Indicator Badge */}
          {product.stock > 5 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-green-dark bg-brand-green-light px-2 py-0.5 rounded-full border border-brand-green-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-base" /> In Stock
            </span>
          ) : product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-yellow-dark bg-brand-yellow-light px-2 py-0.5 rounded-full border border-brand-yellow-border">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow-base animate-pulse" /> Only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-red-dark bg-brand-red-light px-2 py-0.5 rounded-full border border-brand-red-border">
              Out of Stock
            </span>
          )}
        </div>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-3 text-xs text-stone-500">
          <div className="flex items-center text-brand-yellow-base">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-extrabold text-stone-800">{product.avgRating || 4.9}</span>
          <span className="text-stone-400">({product.reviewCount || 14})</span>
        </div>

        {/* Price & Primary Circular Add-to-Basket Button */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-900">
                {formatEUR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatEUR(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || product.stock <= 0}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md active:scale-90 ${
              added
                ? 'bg-brand-green-base text-white rotate-0'
                : product.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] hover:scale-105'
            }`}
            title={product.stock <= 0 ? "Out of Stock" : "Add to Basket"}
            aria-label="Add to cart"
          >
            {added ? (
              <Check className="w-5 h-5 animate-in zoom-in stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const ProductCard = memo(ProductCardComponent);
export default ProductCard;
