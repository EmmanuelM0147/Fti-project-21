import rateLimit from 'express-rate-limit';

// Common configuration for rate limiters
const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Global API rate limiter
export const apiLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again later'
);

// Form submission rate limiter (more restrictive)
export const formSubmissionLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  5, // 5 submissions per hour
  'Too many form submissions. Please try again later'
);

// Authentication rate limiter
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 auth attempts per 15 minutes
  'Too many authentication attempts, please try again later'
);