'use client';

import React from 'react';
import { Instagram, Heart, MapPin } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    handle: '@foodie_dublin',
    location: 'Dublin 2',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    caption: 'Authentic Pavizham Matta Rice & Shan Masalas delivered to Dublin in 24 hours! Best Asian grocery delivery in Ireland 🍚',
    likes: '428',
  },
  {
    id: 2,
    handle: '@cork_kitchen',
    location: 'Cork City',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    caption: 'Crispy pan-fried dumplings and sweet tea snacks arrived for evening tea in Cork! Incredibly fresh ☕',
    likes: '612',
  },
  {
    id: 3,
    handle: '@galway_eats',
    location: 'Galway',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    caption: 'Pantry restock day in Galway! Authentic ramen, TRS gram flour & India Gate basmati rice 🌾',
    likes: '350',
  },
  {
    id: 4,
    handle: '@limerick_bites',
    location: 'Limerick',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    caption: 'Authentic chili oils, noodles and fresh Asian greens arrived safely in Limerick! Highly recommend Asianmix 🌶️',
    likes: '890',
  },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80';

export default function SocialFeed() {
  return (
    <section className="py-16 bg-[#F8F7F4] border-t border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFBE26]/20 border border-[#FFBE26]/40 text-xs font-black text-[#2C2C2A] uppercase tracking-widest">
            <Instagram className="w-3.5 h-3.5 text-[#2C2C2A]" /> #AsianmixIreland
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2A] mt-2">
            Loved Across Irish Kitchens
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tag us in your Asian home cooking, pantry hauls, and hot pot feasts to be featured!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {POSTS.map((post) => (
            <div
              key={post.id}
              className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-[#2C2C2A] border border-[#3A3A38] flex flex-col"
            >
              {/* Dish / Grocery Haul Image */}
              <div className="aspect-square relative overflow-hidden bg-stone-900">
                <img
                  src={post.image}
                  alt={post.handle}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#2C2C2A]/85 backdrop-blur-md text-stone-200 px-2.5 py-1 rounded-full border border-white/10">
                    <MapPin className="w-3 h-3 text-[#FFBE26]" />
                    {post.location}
                  </span>
                </div>
              </div>

              {/* Charcoal Card Footer with Yellow Accents */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-[#2C2C2A] text-white">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-[#FFBE26] hover:underline cursor-pointer">
                      {post.handle}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-stone-300">
                      <Heart className="w-3.5 h-3.5 text-[#FFBE26] fill-[#FFBE26]" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
