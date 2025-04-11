import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  limit: 3,
  message: "Too many attempts",
  skipSuccessfulRequests: true
});
