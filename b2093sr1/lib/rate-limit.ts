/**
 * Rate Limiting Utility
 * 
 * Implements in-memory rate limiting for API routes.
 * In production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  chat: { interval: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  mockTestGenerate: { interval: 60 * 1000, maxRequests: 5 }, // 5 requests per minute
  predictorAnalyze: { interval: 60 * 1000, maxRequests: 3 }, // 3 requests per minute
  default: { interval: 60 * 1000, maxRequests: 20 }, // 20 requests per minute
} as const;

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (e.g., user ID or IP address)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 * 
 * @example
 * ```ts
 * const { allowed, remaining, resetTime } = checkRateLimit(userId, RATE_LIMITS.chat);
 * if (!allowed) {
 *   return NextResponse.json(
 *     { error: "Too many requests", resetTime },
 *     { status: 429 }
 *   );
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // First request or expired window
    const resetTime = now + config.interval;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request
 * Uses user ID if authenticated, otherwise falls back to IP address
 * 
 * @param userId - Authenticated user ID (optional)
 * @param request - Next.js request object
 * @returns Unique identifier for rate limiting
 */
export function getRateLimitIdentifier(
  userId: string | undefined,
  request: Request
): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Fallback to IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return `ip:${ip}`;
}
