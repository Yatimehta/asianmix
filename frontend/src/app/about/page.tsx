import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, HeartHandshake, MapPin, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-asian-terracotta-600">
            Our Irish Asian Story
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Connecting Ireland with the True Flavors of Asia
          </h1>
          <p className="text-sm text-stone-500 max-w-xl mx-auto">
            Founded in Cork and serving all 32 counties, Asianmix was born from a passion for authentic home cooking and high-quality Asian groceries.
          </p>
        </div>

        {/* Hero image */}
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-stone-200 relative">
          <img
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80"
            alt="Asian spices and pantry"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-8 text-stone-700 leading-relaxed text-sm">
          <div>
            <h2 className="text-xl font-bold text-stone-900 mb-3">Our Mission</h2>
            <p>
              Whether you are craving authentic Sichuan spicy hot pot, traditional Kerala fish curry with Matta rice, comforting Japanese tonkotsu ramen, or Vietnamese pho, finding authentic ingredients in Ireland used to mean trekking to specialized city stores or settling for generic supermarket alternatives.
            </p>
            <p className="mt-3">
              At <strong>Asianmix</strong>, we curate over 500+ genuine products directly imported from Japan, Korea, Thailand, China, India, Vietnam, and the Philippines, and deliver them directly to your door anywhere in Ireland with fast, tracked courier delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-asian-terracotta-50/50 border border-asian-terracotta-100">
              <Award className="w-6 h-6 text-asian-terracotta-600 mb-2" />
              <h4 className="font-bold text-stone-900 text-sm">100% Authentic</h4>
              <p className="text-xs text-stone-500 mt-1">Directly sourced brands trusted by families across Asia.</p>
            </div>

            <div className="p-4 rounded-2xl bg-asian-jade-50/50 border border-asian-jade-100">
              <Truck className="w-6 h-6 text-asian-jade-600 mb-2" />
              <h4 className="font-bold text-stone-900 text-sm">All 32 Counties</h4>
              <p className="text-xs text-stone-500 mt-1">Nationwide courier delivery with free shipping over €50.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <HeartHandshake className="w-6 h-6 text-amber-600 mb-2" />
              <h4 className="font-bold text-stone-900 text-sm">Eco Chilled Packaging</h4>
              <p className="text-xs text-stone-500 mt-1">Thermal ice gel packs keeping produce and dumplings fresh.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 mb-3">Cork Warehouse & Customer Service</h2>
            <p>
              Our primary distribution depot is located at Northpoint Business Park, New Mallow Road, Cork. We pack every box with utmost care and attention. If you ever have a question about ingredients, allergens, or cooking recommendations, our friendly team is always here to assist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
