import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter for standard endpoints.
 * Allows 300 requests per 15 minutes per IP (~20 requests/min).
 * Protects against aggressive scraping and API abuse without impacting shoppers.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a few minutes.',
  },
  skip: (req) => {
    // Exempt health check and static uploads from rate limiting
    return req.path === '/api/health' || req.path.startsWith('/uploads');
  },
});

/**
 * Stricter rate limiter for sensitive authentication endpoints (login, register).
 * Allows 10 attempts per 15 minutes per IP to thwart credential stuffing and brute-force.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please wait 15 minutes before trying again.',
  },
});
