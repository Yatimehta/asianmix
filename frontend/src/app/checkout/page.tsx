'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ShoppingBag, 
  Lock,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchApi, formatEUR } from '@/lib/api';

const IRELAND_COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin',
  'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim',
  'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan',
  'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow', 'Antrim', 'Armagh', 'Derry', 'Down', 'Fermanagh', 'Tyrone'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, freeShippingThreshold } = useCart();
  const { user } = useAuth();

  // Mode: guest vs member
  const [checkoutMode, setCheckoutMode] = useState<'GUEST' | 'MEMBER'>('GUEST');

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('Dublin');
  const [eircode, setEircode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD_IRELAND' | 'EXPRESS_CORK' | 'EXPRESS_DUBLIN'>('STANDARD_IRELAND');
  const [notes, setNotes] = useState('');

  // Payment mock state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Loading & Submission
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setCheckoutMode('MEMBER');
      setEmail(user.email || '');
      setFullName(user.name || '');
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Calculate delivery fee
  let shippingFee = 5.99;
  if (deliveryMethod === 'STANDARD_IRELAND') {
    shippingFee = subtotal >= freeShippingThreshold ? 0 : 5.99;
  } else if (deliveryMethod === 'EXPRESS_CORK') {
    shippingFee = subtotal >= 35 ? 0 : 3.99;
  } else if (deliveryMethod === 'EXPRESS_DUBLIN') {
    shippingFee = 6.99;
  }

  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        guestEmail: email,
        guestName: fullName,
        guestPhone: phone,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          fullName,
          addressLine1,
          addressLine2,
          city,
          county,
          eircode,
          country: 'Ireland',
          phone,
        },
        deliveryMethod,
        paymentMethod: 'STRIPE',
        notes,
      };

      const res = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.order) {
        setCompletedOrder(res.order);
        await clearCart();
      } else {
        setErrorMsg(res.message || 'Failed to process order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment or network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If order is completed, show Order Confirmation view
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-accent-green-light text-accent-green flex items-center justify-center mx-auto border-2 border-accent-green-border">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-green">
                Payment Confirmed & Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                Order reference: <strong className="text-primary font-mono text-base">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 text-left text-xs space-y-2.5 text-stone-600">
              <div className="flex justify-between">
                <span>Confirmation Sent To:</span>
                <strong className="text-stone-800">{email || user?.email}</strong>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="text-stone-800 font-medium">
                  {addressLine1}, {city}, Co. {county} ({eircode})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Dispatch:</span>
                <span className="text-accent-green font-bold">1-2 Business Days via Tracked An Post / Courier</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span>Total Paid:</span>
                <span className="text-primary font-black text-base">{formatEUR(completedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/track-order?order=${completedOrder.orderNumber}`}
                className="flex-1 py-3.5 px-6 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition text-center flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track My Order Now</span>
              </Link>
              <Link
                href="/products"
                className="flex-1 py-3.5 px-6 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-2xl transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-3xl flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Your basket is empty</h2>
        <p className="text-xs text-stone-500 mt-2 mb-6">
          Add some delicious rice, spices, noodles, or snacks to proceed with checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-2xl shadow transition"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/cart" className="hover:text-primary font-medium">Basket</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-800 font-bold">Ireland Courier Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Secure Ireland Delivery & Checkout
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-accent-red">
            {errorMsg}
          </div>
        )}

        {/* Tab Switcher: Guest Checkout vs Member Checkout */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-1.5 flex max-w-lg mb-8 shadow-2xs">
          <button
            type="button"
            onClick={() => setCheckoutMode('GUEST')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              checkoutMode === 'GUEST'
                ? 'bg-primary text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-accent-orange" />
            <span>⚡ Guest Checkout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (user) {
                setCheckoutMode('MEMBER');
              } else {
                router.push('/login?redirect=/checkout');
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              checkoutMode === 'MEMBER'
                ? 'bg-primary text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-accent-teal" />
            <span>{user ? `👤 Signed in (${user.name})` : '👤 Member Checkout'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Checkout Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  Contact Information
                </h2>
                {!user && (
                  <Link href="/login?redirect=/checkout" className="text-xs font-bold text-primary hover:underline">
                    Already registered? Sign in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.ie"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    We&apos;ll send your invoice and An Post / DPD courier tracking link here.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sean Murphy"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Irish Mobile Number <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+353 87 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address & Eircode */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  Delivery Address in Ireland
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Address Line 1 <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House number, street name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, building"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Town / City <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dublin, Cork, Galway"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    County <span className="text-accent-red">*</span>
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {IRELAND_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        Co. {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Eircode <span className="text-accent-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. D04 V3P2"
                    value={eircode}
                    onChange={(e) => setEircode(e.target.value.toUpperCase())}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="Ireland (Éire)"
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Method Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  Select Ireland Delivery Option
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('STANDARD_IRELAND')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    deliveryMethod === 'STANDARD_IRELAND'
                      ? 'border-primary bg-primary/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'STANDARD_IRELAND'}
                      onChange={() => setDeliveryMethod('STANDARD_IRELAND')}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Standard Tracked Courier (All 32 Counties)
                      </p>
                      <p className="text-[11px] text-stone-500">
                        1-2 business days with cold-chain gel packs for perishables
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '€5.99'}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('EXPRESS_CORK')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    deliveryMethod === 'EXPRESS_CORK'
                      ? 'border-primary bg-primary/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'EXPRESS_CORK'}
                      onChange={() => setDeliveryMethod('EXPRESS_CORK')}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Cork Local Express / Click & Collect
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Collect from Northpoint Business Park or fast local van dispatch
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-accent-green">
                    {subtotal >= 35 ? 'FREE' : '€3.99'}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('EXPRESS_DUBLIN')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                    deliveryMethod === 'EXPRESS_DUBLIN'
                      ? 'border-primary bg-primary/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'EXPRESS_DUBLIN'}
                      onChange={() => setDeliveryMethod('EXPRESS_DUBLIN')}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Dublin Next-Day Express Courier
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Priority guaranteed morning dispatch to Dublin city & suburbs
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-800">€6.99</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave in porch or call on arrival"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* 4. Payment Information (Stripe) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  Secure Stripe Payment
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-accent-green font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit SSL</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Review Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm sticky top-28 space-y-5">
              <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Review ({items.length} items)
              </h2>

              {/* Items summary */}
              <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-stone-400">Qty: {item.quantity} &times; {formatEUR(item.price)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      {formatEUR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing totals */}
              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatEUR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ireland Delivery</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-accent-green font-bold">FREE</span>
                    ) : (
                      formatEUR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Irish VAT (included)</span>
                  <span>{formatEUR(grandTotal * 0.135)}</span>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">Total Amount</span>
                <span className="text-2xl font-black text-primary">
                  {formatEUR(grandTotal)}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Processing Payment...' : `Pay ${formatEUR(grandTotal)}`}</span>
              </button>

              <div className="text-center text-[11px] text-stone-400 space-y-1">
                <p>🔒 Verified with Stripe Payment Gateway</p>
                <p>Irish Registered Business • Fast Courier Dispatch</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
