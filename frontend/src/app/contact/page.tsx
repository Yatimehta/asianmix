'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-asian-terracotta-600">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Contact Asianmix Ireland
          </h1>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Have a question about an order, wholesale inquiry, or looking for a specific ingredient? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-stone-900">Store & Warehouse Depot</h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-asian-terracotta-50 text-asian-terracotta-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Cork Distribution Centre</h4>
                    <p className="mt-0.5">
                      Unit 4, Northpoint Business Park<br />
                      New Mallow Road, Cork, Ireland<br />
                      Eircode: T23 A8X9
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-asian-jade-50 text-asian-jade-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Telephone Support</h4>
                    <p className="mt-0.5">+353 (0)21 427 8899</p>
                    <p className="text-[11px] text-stone-400">Monday - Friday: 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Email Inquiries</h4>
                    <p className="mt-0.5">info@asianmix.ie</p>
                    <p className="text-[11px] text-stone-400">Response within 12 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Dispatch Hours</h4>
                    <p className="mt-0.5">Mon - Thu: Orders before 1pm dispatched same day</p>
                    <p className="text-[11px] text-stone-400">Friday - Sunday: Dispatched next business day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Send Us a Message</h3>

              {sent && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-700 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you! Your message has been sent. We will get back to you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sean Murphy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asian-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.ie"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asian-terracotta-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Order inquiry, ingredient recommendation, etc."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asian-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help with your Asian grocery needs today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-asian-terracotta-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-asian-terracotta-500 hover:bg-asian-terracotta-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
