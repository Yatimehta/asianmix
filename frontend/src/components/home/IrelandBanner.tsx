import React from 'react';
import Link from 'next/link';
import { Truck, MapPin, Snowflake, Clock, CheckCircle } from 'lucide-react';

export default function IrelandBanner() {
  return (
    <section className="py-12 bg-gradient-to-br from-asian-jade-900 via-asian-jade-800 to-stone-900 text-white relative overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-asian-jade-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-asian-terracotta-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-asian-jade-700/60 border border-asian-jade-500/30 text-xs font-semibold text-asian-mustard-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nationwide Ireland Coverage</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Fast, Reliable Delivery to Every Corner of Ireland
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
              From city apartments in Dublin, Cork, and Galway to homes in Donegal, Kerry, and all 32 counties. We pack your pantry essentials with utmost care, using eco-insulated chilled packaging for perishable goods.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-200">
                <CheckCircle className="w-4 h-4 text-asian-mustard-400 shrink-0" />
                <span>Free delivery over €50</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-200">
                <CheckCircle className="w-4 h-4 text-asian-mustard-400 shrink-0" />
                <span>Eircode-accurate courier</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-200">
                <CheckCircle className="w-4 h-4 text-asian-mustard-400 shrink-0" />
                <span>Cork Click & Collect</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white font-bold text-xs shadow-lg hover:shadow-xl transition"
              >
                Shop Now with Free Delivery
              </Link>
              <Link
                href="/faq"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
              >
                View Ireland Shipping Rates
              </Link>
            </div>
          </div>

          {/* Right info cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-asian-terracotta-500/30 text-asian-terracotta-400 flex items-center justify-center shrink-0 border border-asian-terracotta-500/40">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Standard Courier Delivery</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  €5.99 flat rate nationwide. Guaranteed free delivery when your basket reaches €50.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-asian-jade-500/30 text-asian-jade-300 flex items-center justify-center shrink-0 border border-asian-jade-500/40">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cold-Chain Fresh Produce</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Reusable insulated foil bags & ice gel packs keep pak choi, gyoza, and tofu chilled up to 48 hours.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-asian-mustard-500/30 text-asian-mustard-300 flex items-center justify-center shrink-0 border border-asian-mustard-500/40">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cork Central Warehouse</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Same-day dispatch for orders placed before 1:00 PM Monday through Friday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
