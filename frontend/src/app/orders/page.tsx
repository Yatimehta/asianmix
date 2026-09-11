'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, ArrowRight, Clock, MapPin, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi, formatEUR } from '@/lib/api';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  deliveryMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
  shippingAddress: any;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchApi('/orders/my-orders');
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadOrders();
    }
  }, [token, authLoading]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">Order History</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-stone-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span>Purchase History</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              View your past grocery orders, delivery status, and tracking receipts.
            </p>
          </div>

          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm border border-stone-200 hover:border-primary/40 transition"
          >
            <Truck className="w-4 h-4 text-accent-teal" />
            <span>Track Guest / Any Order &rarr;</span>
          </Link>
        </div>

        {/* Auth check */}
        {authLoading || loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-stone-200/80 p-6 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : !user ? (
          /* Not Signed In State */
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-10 sm:p-14 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-5 text-primary">
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-2">Sign In to View Orders</h2>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              If you have an Asianmix Ireland customer account, log in to view your complete order history, download invoices, and reorder pantry essentials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link
                href="/login?redirect=/orders"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-2xl text-xs font-bold shadow-md transition"
              >
                Sign In to Account
              </Link>
              <Link
                href="/track-order"
                className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 px-6 py-3 rounded-2xl text-xs font-bold transition"
              >
                Track with Order ID
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          /* Empty orders */
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-amber-50 text-accent-orange rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No orders placed yet</h3>
            <p className="text-sm text-stone-600 mb-6">
              You haven't made any purchases yet. Browse our selection of 450+ authentic Asian groceries and get nationwide delivery across Ireland!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-stone-50 p-4 sm:p-6 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Order #
                      </span>
                      <p className="text-sm font-black text-stone-900">{order.orderNumber}</p>
                    </div>
                    <div className="h-6 w-px bg-stone-200" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Date Placed
                      </span>
                      <p className="text-xs font-semibold text-stone-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="h-6 w-px bg-stone-200" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Total Amount
                      </span>
                      <p className="text-xs font-black text-primary">
                        {formatEUR(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        order.status === 'DELIVERED'
                          ? 'bg-accent-green-light text-accent-green border-accent-green-border/50'
                          : order.status === 'SHIPPED'
                          ? 'bg-accent-teal-light text-accent-teal border-accent-teal-border/50'
                          : 'bg-amber-50 text-accent-orange border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      href={`/track-order?order=${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-6 divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-xl object-contain bg-stone-100 p-1 border border-stone-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-stone-900">{item.productName}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: {item.quantity} &times; {formatEUR(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-stone-800">
                        {formatEUR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
