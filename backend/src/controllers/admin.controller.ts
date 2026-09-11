import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      lowStockProducts,
      orders,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.findMany({
        where: { stock: { lte: 15 } },
        select: { id: true, name: true, stock: true, sku: true, price: true },
        take: 10,
      }),
      prisma.order.findMany({
        select: { totalAmount: true, createdAt: true, status: true },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Group sales by status
    const statusCounts = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const formattedRecentOrders = recentOrders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
    }));

    res.json({
      success: true,
      analytics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        statusCounts,
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching analytics' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      description,
      ingredients,
      originCountry,
      brand,
      price,
      compareAtPrice,
      stock,
      sku,
      images,
      weight,
      unit,
      dietaryTags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      categoryId,
    } = req.body;

    if (!name || !price || !categoryId) {
      res.status(400).json({ message: 'Name, price, and categoryId are required' });
      return;
    }

    const generatedSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || '',
        ingredients: ingredients || null,
        originCountry: originCountry || 'Asia',
        brand: brand || null,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock, 10) || 100,
        sku: sku || `AM-${Math.floor(10000 + Math.random() * 90000)}`,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        weight: weight || null,
        unit: unit || 'pack',
        dietaryTags: dietaryTags || null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNewArrival: Boolean(isNewArrival),
        categoryId,
      },
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.compareAtPrice) updateData.compareAtPrice = parseFloat(updateData.compareAtPrice);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock, 10);
    if (updateData.images && typeof updateData.images !== 'string') {
      updateData.images = JSON.stringify(updateData.images);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting product' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
    ]);

    const formatted = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
    }));

    res.json({
      success: true,
      orders: formatted,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating order status' });
  }
};
