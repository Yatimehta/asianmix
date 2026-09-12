'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatEUR } from '@/lib/api';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2C2C2A]" />
              <h2 className="text-lg font-bold text-stone-900">Your Basket ({itemCount})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress for Ireland */}
          <div className="bg-brand-teal-light p-4 border-b border-brand-teal-border">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-teal-dark" />
                {amountNeededForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-brand-brown">{formatEUR(amountNeededForFreeShipping)}</strong> for <strong className="text-brand-teal-dark">FREE Ireland Delivery</strong>
                  </>
                ) : (
                  <span className="text-brand-green-dark font-bold">🎉 You qualify for FREE Delivery in Ireland!</span>
                )}
              </span>
              <span className="font-bold text-brand-teal-dark">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#EFE8DE] h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-green-base h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-stone-700">Your basket is empty</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Explore our authentic Asian sauces, noodles, snacks, and fresh ingredients.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-6 inline-block px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-hover transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-stone-800 hover:text-primary line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">{item.weight || 'Standard unit'}</p>
                    <p className="text-sm font-bold text-primary mt-1">{formatEUR(item.price)}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-300 hover:text-red-500 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone-200 text-stone-600 rounded-l transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-stone-200 text-stone-600 rounded-r transition disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatEUR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Ireland Shipping</span>
                  <span>{subtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout (€5.99)'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total</span>
                <span className="text-xl font-black text-stone-900">{formatEUR(subtotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full text-center py-2.5 px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  View Basket
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] text-xs font-black shadow-card transition flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2C2C2A]" />
                </Link>
              </div>

              <p className="text-center text-[10px] text-stone-400">
                🔒 256-Bit SSL Encrypted Checkout • Stripe Verified
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
