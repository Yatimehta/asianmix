'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  Heart, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Check, 
  Snowflake,
  MapPin,
  ChevronRight,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { fetchApi, formatEUR } from '@/lib/api';
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE } from '@/lib/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'reviews'>('desc');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`/products/${slug}`);
        if (res.success && res.product) {
          setProduct(res.product);
          if (res.product.images && res.product.images.length > 0) {
            setSelectedImage(normalizeImageUrl(res.product.images[0]));
          }
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFBE26]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Product Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The grocery item you are looking for may be temporarily out of stock.</p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-xs rounded-full shadow transition"
        >
          Return to Supermarket
        </Link>
      </div>
    );
  }

  const dietaryList = product.dietaryTags
    ? product.dietaryTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const handleAddToCart = async () => {
    if (adding || product.stock <= 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/account/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.success) {
        setReviewSuccess(true);
        setReviewTitle('');
        setReviewComment('');
        // Refresh product to show updated review
        const updated = await fetchApi(`/products/${slug}`);
        if (updated.success && updated.product) {
          setProduct(updated.product);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const isFavorited = isInWishlist(product.id);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Asianmix Cork',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Asianmix Ireland',
      },
    },
  } : null;

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link href="/products" className="hover:text-primary transition">Groceries</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="text-stone-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero (Images + Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-b from-[#FBF8F4] to-[#F3EDE2] border border-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5C3415_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
              {selectedImage ? (
                <img
                  src={normalizeImageUrl(selectedImage)}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold">
                  Asianmix
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(normalizeImageUrl(img))}
                    className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImage === normalizeImageUrl(img)
                        ? 'border-primary shadow'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={normalizeImageUrl(img)}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-16 h-16 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Purchase Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div>
              {/* Brand & Origin */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-accent-teal-light text-accent-teal border border-accent-teal-border/40 text-xs font-bold tracking-wide uppercase">
                  {product.brand}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                  🌏 Origin: {product.originCountry}
                </span>
                {product.isBestSeller && (
                  <span className="px-2.5 py-0.5 rounded-full bg-accent-orange-light text-accent-orange border border-accent-orange-border/40 text-xs font-bold">
                    🔥 Best Seller
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Reviews & SKU */}
              <div className="flex items-center gap-4 mt-2 text-xs text-stone-500 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex text-accent-orange">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-stone-800">{product.avgRating || 4.9}</span>
                  <span className="text-stone-400">({product.reviewCount || 0} reviews)</span>
                </div>
                <span>•</span>
                <span>SKU: {product.sku || product.id.slice(0, 8)}</span>
                {product.weight && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-stone-700">Net Weight: {product.weight}</span>
                  </>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-baseline justify-between flex-wrap gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">
                  {formatEUR(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatEUR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="text-right">
                {product.stock > 5 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-green bg-accent-green-light px-2.5 py-1 rounded-full border border-accent-green-border/50">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                  </span>
                ) : product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-orange bg-accent-orange-light px-2.5 py-1 rounded-full border border-accent-orange-border/50">
                    🔥 Only {product.stock} left in stock — order soon!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-accent-red bg-accent-red-light px-2.5 py-1 rounded-full border border-accent-red-border/50">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Dietary Badges */}
            {dietaryList.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase text-stone-400 tracking-wider block mb-1.5">
                  Dietary Information
                </span>
                <div className="flex flex-wrap gap-2">
                  {dietaryList.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-accent-teal-light text-accent-teal text-xs font-semibold border border-accent-teal-border/40"
                    >
                      🌱 {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-stone-600 hover:text-stone-900 transition disabled:opacity-40"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-3 text-stone-600 hover:text-stone-900 transition disabled:opacity-40"
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stock <= 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-accent-green'
                      : product.stock <= 0
                      ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                      : 'bg-primary hover:bg-primary-hover active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{adding ? 'Adding...' : `Add to Basket • ${formatEUR(product.price * quantity)}`}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition shadow-sm ${
                    isFavorited
                      ? 'border-red-200 bg-red-50 text-accent-red'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-red-300 hover:text-accent-red'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Ireland Shipping Perks */}
            <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#FFBE26] shrink-0" />
                <span>
                  <strong>Ireland Nationwide Delivery:</strong> Next-day dispatch. Free delivery on orders over €50.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Snowflake className="w-4 h-4 text-brand-green-base shrink-0" />
                <span>
                  <strong>Cold-Pack Packaging:</strong> Perishables packed with insulated thermal liner & ice packs.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-teal-base shrink-0" />
                <span>
                  <strong>100% Authentic Guarantee:</strong> Imported directly from verified Asian manufacturers.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Ingredients, Reviews */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex border-b border-stone-200 gap-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-sm font-bold transition border-b-2 -mb-[2px] ${
                activeTab === 'desc'
                  ? 'border-[#FFBE26] text-[#2C2C2A]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 text-sm font-bold transition border-b-2 -mb-[2px] ${
                activeTab === 'ingredients'
                  ? 'border-[#FFBE26] text-[#2C2C2A]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Ingredients & Allergens
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold transition border-b-2 -mb-[2px] ${
                activeTab === 'reviews'
                  ? 'border-[#FFBE26] text-[#2C2C2A]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'desc' && (
              <div className="prose prose-stone max-w-none text-sm leading-relaxed text-stone-700">
                <p>{product.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      Brand / Manufacturer
                    </span>
                    <span className="text-sm font-bold text-stone-800">{product.brand}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      Country of Origin
                    </span>
                    <span className="text-sm font-bold text-stone-800">{product.originCountry}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="text-sm text-stone-700 leading-relaxed">
                <h4 className="font-bold text-stone-900 mb-2">Ingredients List</h4>
                <p className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {product.ingredients || 'Natural traditional ingredients. Please inspect package upon receipt.'}
                </p>
                <p className="text-xs text-stone-500 mt-4">
                  ⚠️ <strong>Allergen Notice:</strong> Manufactured in facilities that also handle soy, sesame, peanuts, wheat, seafood, and egg.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-800">{rev.user?.name || 'Customer'}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="text-[10px] bg-brand-green-light text-brand-green-dark border border-brand-green-border px-2 py-0.5 rounded-full font-bold">
                                Verified Irish Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex text-brand-yellow-base">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.title && <h5 className="font-bold text-xs text-stone-900 mb-1">{rev.title}</h5>}
                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500">No reviews yet for this product. Be the first to review!</p>
                  )}
                </div>

                {/* Write a Review Section */}
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                    <MessageSquarePlus className="w-4 h-4 text-[#FFBE26]" />
                    Write a Review
                  </h4>

                  {user ? (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-brand-yellow-base hover:scale-110 transition p-1"
                            >
                              <Star
                                className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Review title (e.g., Authentic flavor, fast shipping to Dublin)"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>

                      <div>
                        <textarea
                          rows={3}
                          required
                          placeholder="Write your experience with this Asian grocery product..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                        />
                      </div>

                      {reviewSuccess && (
                        <p className="text-xs text-green-600 font-bold">
                          🎉 Thank you! Your review has been submitted.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-5 py-2.5 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-xs rounded-xl flex items-center gap-2 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-xs text-stone-500">
                      Please{' '}
                      <Link href="/account/login" className="text-[#2C2C2A] font-bold underline">
                        sign in
                      </Link>{' '}
                      to leave a verified product review.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
