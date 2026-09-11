import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import reviewRoutes from './routes/review.routes';
import addressRoutes from './routes/address.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001,https://asianmix.ie,https://www.asianmix.ie')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.endsWith('.asianmix.ie')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Asianmix Ireland Online Grocery',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🍜 Asianmix Ireland Backend API listening on port ${PORT}`);
    console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
