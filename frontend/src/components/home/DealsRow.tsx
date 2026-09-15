'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Tag } from 'lucide-react';

const DEALS = [
  {
    id: 1,
    badge: 'Deal of the Day',
    badgeIcon: Flame,
    title: 'Kerala & Indian Snack Specials',
    subtitle: 'Save on authentic banana chips, spicy mixture, sweet cheeda & savory murukku.',
    cta: 'Claim Daily Deal',
    href: '/products?category=snacks-kerala-and-north-indian',
    cardBg: 'bg-gradient-to-br from-[#FFF9E6] via-[#FFF1C2] to-[#FFE599] border-2 border-amber-300 shadow-card',
    badgeStyle: 'bg-amber-400 text-stone-950 font-black border border-amber-500',
    tagStyle: 'bg-white/90 text-amber-900 font-bold border border-amber-300',
    titleColor: 'text-stone-950 font-black',
    subtitleColor: 'text-stone-800 font-medium',
    ctaStyle: 'bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white shadow-md',
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
    cardBg: 'bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0] border-2 border-emerald-300 shadow-card',
    badgeStyle: 'bg-emerald-600 text-white font-black border border-emerald-700',
    tagStyle: 'bg-white/90 text-emerald-900 font-bold border border-emerald-300',
    titleColor: 'text-stone-950 font-black',
    subtitleColor: 'text-stone-800 font-medium',
    ctaStyle: 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md',
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
    cardBg: 'bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4] border-2 border-teal-300 shadow-card',
    badgeStyle: 'bg-teal-600 text-white font-black border border-teal-700',
    tagStyle: 'bg-white/90 text-teal-900 font-bold border border-teal-300',
    titleColor: 'text-stone-950 font-black',
    subtitleColor: 'text-stone-800 font-medium',
    ctaStyle: 'bg-teal-800 hover:bg-teal-900 text-white shadow-md',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    tag: 'Weekend Exclusive',
  },
];

export default function DealsRow() {
  return (
    <section className="py-8 sm:py-10 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEALS.map((deal) => {
            const BadgeIcon = deal.badgeIcon;
            return (
              <div
                key={deal.id}
                className={`relative rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 ${deal.cardBg} flex flex-col justify-between p-6 sm:p-7 min-h-[220px] sm:min-h-[240px] group`}
              >
                {/* Background lifestyle image overlay */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-15 group-hover:opacity-25 transition-opacity duration-500 overflow-hidden pointer-events-none">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/70" />
                </div>

                {/* Top badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide shadow-xs ${deal.badgeStyle}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{deal.badge}</span>
                  </span>
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full ${deal.tagStyle}`}>
                    {deal.tag}
                  </span>
                </div>

                {/* Center text */}
                <div className="relative z-10 my-4 space-y-1.5">
                  <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${deal.titleColor}`}>
                    {deal.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 max-w-xs leading-relaxed font-medium ${deal.subtitleColor}`}>
                    {deal.subtitle}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 pt-2">
                  <Link
                    href={deal.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition group-hover:gap-3 ${deal.ctaStyle}`}
                  >
                    <span>{deal.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
