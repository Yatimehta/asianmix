import { Request, Response } from 'express';
import prisma from '../config/prisma';

const normalizeImageUrl = (src?: string | null): string => {
  if (!src) return '';
  let url = src.trim();
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }
  url = url.replace(
    /^(https?:\/\/)?(www\.)?asianmix\.ie\/cdn\/shop\//i,
    'https://cdn.shopify.com/s/files/1/0582/8336/0440/'
  );
  url = url.replace(
    /^\/cdn\/shop\//i,
    'https://cdn.shopify.com/s/files/1/0582/8336/0440/'
  );
  return url;
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: normalizeImageUrl(c.image),
      icon: c.icon,
      orderIndex: c.orderIndex,
      productCount: c._count.products,
    }));

    res.json({ success: true, categories: formatted });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching categories' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        products: {
          take: 12,
          include: { reviews: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const formattedProducts = category.products.map((p) => {
      let imgs = [];
      try {
        imgs = JSON.parse(p.images);
      } catch {
        imgs = [p.images];
      }
      return {
        ...p,
        images: imgs,
        avgRating: p.reviews.length
          ? Number((p.reviews.reduce((a, b) => a + b.rating, 0) / p.reviews.length).toFixed(1))
          : 5.0,
      };
    });

    res.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        productCount: category._count.products,
        products: formattedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching category' });
  }
};
