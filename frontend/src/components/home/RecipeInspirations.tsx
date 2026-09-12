'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, BookOpen, ChefHat, Sparkles } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    category: 'Traditional Masterclass',
    readTime: '6 min read',
    title: 'Mastering Authentic Kerala Dum Biryani with Fragrant Basmati & Spices',
    excerpt: 'Layer aromatic Basmati rice, caramelized onions, fresh mint, and whole Shan spices for the ultimate festive Irish family dinner.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=biriyani-essential',
  },
  {
    id: 2,
    category: 'Homestyle Cooking',
    readTime: '4 min read',
    title: 'Kerala Vegetable Thoran & Quick Sambar with Fresh Green Produce',
    excerpt: 'Stir-fry fresh green vegetables and grated coconut with mustard seeds, curry leaves, and fragrant turmeric in under 15 minutes.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=fresh-and-frozen-vegetables',
  },
  {
    id: 3,
    category: 'Pantry Essentials',
    readTime: '5 min read',
    title: '5 Must-Have Authentic Indian Pickles & Pastes for Your Irish Kitchen',
    excerpt: 'From tangy Kerala cut mango pickles to ginger-garlic bases and pure ghee — essential jars that elevate everyday meals.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    link: '/products?category=pickles-and-paste',
  },
];

export default function RecipeInspirations() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBE26]/20 border border-[#FFBE26]/40 text-xs font-black text-[#2C2C2A] uppercase tracking-widest mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#2C2C2A]" />
              <span>Culinary Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2A] tracking-tight">
              Recipes & Cooking Tips
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Authentic Asian cooking tips, foolproof weeknight dinners, and pantry masterclasses using ingredients available in our store.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2C2C2A] hover:text-black transition group"
          >
            <span>Browse All Pantry Ingredients</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 3-Article Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              className="group rounded-3xl border border-stone-200/90 overflow-hidden hover:border-[#FFBE26] hover:shadow-xl transition-all duration-300 flex flex-col bg-[#F8F7F4]"
            >
              {/* Image Box */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur-md text-[#2C2C2A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {article.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-[#2C2C2A]/85 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFBE26]" />
                    {article.readTime}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-[#2C2C2A] leading-snug group-hover:text-black transition">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between">
                  <Link
                    href={article.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C2C2A] hover:text-black transition group-hover:translate-x-1"
                  >
                    <span>Read Guide & Shop</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFBE26]" />
                  </Link>
                  <span className="text-[11px] text-stone-400 font-medium">Asianmix Kitchen</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
