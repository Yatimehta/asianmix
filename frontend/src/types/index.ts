export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  orderIndex?: number;
  _count?: {
    products: number;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients?: string;
  originCountry: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  weight?: string;
  unit: string;
  dietaryTags: string; // comma-separated e.g. "Vegan,Halal"
  isFeatured: boolean;
  isBestSeller: boolean;
  categoryId: string;
  category?: Category;
  avgRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  user?: { id: string; name: string; email: string };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  shippingMethod: string;
  shippingAddress: string; // stringified JSON
  parsedAddress?: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  createdAt?: string;
}
