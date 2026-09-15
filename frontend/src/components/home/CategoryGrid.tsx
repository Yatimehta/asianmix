'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Utensils, Sparkles, Coffee, Leaf, ShoppingBag, ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories?: Category[];
}

const DEFAULT_CATEGORIES = [
  {
    slug: 'snacks-kerala-and-north-indian',
    name: 'Snacks & Delicacies',
    groupName: 'Snacks & Crunch',
    description: 'Crispy banana chips, murukku, mixtures, savory & sweet crunch',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    icon: Sparkles,
    groupBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    color: 'from-amber-950/85 via-amber-900/40 to-transparent',
  },
  {
    slug: 'spices-whole-spice-powder-and-masalas',
    name: 'Whole Spices & Masalas',
    groupName: 'Spices & Seasonings',
    description: 'Chilli, coriander, turmeric powder, garam masala & whole spices',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6802.jpg?v=1626047789',
    icon: Flame,
    groupBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    color: 'from-rose-950/85 via-rose-900/40 to-transparent',
  },
  {
    slug: 'fresh-and-frozen-vegetables',
    name: 'Fresh Produce',
    groupName: 'Cold-Chain Fresh',
    description: 'Authentic Indian gourds, okra, fresh ginger, leaves & roots',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    icon: Leaf,
    groupBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    color: 'from-emerald-950/85 via-emerald-900/40 to-transparent',
  },
  {
    slug: 'rice-and-grains',
    name: 'Rice & Grains',
    groupName: 'Pantry Essentials',
    description: 'Matta rice, Basmati rice, premium Chakki fresh wheat flour',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    icon: Utensils,
    groupBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    color: 'from-orange-950/85 via-orange-900/40 to-transparent',
  },
  {
    slug: 'pickles-and-paste',
    name: 'Sauces & Condiments',
    groupName: 'Sauces & Pastes',
    description: 'Kerala mango & lime pickles, ginger-garlic pastes, chutney bases',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    icon: ShoppingBag,
    groupBadge: 'bg-teal-100 text-teal-900 border-teal-300',
    color: 'from-teal-950/85 via-teal-900/40 to-transparent',
  },
  {
    slug: 'drinks',
    name: 'Drinks & Beverages',
    groupName: 'Beverages',
    description: 'Frooti, Maaza mango drinks, Basil seed juice & authentic milk mixes',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/download.jpg?v=1718267006',
    icon: Coffee,
    groupBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    color: 'from-cyan-950/85 via-cyan-900/40 to-transparent',
  },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
              Browse Our Aisles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2A] mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2C2C2A] hover:text-black group transition"
          >
            <span>View All Aisles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {DEFAULT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 bg-white border border-stone-200/90 hover:border-stone-400/80 flex flex-col h-64"
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-85 group-hover:opacity-95 transition-opacity`} />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${cat.groupBadge}`}>
                      {cat.groupName}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black leading-tight text-white group-hover:text-stone-100 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-stone-300 line-clamp-2 mt-1 hidden sm:block opacity-90">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
