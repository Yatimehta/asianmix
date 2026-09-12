import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Asianmix Ireland | Authentic Asian Grocery & Supermarket Online',
  description:
    'Shop authentic Asian groceries, sauces, noodles, Jasmine & Matta rice, Korean snacks, dumplings, and pantry essentials delivered across Ireland. Free delivery on orders over €50.',
  keywords: [
    'Asian grocery Ireland',
    'Dublin Asian supermarket',
    'Cork Asian food',
    'Buy noodles Ireland',
    'Basmati Rice Dublin',
    'Sriracha Ireland',
    'Korean snacks online Ireland',
  ],
  openGraph: {
    title: 'Asianmix Ireland | Authentic Asian Grocery & Food Store',
    description: 'Ireland’s favorite Asian supermarket delivering across Dublin, Cork, Galway and all 32 counties.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#2C2C2A] bg-[#F8F7F4] min-h-screen flex flex-col selection:bg-[#FFBE26] selection:text-[#2C2C2A]">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
