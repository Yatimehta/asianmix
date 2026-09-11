'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatEUR } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const getCountryFlag = (country: string): string => {
  const c = country ? country.toLowerCase() : '';
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

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const mainImage = product.images && product.images.length > 0 && product.images[0]
    ? product.images[0]
    : (product.category?.image || 'https://asianmix.ie/cdn/shop/files/Indiangatebasmati.jpg?v=1700756384&width=600');

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const dietaryList = product.dietaryTags
    ? product.dietaryTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const handleAdd = async (e: React.MouseEvent) => {
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
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/90 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1.5">
      {/* Top Image Container with Photography-Forward Textured Backdrop */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#FBF8F4] to-[#F3EDE2] p-4 flex items-center justify-center">
        {/* Subtle ambient texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5C3415_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <Link href={`/products/${product.slug}`} className="relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Bestseller Ribbon Badge (Authentic Burgundy) */}
        {product.isBestSeller && (
          <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none z-20">
            <div className="bg-gradient-to-r from-secondary to-[#991B47] text-white font-black text-[9px] uppercase tracking-wider py-1 text-center rotate-45 transform translate-x-7 translate-y-3 shadow-md border-b border-white/20">
              Bestseller
            </div>
          </div>
        )}

        {/* Origin & Discount Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-20">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-stone-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-stone-200/60">
            <span>{getCountryFlag(product.originCountry)}</span>
            <span className="hidden sm:inline">{product.originCountry}</span>
          </span>

          {discountPercent > 0 && (
            <span className="bg-accent-orange text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
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
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-sm z-20 ${
            product.isBestSeller ? 'hidden' : ''
          } ${
            isFavorited
              ? 'bg-red-50 text-accent-red hover:bg-red-100'
              : 'bg-white/85 text-stone-500 hover:bg-white hover:text-accent-red'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-accent-red' : ''}`} />
        </button>

        {/* Out of Stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-[2px] flex items-center justify-center z-30">
            <span className="bg-accent-red text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Brand & Pack Size */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-accent-teal">
            {product.brand}
          </span>
          {product.weight && (
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              {product.weight}
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-primary transition">
          <h3 className="text-sm font-bold text-stone-900 line-clamp-2 min-h-[38px] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Dietary & Stock Badges */}
        <div className="flex items-center justify-between gap-1 my-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {dietaryList.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold bg-accent-teal-light text-accent-teal px-1.5 py-0.5 rounded border border-accent-teal-border/40"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stock Indicator Badge */}
          {product.stock > 5 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-green bg-accent-green-light px-2 py-0.5 rounded-full border border-accent-green-border/40">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" /> In Stock
            </span>
          ) : product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-orange bg-accent-orange-light px-2 py-0.5 rounded-full border border-accent-orange-border/40">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" /> Only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-red bg-accent-red-light px-2 py-0.5 rounded-full border border-accent-red-border/40">
              Out of Stock
            </span>
          )}
        </div>

        {/* Star Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-3 text-xs text-stone-500">
          <div className="flex items-center text-accent-orange">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-extrabold text-stone-800">{product.avgRating || 4.9}</span>
          <span className="text-stone-400">({product.reviewCount || 14})</span>
        </div>

        {/* Price & Circular Floating '+' Button */}
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

          {/* Circular Add-to-Cart '+' Button */}
          <button
            onClick={handleAdd}
            disabled={adding || product.stock <= 0}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-90 ${
              added
                ? 'bg-accent-green text-white rotate-0'
                : product.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white hover:scale-105'
            }`}
            title={product.stock <= 0 ? "Out of Stock" : "Add to Basket"}
            aria-label="Add to cart"
          >
            {added ? (
              <Check className="w-5 h-5 animate-in zoom-in" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
