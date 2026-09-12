'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Tag, Timer } from 'lucide-react';

const DEALS = [
  {
    id: 1,
    badge: 'Deal of the Day',
    badgeIcon: Flame,
    title: 'Kerala & Indian Snack Specials',
    subtitle: 'Save on authentic banana chips, spicy mixture, sweet cheeda & savory murukku.',
    cta: 'Claim Daily Deal',
    href: '/products?category=snacks-kerala-and-north-indian',
    accentBg: 'bg-gradient-to-br from-primary via-[#6B3E19] to-secondary',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    tag: 'Limited 24h Deal',
  },
  {
    id: 2,
    badge: 'Fresh Friday — Flat 20% Off',
    badgeIcon: Sparkles,
    title: 'Farm-Fresh Indian Greens & Veg',
    subtitle: 'Crisp green chillies, grated coconut, okra & frozen delicacies with eco ice packaging.',
    cta: 'Shop Fresh Deals',
    href: '/products?category=fresh-and-frozen-vegetables',
    accentBg: 'bg-gradient-to-br from-[#2D6A4F] to-[#143326]',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    tag: 'Cold-Chain Guaranteed',
  },
  {
    id: 3,
    badge: 'Weekend Special — Buy 1 Get 1',
    badgeIcon: Tag,
    title: 'Traditional Pickles, Pastes & Masalas',
    subtitle: 'Special offers on authentic Kerala mango pickle, garlic paste and fragrant spice blends.',
    cta: 'Unlock Special Offer',
    href: '/products?category=pickles-and-paste',
    accentBg: 'bg-gradient-to-br from-[#D97706] to-[#78350F]',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    tag: 'Weekend Exclusive',
  },
];

export default function DealsRow() {
  return (
    <section className="py-8 sm:py-10 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEALS.map((deal) => {
            const BadgeIcon = deal.badgeIcon;
            return (
              <div
                key={deal.id}
                className={`relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${deal.accentBg} text-white flex flex-col justify-between p-6 sm:p-7 min-h-[220px] sm:min-h-[240px] group`}
              >
                {/* Background lifestyle image overlay */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 overflow-hidden pointer-events-none">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50" />
                </div>

                {/* Top badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-[11px] font-bold tracking-wide">
                    <BadgeIcon className="w-3 h-3 text-white" />
                    <span>{deal.badge}</span>
                  </span>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-black/25 px-2 py-0.5 rounded-full text-white/90">
                    {deal.tag}
                  </span>
                </div>

                {/* Center text */}
                <div className="relative z-10 my-4 space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-2 max-w-xs leading-relaxed font-medium">
                    {deal.subtitle}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 pt-2">
                  <Link
                    href={deal.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs shadow-md transition group-hover:gap-3"
                  >
                    <span>{deal.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-900" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
