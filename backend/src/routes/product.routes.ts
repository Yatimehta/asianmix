import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedAndBestSellers,
  searchSuggestions,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedAndBestSellers);
router.get('/suggestions', searchSuggestions);
router.get('/:slug', getProductBySlug);

export default router;
