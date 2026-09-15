'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/image';
import { Category } from '@/types';

// Authentic default collections with verified Shopify CDN images
const FALLBACK_COLLECTIONS = [
  {
    handle: 'biriyani-essential',
    title: 'BASMATI /BIRIYANI/JEERAKASALA/MANTHI RICE& ESSENTIAL',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Indiangatebasmati.jpg?v=1700756384',
    caption: 'RICE & INGREDIENT THATS ENHANCE THE FLAVOUR',
  },
  {
    handle: 'beans',
    title: 'Beans, Peas, Lentils and Grams',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/collections/Peas_lentils_beans.jpg?v=1704227200',
    caption: '',
  },
  {
    handle: 'classic-collection-and-over-the-counter',
    title: 'CLASSIC COLLECTION AND OVER THE COUNTER',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Bournvita.jpg?v=1701538806',
    caption: '',
  },
  {
    handle: 'drinks',
    title: 'Drinks',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/download.jpg?v=1718267006',
    caption: '',
  },
  {
    handle: 'fresh-and-frozen-vegetables',
    title: 'Fresh vegetables',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    caption: '',
  },
  {
    handle: 'ghee-oil-and-payasam-product',
    title: 'GHEE ,OIL AND DESSERT PRODUCT',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6848.jpg?v=1626133901',
    caption: '',
  },
  {
    handle: 'maggi-products',
    title: 'Maggi Products',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6983.jpg?v=1626047863',
    caption: '',
  },
  {
    handle: 'nuts-and-dates',
    title: 'Nuts and Dates',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/5db73d34-bdde-447e-b868-d8e7ec1383d6.webp?v=1717845939',
    caption: '',
  },
  {
    handle: 'personal-care-products',
    title: 'Personal care products',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6849.jpg?v=1626133903',
    caption: '',
  },
  {
    handle: 'phillipino-product-snacks',
    title: 'PHILLIPINO PRODUCT& SNACKS',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/WhatsApp_Image_2021-08-30_at_3.36.34_PM_1.jpg?v=1630356343',
    caption: 'snacks, drink, seasoning ,rice, noodles and sauce',
  },
  {
    handle: 'pickles-and-paste',
    title: 'PICKLES , PASTE AND BOTTLE FOOD',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    caption: '',
  },
  {
    handle: 'rice-and-grains',
    title: 'RICE AND ATTA(Wheat Flour)',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    caption: 'MATTA RICE, BASMATI RICE, JEERAKASALA RICE, RAW RICE, IDLI RICE, WHEAT FLOUR',
  },
  {
    handle: 'all-flour-1',
    title: 'RICE POWDERS, RAVA & AND ALL FLOUR',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6967.jpg?v=1626047841',
    caption: 'RICE, WHEAT, SEMOLINA (RAVA) AND FLOURS',
  },
  {
    handle: 'rusk-biscuts-swet-and-dates',
    title: 'RUSK,BISCUTS,SWEET AND CAKE',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SoanPapdi.jpg?v=1700593680',
    caption: '',
  },
  {
    handle: 'snacks-kerala-and-north-indian',
    title: 'SNACKS (KERALA AND NORTH INDIAN)',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    caption: 'PRE PACKED DELICIOUS SNACKS INCLUDING CHIPS, MIXTURES, MURUKKU AND MORE',
  },
  {
    handle: 'spices-whole-spice-powder-and-masalas',
    title: 'WHOLE SPICES,SPICE POWDER AND MASALAS',
    img: 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6802.jpg?v=1626047789',
    caption: 'WHOLE SPICES, CHILLI POWDER, CORIANDER POWDER, TURMERIC POWDER AND COOKING MASALAS',
  },
];

export default function CollectionsPage() {
  const [categories, setCategories] = useState<any[]>(FALLBACK_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchApi('/categories');
        if (res.success && res.categories && res.categories.length > 0) {
          // Merge API data with fallback images for complete fidelity
          const merged = res.categories.map((c: Category) => {
            const fallback = FALLBACK_COLLECTIONS.find((f) => f.handle === c.slug);
            const rawImg = c.image || fallback?.img || '';
            return {
              handle: c.slug,
              title: c.name,
              img: normalizeImageUrl(rawImg),
              caption: c.description || fallback?.caption || '',
            };
          });
          setCategories(merged);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title in neutral charcoal with teal subtitle */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/90 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-brand-teal-dark">
              Explore 16 Authentic Aisles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2C2C2A] mt-1">
              All Collections
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Browse 450+ authentic Asian groceries imported directly to Cork for Irish kitchens
          </p>
        </div>

        {/* 5-Column Responsive Grid matching Shopify layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((col) => (
            <Link
              key={col.handle}
              href={`/products?category=${col.handle}`}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-stone-400/80 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Top Image Container: Neutral warm backdrop with object-contain image */}
              <div className="aspect-square w-full p-4 flex items-center justify-center bg-gradient-to-b from-[#FAF9F7] to-[#F2F0EC] overflow-hidden relative">
                {col.img ? (
                  <img
                    src={normalizeImageUrl(col.img)}
                    alt={col.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 font-bold text-xs uppercase">
                    Asianmix
                  </div>
                )}
              </div>

              {/* Bottom Card Title Banner: Neutral Charcoal (#2C2C2A) with white title and amber arrow */}
              <div className="bg-[#2C2C2A] p-4 flex-1 flex flex-col justify-between min-h-[96px] sm:min-h-[105px]">
                <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-tight leading-snug line-clamp-3 group-hover:text-brand-yellow-base transition-colors">
                  {col.title}{' '}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-brand-yellow-base">
                    →
                  </span>
                </h3>

                {col.caption && (
                  <p className="text-stone-300 text-[10px] mt-1 line-clamp-1 font-medium">
                    {col.caption}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
