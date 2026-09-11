'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { fetchApi } from '@/lib/api';
import { Product, Category } from '@/types';

const CATEGORIES_LIST = [
  { slug: 'all', name: 'All Aisles' },
  { slug: 'snacks-kerala-and-north-indian', name: 'Snacks (Kerala & North Indian)' },
  { slug: 'spices-whole-spice-powder-and-masalas', name: 'Whole Spices & Masalas' },
  { slug: 'fresh-and-frozen-vegetables', name: 'Fresh Vegetables' },
  { slug: 'pickles-and-paste', name: 'Pickles, Paste & Bottle Food' },
  { slug: 'all-flour-1', name: 'Rice Powders, Rava & All Flour' },
  { slug: 'drinks', name: 'Drinks & Beverages' },
  { slug: 'rusk-biscuts-swet-and-dates', name: 'Rusk, Biscuits, Sweet & Cake' },
  { slug: 'phillipino-product-snacks', name: 'Filipino Products & Snacks' },
  { slug: 'classic-collection-and-over-the-counter', name: 'Classic Collection & OTC' },
  { slug: 'rice-and-grains', name: 'Rice & Atta (Wheat Flour)' },
  { slug: 'beans', name: 'Beans, Peas, Lentils & Grams' },
  { slug: 'ghee-oil-and-payasam-product', name: 'Ghee, Oil & Dessert Products' },
  { slug: 'biriyani-essential', name: 'Biriyani & Basmati Essentials' },
  { slug: 'personal-care-products', name: 'Personal Care Products' },
  { slug: 'maggi-products', name: 'Maggi Products' },
  { slug: 'nuts-and-dates', name: 'Nuts and Dates' },
];

const DIETARY_OPTIONS = ['Vegan', 'Halal', 'Gluten-Free', 'Vegetarian'];

const ORIGIN_OPTIONS = [
  'Japan',
  'Korea',
  'Thailand',
  'China',
  'India',
  'Vietnam',
  'Taiwan',
  'Philippines',
];

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') === 'true';
  const initialBestSeller = searchParams.get('bestSeller') === 'true';
  const initialDietary = searchParams.get('dietary') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDietary, setSelectedDietary] = useState<string[]>(
    initialDietary ? initialDietary.split(',') : []
  );
  const [selectedOrigin, setSelectedOrigin] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('bestselling');
  const [search, setSearch] = useState(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>(CATEGORIES_LIST);

  // Sync params when URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearch(searchParams.get('search') || '');
    if (searchParams.get('dietary')) {
      setSelectedDietary(searchParams.get('dietary')!.split(','));
    }
  }, [searchParams]);

  // Load live categories with images from API
  useEffect(() => {
    fetchApi('/categories')
      .then((res) => {
        if (res.success && res.categories && res.categories.length > 0) {
          setCategoriesList([
            { slug: 'all', name: 'All Aisles' },
            ...res.categories.map((c: any) => ({
              slug: c.slug,
              name: c.name,
              image: c.image,
              description: c.description,
            })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load products based on filters
  const loadProducts = async (pageToLoad: number = 1, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const query = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        query.append('category', selectedCategory);
      }
      if (search) {
        query.append('search', search);
      }
      if (selectedDietary.length > 0) {
        query.append('dietary', selectedDietary.join(','));
      }
      if (selectedOrigin && selectedOrigin !== 'all') {
        query.append('origin', selectedOrigin);
      }
      if (inStockOnly) {
        query.append('inStock', 'true');
      }
      if (minPrice) {
        query.append('minPrice', minPrice);
      }
      if (maxPrice) {
        query.append('maxPrice', maxPrice);
      }
      if (initialFeatured) {
        query.append('featured', 'true');
      }
      if (initialBestSeller) {
        query.append('bestSeller', 'true');
      }
      if (sortBy) {
        query.append('sort', sortBy);
      }
      query.append('page', pageToLoad.toString());
      query.append('limit', '24');

      const res = await fetchApi(`/products?${query.toString()}`);
      if (res.success) {
        if (append) {
          setProducts((prev) => [...prev, ...(res.products || [])]);
        } else {
          setProducts(res.products || []);
        }
        setTotalCount(res.pagination?.total ?? res.total ?? (res.products?.length || 0));
        setCurrentPage(pageToLoad);
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1, false);
  }, [
    selectedCategory,
    selectedDietary,
    selectedOrigin,
    inStockOnly,
    minPrice,
    maxPrice,
    sortBy,
    search,
    initialFeatured,
    initialBestSeller,
  ]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    loadProducts(nextPage, true);
  };

  const handlePageChange = (newPage: number) => {
    loadProducts(newPage, false);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleDietaryToggle = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedDietary([]);
    setSelectedOrigin('all');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setSortBy('bestselling');
    router.push('/products');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedDietary.length +
    (selectedOrigin !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold">Asian Grocery Catalog</span>
          </div>

          {/* Category Banner or Page Header */}
          {selectedCategory !== 'all' && categoriesList.find((c) => c.slug === selectedCategory) ? (
            (() => {
              const activeCat = categoriesList.find((c) => c.slug === selectedCategory);
              return (
                <div className="mb-6 bg-gradient-to-r from-primary via-[#6B3E19] to-secondary rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="max-w-xl z-10">
                    <span className="inline-block bg-white/20 text-accent-orange-border text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      Asianmix Aisle
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      {activeCat.name}
                    </h1>
                    {activeCat.description && (
                      <p className="text-white/85 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                        {activeCat.description}
                      </p>
                    )}
                    <p className="text-white/70 text-xs mt-3 font-semibold">
                      Showing {products.length} of {totalCount} authentic imported products
                    </p>
                  </div>
                  {activeCat.image && (
                    <div className="w-32 h-32 sm:w-44 sm:h-44 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                      <img
                        src={activeCat.image}
                        alt={activeCat.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-primary">
                  {search ? `Search: "${search}"` : 'All Asian Groceries & Ingredients'}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Showing {products.length} of {totalCount} authentic imported items
                </p>
              </div>

              {/* Sorting & Filter Trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700 shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                </button>

                <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-sm">
                  <span className="text-stone-400 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
                  >
                    <option value="bestselling">Best Selling</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shadow-sm ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-primary/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1 pb-2">
              <span className="text-[11px] font-bold text-stone-400">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary-light text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  Aisle: {categoriesList.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-black"><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-accent-green-light text-accent-green px-2.5 py-1 rounded-full border border-accent-green-border/50">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-black"><X className="w-3 h-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-accent-orange-light text-accent-orange px-2.5 py-1 rounded-full border border-accent-orange-border/50">
                  Price: €{minPrice || '0'} - €{maxPrice || 'Any'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-black"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedOrigin !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-accent-teal-light text-accent-teal px-2.5 py-1 rounded-full border border-accent-teal-border/50">
                  Origin: {selectedOrigin}
                  <button onClick={() => setSelectedOrigin('all')} className="hover:text-black"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedDietary.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200">
                  {d}
                  <button onClick={() => handleDietaryToggle(d)} className="hover:text-black"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-primary hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Catalog Main Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm h-fit sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filter Products
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Price Range (€)
              </h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-2 text-xs text-stone-400">€</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs pl-6 pr-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                  />
                </div>
                <span className="text-xs text-stone-400 font-bold">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-2 text-xs text-stone-400">€</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs pl-6 pr-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-green" /> In Stock Only
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-accent-green focus:ring-accent-green w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Country of Origin Filter */}
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Country of Origin
              </h4>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-medium"
              >
                <option value="all">All Origins</option>
                {ORIGIN_OPTIONS.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Tags Filter */}
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Dietary Preferences
              </h4>
              <div className="space-y-2">
                {DIETARY_OPTIONS.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDietary.includes(tag)}
                      onChange={() => handleDietaryToggle(tag)}
                      className="rounded border-stone-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ireland Delivery Promo */}
            <div className="p-4 rounded-xl bg-accent-teal-light border border-accent-teal-border/40 text-stone-800 text-xs shadow-sm">
              <p className="font-bold mb-1 flex items-center gap-1.5 text-accent-teal">
                🚚 Nationwide Ireland Delivery
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Free standard delivery on all orders over <strong>€50</strong> across all 32 counties from our Cork central depot.
              </p>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-stone-100 rounded-2xl h-80" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">No products match your criteria</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try clearing some filters or searching for alternative ingredients like &quot;rice&quot;, &quot;atta&quot;, &quot;besan&quot;, or &quot;noodles&quot;.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold shadow transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {/* Pagination & Load More Controls */}
                {totalCount > 24 && (
                  <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col items-center gap-6">
                    {/* Progress Indicator */}
                    <div className="text-center w-full max-w-xs">
                      <p className="text-xs text-stone-500 font-semibold mb-2">
                        Showing {products.length} of {totalCount} authentic imported items
                      </p>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.round((products.length / totalCount) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Load More Button */}
                    {products.length < totalCount && (
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
                      >
                        {loadingMore ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Loading more products...
                          </>
                        ) : (
                          <>Load More Products (+24)</>
                        )}
                      </button>
                    )}

                    {/* Numbered Page Links */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs pt-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1 || loading}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 font-bold transition"
                      >
                        Prev
                      </button>

                      {Array.from({ length: Math.ceil(totalCount / 24) }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === Math.ceil(totalCount / 24) ||
                            Math.abs(p - currentPage) <= 2
                        )
                        .map((p, idx, arr) => (
                          <React.Fragment key={p}>
                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                              <span className="text-stone-400 px-1">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(p)}
                              className={`w-8 h-8 rounded-lg font-bold transition flex items-center justify-center ${
                                currentPage === p
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'text-stone-700 hover:bg-stone-100 border border-stone-200'
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))}

                      <button
                        onClick={() =>
                          handlePageChange(Math.min(Math.ceil(totalCount / 24), currentPage + 1))
                        }
                        disabled={currentPage >= Math.ceil(totalCount / 24) || loading}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 font-bold transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-bold text-stone-900 text-sm">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Price Range Mobile */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Price (€)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>
            </div>

            {/* In Stock Only Mobile */}
            <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-green" /> In Stock Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-accent-green focus:ring-accent-green w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Aisle</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categoriesList.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedCategory === c.slug
                        ? 'bg-primary text-white font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Dietary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Dietary</h4>
              <div className="space-y-2">
                {DIETARY_OPTIONS.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={selectedDietary.includes(tag)}
                      onChange={() => handleDietaryToggle(tag)}
                      className="rounded border-stone-300 text-primary focus:ring-primary"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asian-terracotta-500" />
        </div>
      }
    >
      <ProductCatalogContent />
    </Suspense>
  );
}
