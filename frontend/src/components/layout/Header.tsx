'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown, 
  MapPin, 
  Truck, 
  ShieldCheck,
  Percent,
  Heart
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { fetchApi, formatEUR } from '@/lib/api';
import LocationModal from './LocationModal';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, openCart, subtotal, amountNeededForFreeShipping } = useCart();
  const { wishlistCount } = useWishlist();

  const [deliveryLocation, setDeliveryLocation] = useState('Dublin (D02)');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active link check
  const isHome = pathname === '/';
  const isProducts = pathname === '/collections' || pathname.startsWith('/collections/') || pathname.startsWith('/products');
  const isAbout = pathname === '/about';
  const isContact = pathname === '/contact';

  // Load persisted delivery location
  useEffect(() => {
    const saved = localStorage.getItem('asianmix_delivery_loc');
    if (saved) setDeliveryLocation(saved);
  }, []);

  const handleSelectLocation = (loc: string) => {
    setDeliveryLocation(loc);
    localStorage.setItem('asianmix_delivery_loc', loc);
  };

  // Live search autocomplete
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetchApi(`/products/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.success) {
          setSuggestions(res.suggestions || []);
        }
      } catch (e) {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus search input when search is opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-white shadow-sm border-b border-stone-200/80">
        {/* Announcement Bar */}
        <div className="bg-[#FFBE26] text-stone-950 text-[11px] sm:text-xs font-bold py-1.5 px-4 shadow-xs border-b border-amber-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-stone-900 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                <Truck className="w-3 h-3 text-amber-400" /> Nationwide Ireland
              </span>
              <span>
                {amountNeededForFreeShipping > 0 ? (
                  <>
                    Free Nationwide Delivery over <strong className="text-stone-900">€50</strong> (Add <strong className="text-emerald-900 underline">{formatEUR(amountNeededForFreeShipping)}</strong> more)
                  </>
                ) : (
                  <span className="font-extrabold text-emerald-950">🎉 Qualified for FREE Ireland delivery!</span>
                )}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-stone-900 text-[11px] font-semibold">
              <button 
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1 hover:text-black transition"
              >
                <MapPin className="w-3 h-3 text-stone-900" /> Deliver to: <span className="underline font-bold">{deliveryLocation}</span>
              </button>
              <span className="text-amber-600">|</span>
              <Link href="/track-order" className="hover:text-black transition">Track Order</Link>
              <Link href="/about" className="hover:text-black transition">About Us</Link>
              <Link href="/contact" className="hover:text-black transition">Cork Depot</Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar (Centered Official Logo layout matching asianmix.ie) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Left: Hamburger (Mobile) + Search Icon */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-stone-700 hover:text-primary hover:bg-stone-100 transition"
                aria-label="Search Asianmix"
                title="Search products"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Center: Official Asianmix Logo */}
            <div className="shrink-0 text-center">
              <Link href="/" className="inline-block group focus:outline-none">
                <img
                  src="/images/logo.png"
                  alt="Asianmix"
                  className="h-14 sm:h-16 md:h-18 w-auto object-contain mx-auto group-hover:opacity-95 transition-opacity"
                />
              </Link>
            </div>

            {/* Right: Account + Cart */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
              {/* Delivery Location pill on tablet/desktop */}
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-left transition text-xs"
                title="Change delivery location"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-teal-dark" />
                <span className="font-semibold text-stone-700 truncate max-w-[100px]">{deliveryLocation}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* User Account */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-2 rounded-full text-stone-700 hover:text-charcoal-dark hover:bg-stone-100 transition flex items-center gap-1"
                      aria-label="User Account"
                    >
                      <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-[10px] text-stone-400">Signed in as</p>
                          <p className="text-xs font-bold text-stone-800 truncate">{user.name}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-brand-teal-dark font-bold hover:bg-stone-50 transition"
                          >
                            <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition"
                        >
                          My Orders & Addresses
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition border-t border-stone-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="p-2 rounded-full text-stone-700 hover:text-charcoal-dark hover:bg-stone-100 transition block"
                    aria-label="Sign In"
                    title="Account Login"
                  >
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </Link>
                )}
              </div>

              {/* Wishlist / Save For Later */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full text-stone-700 hover:text-charcoal-dark hover:bg-stone-100 transition block"
                aria-label="Wishlist"
                title="Saved Items"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand-yellow-base text-brand-yellow-dark text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full text-stone-700 hover:text-charcoal-dark hover:bg-stone-100 transition"
                aria-label="Shopping Bag"
                title="View Basket"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#FFBE26] text-[#2C2C2A] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Search Input Bar */}
          {searchOpen && (
            <div ref={searchRef} className="pb-4 pt-1 max-w-2xl mx-auto relative animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search 450+ authentic groceries, spices, besan, atta, noodles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-11 pr-24 py-2.5 bg-stone-100 border border-stone-300 rounded-full text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold transition shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50 py-2">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-accent-teal uppercase tracking-wider">
                    Suggested Products
                  </div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchOpen(false);
                      }}
                      className="flex items-center justify-between px-4 py-2 hover:bg-stone-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded-lg border border-stone-100"
                          />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-stone-800 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-stone-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">{formatEUR(item.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Centered Navigation Menu Row */}
          <nav className="border-t border-stone-100 py-3 flex items-center justify-center gap-6 sm:gap-10 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                isHome
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              Home
            </Link>

            <Link
              href="/collections"
              className={`transition-colors py-1 ${
                isProducts
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              Products
            </Link>

            <Link
              href="/products"
              className={`transition-colors py-1 ${
                pathname === '/products'
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              Catalog (450+)
            </Link>

            <Link
              href="/about"
              className={`transition-colors py-1 ${
                isAbout
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`transition-colors py-1 ${
                isContact
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              Contact
            </Link>

            <Link
              href="/track-order"
              className={`transition-colors py-1 ${
                pathname === '/track-order'
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-stone-700 hover:text-primary font-medium'
              }`}
            >
              Track Order
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <img src="/images/logo.png" alt="Asianmix" className="h-10 w-auto object-contain" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-sm">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 font-medium ${isHome ? 'text-primary font-bold' : 'text-stone-700 hover:text-primary'}`}
                >
                  Home
                </Link>
                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 font-medium ${isProducts ? 'text-primary font-bold' : 'text-stone-700 hover:text-primary'}`}
                >
                  Products (All Collections)
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 font-medium text-stone-700 hover:text-primary"
                >
                  Shop All 450+ Items
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 font-medium text-stone-700 hover:text-primary"
                >
                  Saved Wishlist
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 font-medium text-stone-700 hover:text-primary"
                >
                  Track Order
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 font-medium ${isAbout ? 'text-primary font-bold' : 'text-stone-700 hover:text-primary'}`}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 font-medium ${isContact ? 'text-primary font-bold' : 'text-stone-700 hover:text-primary'}`}
                >
                  Contact & Cork Depot
                </Link>
              </div>

              <div className="mt-auto pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLocationModalOpen(true);
                  }}
                  className="w-full text-left py-1 text-primary font-bold flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Deliver to: {deliveryLocation}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={deliveryLocation}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
}
