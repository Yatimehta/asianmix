'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, phone);
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FBF9F5] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFBE26] text-[#2C2C2A] font-black text-2xl flex items-center justify-center mx-auto shadow-md mb-3">
            亞
          </div>
          <h1 className="text-2xl font-black text-[#2C2C2A]">Create Account</h1>
          <p className="text-xs text-stone-500 mt-1">
            Join Asianmix Ireland for 10% off your first order & fast reordering
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Sean Murphy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 pl-10 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFBE26]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.ie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 pl-10 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFBE26]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Mobile Number (For Courier Tracking)
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+353 87 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-3 pl-10 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFBE26]"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 pl-10 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFBE26]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FFBE26] hover:bg-[#E5A30B] text-[#2C2C2A] font-black text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          Already have an Asianmix account?{' '}
          <Link href="/account/login" className="font-bold text-[#2C2C2A] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
