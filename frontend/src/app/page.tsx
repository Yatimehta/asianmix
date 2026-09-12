'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import HeroSlider from '@/components/home/HeroSlider';
import DealsRow from '@/components/home/DealsRow';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCard from '@/components/product/ProductCard';
import BuildYourHamper from '@/components/home/BuildYourHamper';
import IrelandBanner from '@/components/home/IrelandBanner';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import SocialFeed from '@/components/home/SocialFeed';
import { fetchApi } from '@/lib/api';
import { Product } from '@/types';

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bsRes, featRes] = await Promise.all([
          fetchApi('/products?bestSeller=true&limit=8'),
          fetchApi('/products?featured=true&limit=4'),
        ]);

        if (bsRes.success) setBestSellers(bsRes.products || []);
        if (featRes.success) setFeaturedDeals(featRes.products || []);
      } catch (err) {
        console.error('Error loading homepage products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* 1. Hero Slideshow + Curved/Wavy SVG Ribbon Transition + Brand Pillars Strip */}
      <HeroSlider />

      {/* 2. 3-Card Deals Row (GreenBasket Style: Deal of Day, Fresh Friday 20%, Weekend BOGO) */}
      <DealsRow />

      {/* 3. Category Grid Showcase */}
      <CategoryGrid />

      {/* 4. Best Sellers Horizontal Grid with Photography-Forward Cards & Circular '+' Buttons */}
      <section className="py-14 sm:py-16 bg-[#F8F7F4] border-t border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand-yellow-dark">
                <Flame className="w-3.5 h-3.5 text-brand-yellow-base" />
                <span>Popular in Irish Kitchens</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2A] mt-1">
                Best Sellers & Irish Favorites
              </h2>
            </div>

            <Link
              href="/products?bestSeller=true"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C2C2A] hover:text-black transition group"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-stone-200/60 rounded-3xl h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SIPPA-Style Interactive "Build Your Own Hamper" Module */}
      <BuildYourHamper />

      {/* 6. Featured Promotions / Deals Grid */}
      {featuredDeals.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#F8F7F4] border-t border-stone-200/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-brand-green-dark">
                  <Sparkles className="w-3.5 h-3.5 text-brand-green-base" />
                  <span>Curated Promotions</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2A] mt-1">
                  Limited-Time Specials
                </h2>
              </div>

              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2C2C2A] hover:text-black transition group"
              >
                <span>View All Specials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* 8. Ireland Nationwide Delivery & Freshness Guarantee Banner */}
      <IrelandBanner />

      {/* 9. GreenBasket "Why Choose Asianmix" 5-Badge Trust Strip */}
      <WhyChooseUs />

      {/* 10. Instagram Community Feed */}
      <SocialFeed />
    </div>
  );
}
