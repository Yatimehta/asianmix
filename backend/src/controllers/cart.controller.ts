import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const formatCartResponse = (cart: any) => {
  if (!cart) return { items: [], subtotal: 0, itemCount: 0 };

  const items = cart.items.map((item: any) => {
    let images = [];
    try {
      images = JSON.parse(item.product.images);
    } catch {
      images = [item.product.images];
    }

    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      image: images[0] || '',
      weight: item.product.weight,
      stock: item.product.stock,
      quantity: item.quantity,
      itemTotal: Number((item.product.price * item.quantity).toFixed(2)),
    };
  });

  const subtotal = Number(items.reduce((sum: number, it: any) => sum + it.itemTotal, 0).toFixed(2));
  const itemCount = items.reduce((sum: number, it: any) => sum + it.quantity, 0);

  return {
    id: cart.id,
    items,
    subtotal,
    itemCount,
  };
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const guestId = (req.query.guestId as string) || (req.headers['x-guest-id'] as string);

    if (!userId && !guestId) {
      res.json({ success: true, cart: { items: [], subtotal: 0, itemCount: 0 } });
      return;
    }

    const where = userId ? { userId } : { guestId };
    const cart = await prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({ success: true, cart: formatCartResponse(cart) });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity = 1, guestId } = req.body;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    const effectiveGuestId = !userId ? guestId || req.headers['x-guest-id'] : null;

    if (!userId && !effectiveGuestId) {
      res.status(400).json({ message: 'User ID or Guest ID required to manage cart' });
      return;
    }

    // Verify product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.stock <= 0) {
      res.status(400).json({ message: 'This item is currently out of stock' });
      return;
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { guestId: effectiveGuestId as string },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { guestId: effectiveGuestId as string },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    if (existingItem) {
      const newQty = Math.min(existingItem.quantity + qtyToAdd, product.stock);
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: Math.min(qtyToAdd, product.stock),
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(updatedCart),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error adding to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      res.status(400).json({ message: 'Invalid quantity' });
      return;
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    if (qty === 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const finalQty = Math.min(qty, item.product.stock);
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: finalQty },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({
      success: true,
      message: 'Cart updated',
      cart: formatCartResponse(updatedCart),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating cart item' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }

    const cartId = item.cartId;
    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(updatedCart),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error removing cart item' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const guestId = (req.query.guestId as string) || (req.headers['x-guest-id'] as string);

    const where = userId ? { userId } : { guestId };
    const cart = await prisma.cart.findFirst({ where });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ success: true, message: 'Cart cleared', cart: { items: [], subtotal: 0, itemCount: 0 } });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error clearing cart' });
  }
};
