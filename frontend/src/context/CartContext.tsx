'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi, getGuestId } from '@/lib/api';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  weight?: string;
  stock: number;
  quantity: number;
  itemTotal: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  freeShippingProgress: number;
}

const FREE_SHIPPING_THRESHOLD = 50.0;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const guestId = getGuestId();
      const res = await fetchApi(`/cart?guestId=${guestId}`);
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const guestId = getGuestId();
      const res = await fetchApi('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, guestId }),
      });
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
        setIsOpen(true);
      }
    } catch (e: any) {
      alert(e.message || 'Could not add product to cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetchApi(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
      }
    } catch (e: any) {
      console.error('Error updating cart item:', e);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetchApi(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
      }
    } catch (e: any) {
      console.error('Error removing cart item:', e);
    }
  };

  const clearCart = async () => {
    try {
      const guestId = getGuestId();
      const res = await fetchApi(`/cart/clear?guestId=${guestId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setItems([]);
      }
    } catch (e: any) {
      console.error('Error clearing cart:', e);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2));

  const amountNeededForFreeShipping = Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
