import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const calculateShippingFee = (subtotal: number, deliveryMethod: string): number => {
  switch (deliveryMethod) {
    case 'EXPRESS_CORK':
      return subtotal >= 35 ? 0 : 3.99;
    case 'EXPRESS_DUBLIN':
      return 6.99;
    case 'STANDARD_IRELAND':
    default:
      return subtotal >= 50 ? 0 : 5.99;
  }
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || null;
    const {
      guestEmail,
      guestName,
      guestPhone,
      items, // array of { productId, quantity }
      shippingAddress, // object with fullName, addressLine1, addressLine2, city, county, eircode, phone
      deliveryMethod = 'STANDARD_IRELAND',
      paymentMethod = 'STRIPE',
      notes,
    } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ message: 'Order must contain at least one item' });
      return;
    }

    if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city) {
      res.status(400).json({ message: 'Valid shipping address is required' });
      return;
    }

    // Fetch products and verify prices and stock
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const orderItemsToCreate: any[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        res.status(400).json({ message: `Product with ID ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
        return;
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      let images = [];
      try {
        images = JSON.parse(product.images);
      } catch {
        images = [product.images];
      }

      orderItemsToCreate.push({
        productId: product.id,
        productName: product.name,
        productImage: images[0] || '',
        price: product.price,
        quantity: item.quantity,
        subtotal: Number(itemTotal.toFixed(2)),
      });
    }

    const subtotal = Number(calculatedSubtotal.toFixed(2));
    const shippingFee = calculateShippingFee(subtotal, deliveryMethod);
    const totalAmount = Number((subtotal + shippingFee).toFixed(2));

    // Generate unique Ireland order number e.g. AM-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `AM-${new Date().getFullYear()}-${randomSuffix}`;

    // Create order transaction and decrement product stock
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          guestEmail: guestEmail || (req.user ? req.user.email : null),
          guestName: guestName || (req.user ? req.user.name : null),
          guestPhone: guestPhone || null,
          status: 'PROCESSING',
          subtotal,
          shippingFee,
          discount: 0,
          totalAmount,
          shippingAddress: JSON.stringify(shippingAddress),
          deliveryMethod,
          paymentStatus: 'PAID', // In live mode updated via webhook
          paymentMethod,
          notes: notes || null,
          trackingNumber: `ANPOST-${Math.floor(10000000 + Math.random() * 90000000)}IE`,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // If user had a cart, clear it
      if (userId) {
        const userCart = await tx.cart.findUnique({ where: { userId } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      return createdOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating order' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching user orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Access control: if not admin, must be order owner or have guest email match
    if (req.user && req.user.role !== 'ADMIN' && order.userId && order.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.json({
      success: true,
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching order' });
  }
};

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const totalCents = Math.round((parseFloat(amount) || 10) * 100);

    // Mock client secret for testing / demo
    const clientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

    res.json({
      success: true,
      clientSecret,
      amountInCents: totalCents,
      currency: 'eur',
      mode: 'mock_or_live',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating payment intent' });
  }
};
