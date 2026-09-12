import React from 'react';
import { Instagram, Heart } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    handle: '@foodie_dublin',
    location: 'Dublin 2',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    caption: 'Authentic Pavizham Matta Rice & Shan Masalas delivered to Dublin in 24 hours! Best Asian grocery delivery in Ireland 🍚',
    likes: '428',
  },
  {
    id: 2,
    handle: '@cork_kitchen',
    location: 'Cork City',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    caption: 'Crispy banana chips and sweet cheeda snacks arrived for evening tea time in Cork! Delicious and fresh ☕',
    likes: '612',
  },
  {
    id: 3,
    handle: '@galway_eats',
    location: 'Galway',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/TRSGramflour.jpg?v=1704314036',
    caption: 'Pantry restock day in Galway! Authentic TRS Gram flour, Soan Papdi & India Gate basmati rice 🌾',
    likes: '350',
  },
  {
    id: 4,
    handle: '@limerick_bites',
    location: 'Limerick',
    image: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    caption: 'Authentic mango pickles and ginger-garlic pastes arrived safely in Limerick! Highly recommend Asianmix 🌶️',
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
