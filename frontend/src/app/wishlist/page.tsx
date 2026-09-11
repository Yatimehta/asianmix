'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { fetchApi } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetchApi(`/products?ids=${wishlistIds.join(',')}&limit=100`);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load wishlist products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistIds]);

  const handleAddAllToCart = async () => {
    if (addingAll || products.length === 0) return;
    setAddingAll(true);
    try {
      const inStockItems = products.filter((p) => p.stock > 0);
      for (const item of inStockItems) {
        await addToCart(item.id, 1);
      }
      setAddedAllSuccess(true);
      setTimeout(() => setAddedAllSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to add all items to cart:', err);
    } finally {
      setAddingAll(false);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your saved wishlist?')) {
      wishlistIds.forEach((id) => toggleWishlist(id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">Wishlist</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-accent-red px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Saved For Later</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              My Wishlist
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Keep track of your favorite Asian pantry essentials, fresh produce, and specialty snacks.
            </p>
          </div>

          {products.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearWishlist}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-accent-red px-3 py-2 rounded-xl hover:bg-red-50 transition border border-stone-200 hover:border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <button
                onClick={handleAddAllToCart}
                disabled={addingAll}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {addedAllSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    <span>Added In-Stock Items!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addingAll ? 'Adding Items...' : 'Add All In-Stock to Basket'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-stone-200/80 p-4 flex flex-col gap-3 animate-pulse"
              >
                <div className="aspect-square bg-stone-100 rounded-2xl w-full" />
                <div className="h-3 bg-stone-100 rounded w-1/3" />
                <div className="h-4 bg-stone-100 rounded w-4/5" />
                <div className="h-4 bg-stone-100 rounded w-1/2 mt-auto" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-12 sm:p-16 text-center max-w-xl mx-auto my-8">
            <div className="w-20 h-20 bg-red-50 text-accent-red rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
              Explore over 450 authentic Asian spices, aromatic basmati rice, noodles, and fresh specialty produce. Click the heart icon on any product to save it here!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-3 rounded-2xl text-sm font-bold transition"
              >
                <span>Explore 20 Collections</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Showing {products.length} saved {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
