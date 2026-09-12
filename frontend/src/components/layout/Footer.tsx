'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Send, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Smartphone, 
  ShieldCheck,
  Truck
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#2C2C2A] text-stone-200">
      {/* 1. Accent Color Band Newsletter Signup */}
      <div className="bg-[#222220] border-b border-stone-800 py-10 px-4 sm:px-6 lg:px-8 text-white shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-brand-yellow-base">
              Exclusive Irish Shoppers Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Get 10% Off Your First Irish Grocery Order
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg font-medium opacity-90">
              Join 12,000+ home cooks in Dublin, Cork, Galway & across Ireland. We send authentic pantry recipes and weekly flash deals.
            </p>
          </div>

          <div className="w-full lg:w-auto max-w-md">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3.5 rounded-2xl bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-stone-400 shadow-md font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-xs sm:text-sm rounded-2xl shadow-card transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4 text-[#2C2C2A]" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-brand-green-base font-bold mt-2 flex items-center justify-center lg:justify-start gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Welcome! Check your inbox for voucher code <strong>ASIAN10</strong>.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Standard 4-Column Footer (GreenBasket Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Shop Aisles</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/products?category=snacks-kerala-and-north-indian" className="hover:text-white transition">
                  Snacks (Kerala & North Indian)
                </Link>
              </li>
              <li>
                <Link href="/products?category=spices-whole-spice-powder-and-masalas" className="hover:text-white transition">
                  Whole Spices & Masalas
                </Link>
              </li>
              <li>
                <Link href="/products?category=fresh-and-frozen-vegetables" className="hover:text-white transition">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products?category=rice-and-grains" className="hover:text-white transition">
                  Rice & Atta (Flour)
                </Link>
              </li>
              <li>
                <Link href="/products?category=pickles-and-paste" className="hover:text-white transition">
                  Pickles, Pastes & Bottle Food
                </Link>
              </li>
              <li>
                <Link href="/products?category=drinks" className="hover:text-white transition">
                  Drinks & Beverages
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#FFBE26] font-black hover:underline">
                  View All 16 Aisles →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Help */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Help & Shipping</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Ireland Delivery Rates (Free &gt; €50)
                </Link>
              </li>
              <li>
                <Link href="/faq#coldpack" className="hover:text-white transition">
                  Cold-Chain Insulated Packaging
                </Link>
              </li>
              <li>
                <Link href="/faq#returns" className="hover:text-white transition">
                  Returns & Refund Guarantee
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition">
                  Track Your Courier Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Cork Click & Collect Depot
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  All 32 Counties FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Asianmix */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">About Asianmix</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Irish Asian Story
                </Link>
              </li>
              <li>
                <Link href="/about#authentic" className="hover:text-white transition">
                  100% Authentic Brand Sourcing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Wholesale & Food Service Cork
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Sustainability & Eco Packaging
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get Our App / Social / Cork Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">Get Our App & Follow</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Order your favorite Asian groceries in seconds on mobile.
            </p>

            {/* App download badges */}
            <div className="flex flex-col gap-2">
              <div className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#FFBE26]" />
                <div className="text-[10px]">
                  <span className="text-stone-400 block">Download on</span>
                  <span className="text-white font-bold text-xs">Apple App Store</span>
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-brand-green-base" />
                <div className="text-[10px]">
                  <span className="text-stone-400 block">Get it on</span>
                  <span className="text-white font-bold text-xs">Google Play Store</span>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-400 block mb-2">Connect with Us</span>
              <div className="flex items-center gap-2 text-stone-400">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary hover:text-white flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary hover:text-white flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-primary hover:text-white flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-14 pt-6 border-t border-[#5C3415]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center">
              亞
            </div>
            <span>© {new Date().getFullYear()} Asianmix Ireland Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 text-[11px] flex-wrap justify-center">
            <span>🇮🇪 Registered in Ireland</span>
            <span>•</span>
            <span>VAT Registered</span>
            <span>•</span>
            <span>Cork Central Depot</span>
            <span>•</span>
            <span>All 32 Counties Covered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
