import { rateLimit } from 'express-rate-limit';

/**
 * Creates a rate limiter middleware for Express
 * @param windowMs Time window in milliseconds
 * @param max Maximum number of requests per window
 * @param message Custom error message
 * @returns Express rate limiter middleware
 */
export const createRateLimiter = (
  windowMs: number = 60 * 1000, // 1 minute by default
  max: number = 5, // 5 requests per minute by default
  message: string = 'Too many requests, please try again later'
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message }
  });
};

// Common rate limiters
export const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Too many requests from this IP, please try again after 15 minutes'
);

export const contactFormLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // 5 contact form submissions per hour
  'Too many contact requests from this IP, please try again after an hour'
);

export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 auth attempts per 15 minutes
  'Too many authentication attempts, please try again later'
);