import { Router } from 'express';
import { upload, handleFileUpload } from '../controllers/upload.controller';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, requireAdmin, upload.single('image'), handleFileUpload);

export default router;
