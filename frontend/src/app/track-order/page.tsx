'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { fetchApi, formatEUR } from '@/lib/api';

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  guestEmail: string;
  guestName: string;
  guestPhone: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: {
    fullName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    county?: string;
    eircode?: string;
    phone?: string;
  };
  deliveryMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('order') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (queryToUse?: string) => {
    const q = (queryToUse || orderQuery).trim();
    if (!q) {
      setError('Please enter your order number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(`/orders/${encodeURIComponent(q)}`);
      if (res.order) {
        setOrder(res.order);
      } else {
        setError('Order not found. Please verify your order number.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to locate order. Please check the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const steps = [
    { label: 'Order Confirmed', desc: 'Received & verified', key: 'CONFIRMED' },
    { label: 'Packed in Cork', desc: 'Depot quality check', key: 'PROCESSING' },
    { label: 'In Transit', desc: 'With An Post Express', key: 'SHIPPED' },
    { label: 'Delivered', desc: 'Delivered to doorstep', key: 'DELIVERED' },
  ];

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statusMap: Record<string, number> = {
      PENDING: 0,
      PROCESSING: 1,
      SHIPPED: 2,
      DELIVERED: 3,
    };
    const currentIndex = statusMap[currentStatus] ?? 1;
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">Track Order</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-accent-teal-light text-accent-teal px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-accent-teal-border/40">
            <Truck className="w-3.5 h-3.5" />
            <span>Nationwide Ireland Live Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Track Your Order
          </h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Enter your Asianmix order number (e.g., <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-primary font-bold">AM-2026-84920</code>) below to view dispatch progress and delivery updates.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order # (e.g. AM-2026-84920)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Track Shipment</span>
                </>
              )}
            </button>
          </form>

          {/* Helper Chip */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              Need to test tracking?
            </span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('AM-2026-84920');
                handleTrack('AM-2026-84920');
              }}
              className="font-bold text-accent-teal hover:underline flex items-center gap-1"
            >
              Load Demo Cork Order: <span className="font-mono">AM-2026-84920</span> &rarr;
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-accent-red rounded-2xl p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm font-semibold">{error}</div>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden mb-12">
            {/* Order Banner Header */}
            <div className="bg-brand-brown-dark text-white p-6 sm:p-8 border-b border-[#5A2F0B]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand-yellow-base uppercase tracking-wider">
                    Order Reference
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">{order.orderNumber}</h2>
                  <p className="text-xs text-stone-200 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Status: {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="p-6 sm:p-8 border-b border-stone-100 bg-[#FCFAF7]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
                Delivery Progression
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const status = getStepStatus(idx, order.status);
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition shadow-sm ${
                          status === 'completed'
                            ? 'bg-accent-green text-white'
                            : status === 'current'
                            ? 'bg-primary text-white ring-4 ring-primary/20'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : status === 'current' ? (
                          <Clock className="w-5 h-5 animate-spin" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          status !== 'upcoming' ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5">{step.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* An Post Tracking Badge */}
              {order.trackingNumber && (
                <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-green-light text-accent-green flex items-center justify-center font-black text-xs">
                      IE
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        An Post Express Tracking
                      </div>
                      <div className="font-mono text-xs text-stone-500">
                        {order.trackingNumber}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://track.anpost.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200"
                  >
                    <span>Track on An Post Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Address & Summary Details */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Address */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent-red" />
                  <span>Delivery Destination</span>
                </h4>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-xs text-stone-700 space-y-1">
                  <p className="font-bold text-stone-900 text-sm">
                    {order.shippingAddress?.fullName || order.guestName}
                  </p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.county}
                  </p>
                  <p className="font-mono font-semibold text-primary">
                    {order.shippingAddress?.eircode}
                  </p>
                  <p className="text-stone-500 pt-2 border-t border-stone-200/60">
                    Phone: {order.shippingAddress?.phone || order.guestPhone || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-3">
                  Payment & Method
                </h4>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Method:</span>
                    <span className="font-bold text-stone-800">
                      {order.deliveryMethod === 'EXPRESS_CORK'
                        ? 'Express Same-Day (Cork Only)'
                        : order.deliveryMethod === 'EXPRESS_DUBLIN'
                        ? 'Next-Day Express (Dublin)'
                        : 'Standard Nationwide Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Subtotal:</span>
                    <span className="font-semibold text-stone-800">{formatEUR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Shipping:</span>
                    <span className="font-semibold text-stone-800">
                      {order.shippingFee === 0 ? 'FREE' : formatEUR(order.shippingFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-200/60 flex justify-between items-baseline">
                    <span className="font-bold text-stone-900">Total Paid:</span>
                    <span className="text-base font-black text-primary">
                      {formatEUR(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6 sm:p-8 border-t border-stone-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-accent-teal" />
                <span>Package Contents ({order.items.length} items)</span>
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition"
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
                        <p className="text-xs font-bold text-stone-900 line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} &times; {formatEUR(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      {formatEUR(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] py-12 text-center text-stone-500">
          Loading order tracking...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
