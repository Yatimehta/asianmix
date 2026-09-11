'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  MapPin, 
  Heart, 
  User, 
  LogOut, 
  ExternalLink, 
  Truck, 
  ShieldCheck,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { fetchApi, formatEUR } from '@/lib/api';
import { Order, Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { wishlistIds } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrCounty, setAddrCounty] = useState('Dublin');
  const [addrEircode, setAddrEircode] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/account/login');
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        const [ordersRes, addrsRes] = await Promise.all([
          fetchApi('/orders'),
          fetchApi('/addresses'),
        ]);

        if (ordersRes.success) setOrders(ordersRes.orders || []);
        if (addrsRes.success) setAddresses(addrsRes.addresses || []);

        if (wishlistIds.length > 0) {
          const prodsRes = await fetchApi('/products?limit=50');
          if (prodsRes.success) {
            const matched = (prodsRes.products || []).filter((p: Product) =>
              wishlistIds.includes(p.id)
            );
            setWishlistProducts(matched);
          }
        }
      } catch (err) {
        console.error('Error fetching account data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, wishlistIds, router]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/addresses', {
        method: 'POST',
        body: JSON.stringify({
          fullName: addrName,
          addressLine1: addrLine1,
          addressLine2: addrLine2,
          city: addrCity,
          county: addrCounty,
          eircode: addrEircode,
          phone: addrPhone,
          country: 'Ireland',
        }),
      });

      if (res.success && res.address) {
        setAddresses((prev) => [...prev, res.address]);
        setShowAddressModal(false);
        setAddrName('');
        setAddrLine1('');
        setAddrLine2('');
        setAddrCity('');
        setAddrEircode('');
        setAddrPhone('');
      }
    } catch (err) {
      console.error('Error adding address:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetchApi(`/addresses/${id}`, { method: 'DELETE' });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Greeting & Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-asian-terracotta-500 to-asian-terracotta-700 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">{user.name}</h1>
                {isAdmin && (
                  <span className="bg-asian-jade-100 text-asian-jade-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-asian-jade-600 hover:bg-asian-jade-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 border border-stone-200 hover:bg-red-50 hover:text-red-600 text-stone-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-stone-200 mb-8 gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 -mb-[2px] whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistIds.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">No orders yet</h3>
                <p className="text-xs text-stone-500 mt-1 mb-6">
                  Ready to cook authentic Asian dishes? Explore our store today.
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white rounded-full text-xs font-bold transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                let parsedAddr: any = {};
                try {
                  parsedAddr = JSON.parse(order.shippingAddress);
                } catch {
                  parsedAddr = {};
                }

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-stone-900">
                            Order {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              order.status === 'DELIVERED'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Total Amount</span>
                        <span className="text-lg font-black text-asian-terracotta-600">
                          {formatEUR(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                        >
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-stone-800 line-clamp-1">{item.productName}</p>
                            <p className="text-[11px] text-stone-400">
                              Qty: {item.quantity} • {formatEUR(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2 border-t border-stone-100">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-asian-terracotta-500" />
                        <span>
                          Delivering to: {parsedAddr.addressLine1}, {parsedAddr.city}, Co. {parsedAddr.county} ({parsedAddr.eircode})
                        </span>
                      </span>

                      {order.trackingNumber && (
                        <span className="font-bold text-asian-jade-700">
                          Tracking: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900">Saved Irish Delivery Addresses</h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-stone-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-asian-jade-50 text-asian-jade-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                      <br />
                      {addr.city}, Co. {addr.county}
                      <br />
                      Eircode: <strong className="font-mono">{addr.eircode}</strong>
                      <br />
                      {addr.phone && `Phone: ${addr.phone}`}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200">
                  <h3 className="text-base font-bold text-stone-900 mb-4">Add Delivery Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        required
                        value={addrLine1}
                        onChange={(e) => setAddrLine1(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 2</label>
                      <input
                        type="text"
                        value={addrLine2}
                        onChange={(e) => setAddrLine2(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">County</label>
                        <input
                          type="text"
                          required
                          value={addrCounty}
                          onChange={(e) => setAddrCounty(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Eircode</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. D04 V3P2"
                          value={addrEircode}
                          onChange={(e) => setAddrEircode(e.target.value.toUpperCase())}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="flex-1 py-2.5 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 text-xs font-bold text-white bg-asian-terracotta-500 rounded-xl"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">No saved items</h3>
                <p className="text-xs text-stone-500 mt-1 mb-6">
                  Save your favorite Asian groceries by clicking the heart icon on any product.
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2.5 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white rounded-full text-xs font-bold transition"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
