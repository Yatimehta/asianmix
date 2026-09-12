'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatEUR } from '@/lib/api';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'ASIAN10' || promoCode.trim().toUpperCase() === 'IRELAND10') {
      setDiscountPercent(0.1);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid coupon code. Try ASIAN10 for 10% off.');
    }
  };

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 5.99;
  const discountAmount = subtotal * discountPercent;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7F4] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-yellow-light flex items-center justify-center text-brand-yellow-dark mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-[#2C2C2A]">Your Basket is Empty</h1>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            Looks like you haven&apos;t added any authentic Asian sauces, noodles, or ingredients to your basket yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-xs rounded-full shadow-lg transition"
          >
            <span>Explore Asian Groceries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2A]">
            Shopping Basket ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-stone-500 mt-1">Review your items before Ireland courier dispatch</p>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-green-border mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-stone-800 mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-green-base shrink-0" />
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-brand-yellow-dark">{formatEUR(amountNeededForFreeShipping)}</strong> more to unlock <strong>FREE Delivery Across Ireland</strong>!
                </span>
              ) : (
                <span className="text-brand-green-dark font-black">🎉 Congratulations! You have unlocked FREE Shipping to all 32 counties!</span>
              )}
            </span>
            <span>{freeShippingProgress}% Completed</span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-green-base to-[#FFBE26] h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
            <div className="divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-stone-200 shrink-0"
                    />
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-bold text-[#2C2C2A] hover:text-black transition line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-stone-400 mt-0.5">{item.weight || 'Standard item'}</p>
                      <p className="text-sm font-black text-[#2C2C2A] mt-1">
                        {formatEUR(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-l transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-r transition disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-black text-stone-900">
                        {formatEUR(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-300 hover:text-red-500 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <Link
                href="/products"
                className="text-xs font-bold text-[#2C2C2A] hover:underline flex items-center gap-1"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-stone-400 hover:text-red-500 transition"
              >
                Clear Entire Basket
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs font-bold text-stone-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#2C2C2A]" />
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ASIAN10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 uppercase text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFBE26]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#2C2C2A] hover:bg-black text-white rounded-xl text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> 10% voucher discount applied!
                  </p>
                )}
                {promoError && <p className="text-[11px] text-red-500 font-semibold">{promoError}</p>}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatEUR(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount (10%)</span>
                    <span>-{formatEUR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Ireland Delivery</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-brand-green-dark font-black">FREE</span>
                    ) : (
                      formatEUR(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Estimated Irish VAT (incl.)</span>
                  <span>{formatEUR(grandTotal * 0.135)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total Due</span>
                <span className="text-2xl font-black text-[#2C2C2A]">
                  {formatEUR(grandTotal)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green-base" />
                <span>Stripe Encrypted & Certified Ireland Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
