import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'You must be logged in to post a review' });
      return;
    }

    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      res.status(400).json({ message: 'Product ID, rating (1-5), and review comment are required' });
      return;
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating, 10)));

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        userName: req.user.name,
        rating: numericRating,
        title: title || null,
        comment,
        isVerifiedPurchase: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating review' });
  }
};

export const getProductReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching reviews' });
  }
};
