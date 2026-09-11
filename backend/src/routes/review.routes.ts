import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/review.controller';
import { authenticateJWT, optionalAuthJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, addReview);
router.get('/product/:productId', optionalAuthJWT, getProductReviews);

export default router;
