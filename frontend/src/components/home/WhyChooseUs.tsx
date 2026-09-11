import React from 'react';
import { Truck, ShieldCheck, Tag, RotateCcw, Headphones, CheckCircle2 } from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: Truck,
    title: 'Fast Nationwide Delivery',
    description: 'Dispatch to all 32 counties. Free delivery on orders over €50.',
    color: 'text-asian-terracotta-600 bg-asian-terracotta-50 border-asian-terracotta-200/60',
  },
  {
    icon: ShieldCheck,
    title: 'Authentic & Quality Products',
    description: 'Directly imported from Japan, Korea, Thailand, China & India.',
    color: 'text-asian-jade-600 bg-asian-jade-50 border-asian-jade-200/60',
  },
  {
    icon: Tag,
    title: 'Best Prices Guaranteed',
    description: 'Fair Irish shelf prices and multi-buy bundle discounts.',
    color: 'text-amber-600 bg-amber-50 border-amber-200/60',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns & Refunds',
    description: 'Damaged or compromised item guarantee with fast instant refund.',
    color: 'text-blue-600 bg-blue-50 border-blue-200/60',
  },
  {
    icon: Headphones,
    title: 'Dedicated Irish Support',
    description: 'Local friendly team in Cork & Dublin ready to assist 7 days a week.',
    color: 'text-purple-600 bg-purple-50 border-purple-200/60',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-asian-terracotta-600">
            Our Ireland Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Why Choose Asianmix?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Ireland&apos;s most trusted Asian supermarket committed to quality, freshness, and authentic pantry favorites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start space-y-3 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${badge.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-900 group-hover:text-asian-terracotta-600 transition">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
