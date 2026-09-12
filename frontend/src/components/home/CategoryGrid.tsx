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
    name: 'Snacks & Kerala Specialties',
    description: 'Crispy banana chips, murukku, mixtures, savory & sweet crunch',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    icon: Sparkles,
    color: 'from-amber-600/80 to-asian-terracotta-700/90',
  },
  {
    slug: 'spices-whole-spice-powder-and-masalas',
    name: 'Whole Spices & Masalas',
    description: 'Chilli, coriander, turmeric powder, garam masala & whole spices',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6802.jpg?v=1626047789',
    icon: Flame,
    color: 'from-yellow-600/80 to-asian-terracotta-700/90',
  },
  {
    slug: 'fresh-and-frozen-vegetables',
    name: 'Fresh Vegetables',
    description: 'Authentic Indian gourds, okra, fresh ginger, leaves & roots',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    icon: Leaf,
    color: 'from-asian-jade-600/80 to-emerald-800/90',
  },
  {
    slug: 'rice-and-grains',
    name: 'Rice & Atta (Flour)',
    description: 'Matta rice, Basmati rice, premium Chakki fresh wheat flour',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    icon: Utensils,
    color: 'from-asian-terracotta-600/80 to-amber-700/90',
  },
  {
    slug: 'pickles-and-paste',
    name: 'Pickles, Pastes & Bottle Food',
    description: 'Kerala mango & lime pickles, ginger-garlic pastes, chutney bases',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    icon: ShoppingBag,
    color: 'from-rose-600/80 to-pink-700/90',
  },
  {
    slug: 'drinks',
    name: 'Drinks & Beverages',
    description: 'Frooti, Maaza mango drinks, Basil seed juice & authentic milk mixes',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/download.jpg?v=1718267006',
    icon: Coffee,
    color: 'from-teal-600/80 to-asian-jade-800/90',
  },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-asian-terracotta-600">
              Browse Our Aisles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-asian-terracotta-600 hover:text-asian-terracotta-700 group transition"
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
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-stone-200/80 flex flex-col h-64"
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-75 group-hover:opacity-85 transition-opacity`} />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black leading-tight group-hover:text-asian-mustard-300 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-stone-200 line-clamp-2 mt-1 hidden sm:block opacity-90">
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
