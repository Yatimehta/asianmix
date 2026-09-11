import React from 'react';
import Link from 'next/link';
import { HelpCircle, Truck, Snowflake, CreditCard, RotateCcw } from 'lucide-react';

const FAQS = [
  {
    q: 'How much does delivery cost within Ireland?',
    a: 'We offer standard tracked courier delivery across all 32 counties for a flat rate of €5.99. Orders over €50 qualify for FREE standard delivery! For Cork customers, we also offer Click & Collect from Northpoint Business Park for free.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders placed before 1:00 PM Monday through Thursday are typically dispatched the same day and delivered within 1 to 2 business days via DPD or An Post.',
  },
  {
    q: 'How do you keep frozen and fresh items cold during shipping?',
    a: 'We use high-grade insulated thermal liners combined with food-safe non-toxic ice gel packs that maintain safe cold temperatures for up to 48 hours in transit. Upon delivery, please place frozen items in your freezer promptly.',
  },
  {
    q: 'Do you deliver to Northern Ireland?',
    a: 'Yes, we deliver to all 32 counties on the island of Ireland, including Antrim, Armagh, Derry, Down, Fermanagh, and Tyrone.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) processed securely through Stripe with 256-bit SSL encryption. Apple Pay and Google Pay are also supported.',
  },
  {
    q: 'What is your return and refund policy?',
    a: 'If any item arrives damaged or compromised during transit, please take a photo and contact us within 48 hours at info@asianmix.ie. We will immediately issue a replacement or full refund to your original payment method.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-asian-terracotta-600">
            Help & Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Everything you need to know about Ireland delivery, shipping perishables, and shopping with Asianmix.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-2"
            >
              <h3 className="text-base font-bold text-stone-900 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-asian-terracotta-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-asian-jade-50 rounded-3xl p-8 border border-asian-jade-200 text-center space-y-3">
          <h3 className="text-lg font-bold text-asian-jade-900">Still have questions?</h3>
          <p className="text-xs text-asian-jade-700 max-w-md mx-auto">
            Our Cork support team is ready to help you with product queries, cooking recommendations, or custom delivery requests.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-asian-jade-600 hover:bg-asian-jade-700 text-white font-bold text-xs rounded-full shadow transition"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
