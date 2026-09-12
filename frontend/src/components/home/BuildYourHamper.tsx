'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingBag, Check, Sparkles, RefreshCw, Gift } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchApi, formatEUR } from '@/lib/api';
import { Product } from '@/types';

interface HamperItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  image: string;
  quantity: number;
}

const DEFAULT_HAMPER_ITEMS: HamperItem[] = [
  {
    id: 'trs-gram-flour-2kg',
    name: 'Gram Flour (TRS)',
    weight: '1 Kg',
    price: 3.40,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/TRSGramflour.jpg?v=1704314036',
    quantity: 1,
  },
  {
    id: 'sweet-cheeda',
    name: 'Sweet Cheeda / Kerala Snack',
    weight: '200g Pack',
    price: 2.29,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    quantity: 1,
  },
  {
    id: 'pavizham-matta-rice',
    name: 'Pavizham Matta Rice',
    weight: '5 Kg',
    price: 9.99,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    quantity: 1,
  },
  {
    id: 'garlic-paste-shan',
    name: 'Garlic Paste (Shan)',
    weight: '310g Jar',
    price: 2.49,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_20220206_155148_edited.jpg?v=1644162763',
    quantity: 1,
  },
  {
    id: 'soan-papdi-sweet',
    name: 'Soan Papdi Traditional Sweet',
    weight: '250g Box',
    price: 2.99,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SoanPapdi.jpg?v=1700593680',
    quantity: 0,
  },
  {
    id: 'grated-coconut-daily-delight',
    name: 'Grated Coconut (Daily Delight)',
    weight: '400g Pack',
    price: 2.89,
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/DDGratedcoconut.jpg?v=1704142134',
    quantity: 0,
  },
];

export default function BuildYourHamper() {
  const { addToCart, openCart } = useCart();
  const [items, setItems] = useState<HamperItem[]>(DEFAULT_HAMPER_ITEMS);
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscribe'>('onetime');
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sync actual DB product IDs if available
  useEffect(() => {
    const fetchCatalogIds = async () => {
      try {
        const res = await fetchApi('/products?limit=25');
        if (res.success && res.products) {
          const prods: Product[] = res.products;
          setItems((prev) =>
            prev.map((item) => {
              const matched = prods.find(
                (p) =>
                  p.slug.includes(item.id) ||
                  p.name.toLowerCase().includes(item.name.toLowerCase().slice(0, 8))
              );
              return matched
                ? {
                    ...item,
                    id: matched.id,
                    price: matched.price,
                    image: matched.images?.[0] || item.image,
                  }
                : item;
            })
          );
        }
      } catch (err) {
        // Fallback gracefully to default items
      }
    };
    fetchCatalogIds();
  }, []);

  const updateItemQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountMultiplier = purchaseType === 'subscribe' ? 0.9 : 1.0;
  const finalSubtotal = rawSubtotal * discountMultiplier;

  const handleAddHamper = async () => {
    const itemsToAdd = items.filter((item) => item.quantity > 0);
    if (itemsToAdd.length === 0 || isAdding) return;

    setIsAdding(true);
    try {
      for (const item of itemsToAdd) {
        await addToCart(item.id, item.quantity);
      }
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        openCart();
      }, 1000);
    } catch (err) {
      console.error('Error adding hamper to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F5F1E8]/70 border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBE26]/20 border border-[#FFBE26]/40 text-xs font-black text-[#2C2C2A] uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5 text-[#2C2C2A]" />
            <span>Custom Box Builder</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2C2C2A] tracking-tight">
            Build Your Own Asian Pantry Hamper
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Mix and match your favorite authentic sauces, noodles, rice & dumplings into a custom Irish delivery box.
          </p>
        </div>

        {/* 2-Column "Mix-A-Pack" Card */}
        <div className="bg-white rounded-3xl border border-stone-300/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Lifestyle Photo Card (5 cols) */}
          <div className="lg:col-span-5 relative bg-[#2C2C2A] text-white min-h-[320px] lg:min-h-[580px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85"
              alt="Gourmet Asian Hamper"
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1E] via-[#2C2C2A]/85 to-transparent" />

            {/* Top Pill */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFBE26] text-[#2C2C2A] font-extrabold text-xs shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Irish Chef&apos;s Selection</span>
              </span>
            </div>

            {/* Center / Bottom copy */}
            <div className="relative z-10 space-y-3 my-auto pt-8">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Authentic Asian Flavors, Handpicked by You
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-sm font-medium">
                Shipped directly from our Cork warehouse with cold-chain packaging for fresh dumplings and premium pantry staples.
              </p>

              <div className="pt-2 space-y-1.5 text-xs text-stone-300 font-semibold">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE26]" />
                  <span>Choose any combination of 4 to 6 items</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE26]" />
                  <span>Save 10% on monthly replenishment subscription</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE26]" />
                  <span>Free delivery across Ireland over €50</span>
                </p>
              </div>
            </div>

            {/* Bottom summary badge */}
            <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
              <span className="text-stone-300 font-medium">Hamper Items Selected:</span>
              <span className="font-extrabold text-[#2C2C2A] text-sm bg-[#FFBE26] px-3 py-1 rounded-full">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Right Products Stepper List (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h4 className="text-sm font-black text-[#2C2C2A] uppercase tracking-wider">
                  Select Your Items
                </h4>
                <span className="text-xs font-bold text-brand-yellow-dark bg-brand-yellow-light border border-brand-yellow-border px-2.5 py-0.5 rounded-full">
                  {totalItemCount} selected
                </span>
              </div>

              {/* Items with Steppers */}
              <div className="divide-y divide-stone-100 max-h-[360px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 sm:py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-stone-400">{item.weight}</p>
                        <p className="text-xs font-black text-[#2C2C2A] mt-0.5">
                          {formatEUR(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 shadow-sm shrink-0">
                      <button
                        onClick={() => updateItemQty(item.id, -1)}
                        disabled={item.quantity <= 0}
                        className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 rounded-l transition disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQty(item.id, 1)}
                        className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 rounded-r transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radio Toggle: One-time vs Subscribe & Save 10% */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label
                onClick={() => setPurchaseType('onetime')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                  purchaseType === 'onetime'
                    ? 'bg-white border-[#2C2C2A] shadow-sm font-bold text-[#2C2C2A]'
                    : 'border-transparent text-stone-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hamperPurchase"
                    checked={purchaseType === 'onetime'}
                    onChange={() => setPurchaseType('onetime')}
                    className="accent-[#2C2C2A]"
                  />
                  <span>One-time purchase</span>
                </div>
                <span className="font-bold text-[#2C2C2A]">{formatEUR(rawSubtotal)}</span>
              </label>

              <label
                onClick={() => setPurchaseType('subscribe')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                  purchaseType === 'subscribe'
                    ? 'bg-brand-green-light/40 border-brand-green-base shadow-sm font-bold text-brand-green-dark'
                    : 'border-transparent text-stone-600 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hamperPurchase"
                    checked={purchaseType === 'subscribe'}
                    onChange={() => setPurchaseType('subscribe')}
                    className="accent-brand-green-base"
                  />
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-brand-green-base" />
                    <span>Subscribe & save 10%</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-brand-green-dark">
                    {formatEUR(rawSubtotal * 0.9)}
                  </span>
                  <span className="text-[10px] text-stone-400 block line-through">
                    {formatEUR(rawSubtotal)}
                  </span>
                </div>
              </label>
            </div>

            {/* Subtotal & Add Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 block">Hamper Subtotal:</span>
                <span className="text-2xl font-black text-[#2C2C2A]">
                  {formatEUR(finalSubtotal)}
                </span>
                {purchaseType === 'subscribe' && (
                  <span className="text-[10px] text-brand-green-dark font-bold block">
                    ✓ 10% recurring discount applied
                  </span>
                )}
              </div>

              <button
                onClick={handleAddHamper}
                disabled={totalItemCount === 0 || isAdding}
                className={`py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'bg-brand-green-base text-white'
                    : totalItemCount === 0
                    ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                    : 'bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] active:scale-95'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added Hamper to Basket! 🎉</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isAdding
                        ? 'Adding...'
                        : totalItemCount === 0
                        ? 'Select Items First'
                        : `Add Hamper (${totalItemCount} items) • ${formatEUR(finalSubtotal)}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
