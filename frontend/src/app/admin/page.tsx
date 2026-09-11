'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  Check, 
  Truck, 
  Edit, 
  Trash2, 
  Save, 
  ArrowUpRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi, formatEUR } from '@/lib/api';
import { Product, Order } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock edit inline state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editStockVal, setEditStockVal] = useState<number>(0);
  const [savingStock, setSavingStock] = useState(false);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pComparePrice, setPComparePrice] = useState('');
  const [pStock, setPStock] = useState('50');
  const [pBrand, setPBrand] = useState('');
  const [pOrigin, setPOrigin] = useState('Japan');
  const [pWeight, setPWeight] = useState('');
  const [pDietary, setPDietary] = useState('Vegan,Vegetarian');
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1588644525273-f37b60d78512?auto=format&fit=crop&w=800&q=80');

  // Search filter inside inventory
  const [inventorySearch, setInventorySearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [anaRes, prodRes, ordRes, catRes] = await Promise.all([
        fetchApi('/admin/analytics'),
        fetchApi('/products?limit=100'),
        fetchApi('/admin/orders?limit=50'),
        fetchApi('/categories'),
      ]);

      if (anaRes.success) setAnalytics(anaRes.analytics);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (ordRes.success) setOrders(ordRes.orders || []);
      if (catRes.success) {
        setCategories(catRes.categories || []);
        if (catRes.categories?.length > 0) {
          setPCategory(catRes.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/account/login');
      return;
    }
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, authLoading, router]);

  const handleUpdateStock = async (productId: string) => {
    setSavingStock(true);
    try {
      const res = await fetchApi(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: editStockVal }),
      });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: editStockVal } : p))
        );
        setEditingStockId(null);
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    } finally {
      setSavingStock(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetchApi(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          trackingNumber: status === 'SHIPPED' ? `IE-ANPOST-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
        }),
      });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this grocery product?')) return;
    try {
      await fetchApi(`/admin/products/${productId}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchApi('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name: pName,
          categoryId: pCategory,
          price: pPrice,
          compareAtPrice: pComparePrice || null,
          stock: pStock,
          brand: pBrand,
          originCountry: pOrigin,
          weight: pWeight,
          dietaryTags: pDietary,
          description: pDesc,
          images: [pImage],
        }),
      });

      if (res.success) {
        setShowProductModal(false);
        loadData();
        setPName('');
        setPPrice('');
        setPDesc('');
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asian-terracotta-500" />
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-asian-jade-600 text-white flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-stone-900">Asianmix Ireland Admin</h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Store operations, Ireland orders, inventory management & sales analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
            >
              View Live Store
            </Link>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-asian-terracotta-50 text-asian-terracotta-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-semibold block">Total Revenue</span>
                <span className="text-xl font-black text-stone-900">
                  {formatEUR(analytics.totalRevenue)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-asian-jade-50 text-asian-jade-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-semibold block">Total Orders</span>
                <span className="text-xl font-black text-stone-900">{analytics.totalOrders}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-semibold block">Products in Catalog</span>
                <span className="text-xl font-black text-stone-900">{analytics.totalProducts}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-semibold block">Low Stock Alerts</span>
                <span className="text-xl font-black text-red-600">{analytics.lowStockCount} items</span>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-sm font-bold transition border-b-2 -mb-[2px] ${
              activeTab === 'analytics'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-sm font-bold transition border-b-2 -mb-[2px] ${
              activeTab === 'inventory'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Inventory & Stock Manager ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition border-b-2 -mb-[2px] ${
              activeTab === 'orders'
                ? 'border-asian-terracotta-500 text-asian-terracotta-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Manage Irish Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Overview / Recent */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low stock table */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Products Needing Reorder
              </h3>

              <div className="divide-y divide-stone-100">
                {analytics?.lowStockProducts?.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">{item.name}</p>
                      <p className="text-[11px] text-stone-400">SKU: {item.sku} • {formatEUR(item.price)}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-asian-jade-600" />
                Latest Ireland Shipments
              </h3>

              <div className="divide-y divide-stone-100">
                {analytics?.recentOrders?.map((ord: any) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">{ord.orderNumber}</p>
                      <p className="text-[11px] text-stone-400">
                        {ord.guestName || ord.user?.name} • Co. {ord.shippingAddress?.county || 'Dublin'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-asian-terracotta-600 block">
                        {formatEUR(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-stone-500">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory & Stock */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search products by title, SKU, brand..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              <span className="text-xs text-stone-400 font-semibold">
                Showing {filteredProducts.length} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Origin & Brand</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0]}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${prod.slug}`}
                              className="font-bold text-stone-900 hover:text-asian-terracotta-600 line-clamp-1"
                            >
                              {prod.name}
                            </Link>
                            <span className="text-[10px] text-stone-400 font-mono">SKU: {prod.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800 block">{prod.brand}</span>
                        <span className="text-[10px] text-stone-400">{prod.originCountry}</span>
                      </td>

                      <td className="py-3 px-4 font-bold text-stone-900">
                        {formatEUR(prod.price)}
                      </td>

                      <td className="py-3 px-4">
                        {editingStockId === prod.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={editStockVal}
                              onChange={(e) => setEditStockVal(parseInt(e.target.value, 10) || 0)}
                              className="w-16 p-1 border border-asian-terracotta-400 rounded text-xs font-bold"
                            />
                            <button
                              onClick={() => handleUpdateStock(prod.id)}
                              disabled={savingStock}
                              className="p-1 bg-asian-jade-600 text-white rounded hover:bg-asian-jade-700"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 bg-stone-200 text-stone-600 rounded hover:bg-stone-300"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                prod.stock <= 15 ? 'text-red-600' : 'text-stone-800'
                              }`}
                            >
                              {prod.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingStockId(prod.id);
                                setEditStockVal(prod.stock);
                              }}
                              className="text-stone-400 hover:text-asian-terracotta-600"
                              title="Edit Stock"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-stone-300 hover:text-red-500 transition p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">Manage Customer Orders</h3>
            <div className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <div key={ord.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{ord.orderNumber}</span>
                        <span className="text-xs text-stone-400">
                          by {ord.guestName || (ord as any).user?.name || 'Customer'} (
                          {(ord as any).shippingAddress?.city}, Co. {(ord as any).shippingAddress?.county})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleString('en-IE')} • {ord.shippingMethod || 'Standard Ireland Delivery'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-asian-terracotta-600">
                        {formatEUR(ord.totalAmount)}
                      </span>

                      {/* Status Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-xs font-bold p-1.5 rounded-lg border border-stone-200 bg-stone-50"
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Order item thumbnails */}
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {ord.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 rounded-lg text-[11px] border border-stone-200 shrink-0"
                      >
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-5 h-5 object-cover rounded"
                          />
                        )}
                        <span className="font-medium text-stone-700 max-w-[120px] truncate">
                          {item.productName}
                        </span>
                        <span className="text-stone-400 font-bold">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {ord.trackingNumber && (
                    <p className="text-[11px] text-asian-jade-700 font-semibold">
                      📦 Tracking Number: {ord.trackingNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Add New Asian Grocery Item</h3>
              <form onSubmit={handleCreateProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Momofuku Chili Crunch Hot Sauce"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Lao Gan Ma, Lee Kum Kee"
                      value={pBrand}
                      onChange={(e) => setPBrand(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Price (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="4.99"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Compare (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="5.99"
                      value={pComparePrice}
                      onChange={(e) => setPComparePrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Origin Country</label>
                    <input
                      type="text"
                      placeholder="Japan, Korea, China, India"
                      value={pOrigin}
                      onChange={(e) => setPOrigin(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Net Weight</label>
                    <input
                      type="text"
                      placeholder="500g, 1L, 200g"
                      value={pWeight}
                      onChange={(e) => setPWeight(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dietary Tags</label>
                  <input
                    type="text"
                    placeholder="Vegan,Halal,Gluten-Free"
                    value={pDietary}
                    onChange={(e) => setPDietary(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe authentic flavor profile, culinary uses, or serving instructions..."
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-asian-terracotta-500 rounded-xl"
                  >
                    Publish Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
