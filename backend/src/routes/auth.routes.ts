import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);

export default router;
