'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles, CheckCircle2, Flame, Leaf } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'Ireland’s Premier Asian Supermarket',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Authentic Asian Groceries Delivered Across Ireland',
    subtitle: 'From Daawat & Pavizham Matta Rice to authentic Shan masalas, Eastern spices & ghee. Next-day dispatch to Dublin, Cork, Galway & all 32 counties.',
    ctaText: 'Explore Asian Pantry',
    ctaLink: '/products',
    ctaBg: 'bg-[#FFBE26] hover:bg-[#F59E0B] text-stone-950 border border-amber-300 shadow-md hover:shadow-lg',
    secondaryCtaText: 'Hot Weekly Specials',
    secondaryCtaLink: '/products?featured=true',
    secondaryCtaBg: 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Indiangatebasmati.jpg?v=1700756384',
    badge: '🚚 Free Ireland Delivery Over €50',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
    bgGradient: 'from-[#FFFDF5] via-[#FFF8E6] to-[#F5F2EB]',
    highlightTag: 'Top Pantry Staple',
    highlightColor: 'bg-amber-500 text-stone-950',
  },
  {
    id: 2,
    tag: 'Crispy, Savory & Sweet',
    tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
    title: 'Kerala & North Indian Snacks & Delicacies',
    subtitle: 'Crispy banana chips, spicy mixture, Haldirams favorites, Soan Papdi, and authentic South Indian crunch delivered fresh to your door.',
    ctaText: 'Shop Indian & Kerala Snacks',
    ctaLink: '/products?category=snacks-kerala-and-north-indian',
    ctaBg: 'bg-[#FFBE26] hover:bg-[#F59E0B] text-stone-950 border border-amber-300 shadow-md hover:shadow-lg',
    secondaryCtaText: 'Spices & Masalas',
    secondaryCtaLink: '/products?category=spices-whole-spice-powder-and-masalas',
    secondaryCtaBg: 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SoanPapdi.jpg?v=1700593680',
    badge: '🔥 450+ Authentic Products in Stock',
    badgeStyle: 'bg-rose-100 text-rose-900 border-rose-300',
    bgGradient: 'from-[#FFF7F7] via-[#FFEBEF] to-[#F8F5F2]',
    highlightTag: 'Fresh Authentic Crunch',
    highlightColor: 'bg-rose-600 text-white',
  },
  {
    id: 3,
    tag: 'Cold-Chain Guaranteed Freshness',
    tagColor: 'bg-teal-100 text-teal-900 border-teal-300',
    title: 'Fresh Indian Vegetables, Roots & Essentials',
    subtitle: 'Shipped in temperature-controlled eco packaging so your fresh gourds, okra, green chillies, and roots arrive vibrant & kitchen-fresh.',
    ctaText: 'Shop Fresh Vegetables',
    ctaLink: '/products?category=fresh-and-frozen-vegetables',
    ctaBg: 'bg-[#FFBE26] hover:bg-[#F59E0B] text-stone-950 border border-amber-300 shadow-md hover:shadow-lg',
    secondaryCtaText: 'Rice & Atta Flour',
    secondaryCtaLink: '/products?category=rice-and-grains',
    secondaryCtaBg: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    badge: '❄️ Eco Chilled Packaging Across 32 Counties',
    badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    bgGradient: 'from-[#F3FBF7] via-[#E6F7EF] to-[#F2F7F4]',
    highlightTag: 'Direct Farm Harvest',
    highlightColor: 'bg-emerald-600 text-white',
  },
];

const BRAND_PILLARS = [
  { text: 'Authentic Asian Ingredients', color: 'bg-emerald-500' },
  { text: 'Cold-Chain Fresh Guarantee', color: 'bg-teal-500' },
  { text: 'Nationwide Ireland Delivery', color: 'bg-amber-400' },
  { text: 'Direct Manufacturer Imports', color: 'bg-rose-500' },
  { text: 'No Hidden Fees', color: 'bg-emerald-400' },
  { text: 'Fast Dispatch from Cork Depot', color: 'bg-amber-300' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-[#F8F7F4]">
      {/* Dynamic Slide Background with Smooth Transition */}
      <div className={`relative w-full bg-gradient-to-b ${slide.bgGradient} transition-colors duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* 2-Column Split Layout: Text on Left (no card), Product Photography on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[420px] sm:min-h-[460px]">
            
            {/* Left Column: Direct clean typography & CTAs */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border shadow-xs ${slide.badgeStyle}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.badge}</span>
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${slide.tagColor}`}>
                  {slide.tag}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black tracking-tight leading-[1.15] text-stone-900">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed font-medium max-w-xl">
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={slide.ctaLink}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${slide.ctaBg}`}
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${slide.secondaryCtaBg}`}
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>

              {/* Trust Points */}
              <div className="pt-3 border-t border-stone-300/70 flex flex-wrap items-center gap-5 text-xs text-stone-800 font-bold">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Shipping &gt; €50
                </span>
                <span className="flex items-center gap-1.5 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> 100% Authentic Direct Imports
                </span>
              </div>
            </div>

            {/* Right Column: Clean Standalone Product Showcase Showcase (100% Visible & Clear) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white group">
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Corner floating pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md ${slide.highlightColor}`}>
                    {slide.highlightTag}
                  </span>
                </div>

                {/* Subtle bottom gradient glow */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Dots Indicator & Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-200/60 mt-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-8 bg-[#FFBE26]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 shadow-sm border border-stone-200 transition-all hover:scale-105 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-stone-700" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 shadow-sm border border-stone-200 transition-all hover:scale-105 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-stone-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Curved / Wavy Ribbon SVG Divider in Vibrant Emerald */}
      <div className="relative w-full leading-none z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 lg:h-14 preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="#0F6848"
            fillOpacity="0.4"
          />
          <path
            d="M0,48L48,58.7C96,69,192,91,288,90.7C384,91,480,69,576,58.7C672,48,768,48,864,58.7C960,69,1056,91,1152,90.7C1248,91,1344,69,1392,58.7L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#0B5C3F"
          />
        </svg>
      </div>

      {/* Brand Pillars Strip with Vibrant Emerald Green Gradient and Colorful Accent Badges */}
      <div className="bg-gradient-to-r from-[#0B5C3F] via-[#0E6C4B] to-[#0A4E35] text-white py-3 px-4 shadow-md relative z-20 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm font-black tracking-wide uppercase whitespace-nowrap text-white">
            {BRAND_PILLARS.map((pillar, idx) => (
              <React.Fragment key={idx}>
                <span className="flex items-center gap-2 hover:text-amber-300 transition">
                  <span className={`w-2 h-2 rounded-full ${pillar.color} shadow-xs`} />
                  <span>{pillar.text}</span>
                </span>
                {idx < BRAND_PILLARS.length - 1 && (
                  <span className="text-amber-400/60 text-sm leading-none select-none">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


