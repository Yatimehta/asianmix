import React from 'react';
import { Instagram, Heart } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    handle: '@foodie_dublin',
    location: 'Dublin 2',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    caption: 'Midnight Buldak noodles hit different with crispy chili oil! Delivery from @asianmix.ie was lightning fast 🍜',
    likes: '428',
  },
  {
    id: 2,
    handle: '@cork_kitchen',
    location: 'Cork City',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80',
    caption: 'Homemade gyoza dinner night! All dumplings & black vinegar sourced from Asianmix 🥟',
    likes: '612',
  },
  {
    id: 3,
    handle: '@galway_eats',
    location: 'Galway',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    caption: 'Pantry restock day! Authentic Sichuan peppercorns, Lee Kum Kee dark soy & Daawat rice 🍚',
    likes: '350',
  },
  {
    id: 4,
    handle: '@limerick_bites',
    location: 'Limerick',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&q=80',
    caption: 'Korean strawberry milk and matcha snacks arrived safely in Limerick! Best Asian snack box ever 🍓',
    likes: '890',
  },
];

export default function SocialFeed() {
  return (
    <section className="py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-asian-terracotta-600 uppercase tracking-widest">
            <Instagram className="w-4 h-4" /> #AsianmixIreland
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Loved Across Irish Kitchens
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Tag us in your Asian home cooking, pantry hauls, and hot pot feasts to be featured!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-stone-200"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.handle}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{post.handle}</span>
                    <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                      {post.location}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs line-clamp-3 text-stone-200 leading-snug">{post.caption}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-rose-300">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
