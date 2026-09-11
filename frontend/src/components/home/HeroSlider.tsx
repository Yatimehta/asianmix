'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'Ireland’s Premier Asian Supermarket',
    title: 'Authentic Asian Groceries Delivered Across Ireland',
    subtitle: 'From Lao Gan Ma chili oil to Daawat Basmati & Japanese Ramen. Enjoy next-day dispatch to Dublin, Cork, Galway & all 32 counties.',
    ctaText: 'Explore Asian Pantry',
    ctaLink: '/products',
    secondaryCtaText: 'Hot Weekly Specials',
    secondaryCtaLink: '/products?featured=true',
    bgGradient: 'from-[#3D200B]/95 via-[#5C3415]/85 to-black/60',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1800&q=85',
    badge: '🚚 Free Ireland Delivery Over €50',
  },
  {
    id: 2,
    tag: 'Fiery & Crave-Worthy',
    title: 'Ramen, Dumplings & Hot Sauces Galore',
    subtitle: 'Indulge in viral Korean Buldak noodles, artisan Japanese ramen broth, handcrafted gyoza, and savory Taiwanese snacks.',
    ctaText: 'Shop Indian & Kerala Snacks',
    ctaLink: '/products?category=snacks-kerala-and-north-indian',
    secondaryCtaText: 'Spices & Masalas',
    secondaryCtaLink: '/products?category=spices-whole-spice-powder-and-masalas',
    bgGradient: 'from-secondary/95 via-primary/85 to-black/60',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1800&q=85',
    badge: '🔥 450+ Authentic Products in Stock',
  },
  {
    id: 3,
    tag: 'Cold-Chain Guaranteed',
    title: 'Fresh Asian Vegetables, Roots & Essentials',
    subtitle: 'Shipped in temperature-controlled packaging so your fresh gourds, roots, and spices arrive kitchen-fresh.',
    ctaText: 'Shop Fresh Vegetables',
    ctaLink: '/products?category=fresh-and-frozen-vegetables',
    secondaryCtaText: 'Rice & Atta Flour',
    secondaryCtaLink: '/products?category=rice-and-grains',
    bgGradient: 'from-[#2A4720]/95 via-primary/85 to-black/60',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=85',
    badge: '❄️ Eco Chilled Packaging Across 32 Counties',
  },
];

const BRAND_PILLARS = [
  'Authentic Asian Ingredients',
  'Cold-Chain Fresh Guarantee',
  'Nationwide Ireland Delivery',
  'Direct Manufacturer Imports',
  'No Hidden Fees',
  'Fast Dispatch from Cork Depot',
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-stone-900">
      {/* Hero Container */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full">
        {/* Background Images with Crossfade */}
        {SLIDES.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.bgGradient}`} />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFD05A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          </div>
        ))}

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-12">
          <div className="max-w-2xl text-white space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-6 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-semibold text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent-orange" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed drop-shadow max-w-xl">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition border border-white/20"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm transition"
              >
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Quick value badges */}
            <div className="pt-3 flex items-center gap-5 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent-orange" /> Free Ireland Shipping &gt; €50
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-green" /> 100% Authentic Imports
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition hidden sm:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition hidden sm:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-10 sm:bottom-12 left-0 right-0 z-30 flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-8 bg-accent-orange' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* SIPPA-Style Curved / Wavy Ribbon SVG Divider */}
      <div className="relative w-full leading-none z-20 -mt-6 sm:-mt-8">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-16 lg:h-20 text-asian-terracotta-500 preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Subtle background wave ribbon */}
          <path
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="#1B4332"
            fillOpacity="0.4"
          />
          {/* Primary wave ribbon */}
          <path
            d="M0,48L48,58.7C96,69,192,91,288,90.7C384,91,480,69,576,58.7C672,48,768,48,864,58.7C960,69,1056,91,1152,90.7C1248,91,1344,69,1392,58.7L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#C85A32"
          />
        </svg>
      </div>

      {/* SIPPA-Style Brand Pillars Strip with Dot Separators */}
      <div className="bg-asian-terracotta-500 text-white py-3.5 px-4 shadow-inner relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-center overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-3 sm:space-x-5 text-xs sm:text-sm font-black tracking-wide uppercase whitespace-nowrap text-asian-terracotta-50">
            {BRAND_PILLARS.map((pillar, idx) => (
              <React.Fragment key={idx}>
                <span className="hover:text-white transition flex items-center gap-2">
                  <span>{pillar}</span>
                </span>
                {idx < BRAND_PILLARS.length - 1 && (
                  <span className="text-asian-mustard-300 text-base leading-none select-none">
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
