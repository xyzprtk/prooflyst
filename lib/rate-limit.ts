import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
let publicSubmitLimiter: Ratelimit | null = null;
let publicReadLimiter: Ratelimit | null = null;
let adminLimiter: Ratelimit | null = null;

// Initialize Redis only if environment variables are set
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  publicSubmitLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:submit",
  });

  publicReadLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    prefix: "rl:public-read",
  });

  adminLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "1 m"),
    prefix: "rl:admin",
  });
}

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ limited: boolean; headers: Record<string, string> }> {
  // If no rate limiter (development/local), allow all requests
  if (!limiter) {
    return { limited: false, headers: {} };
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  return { limited: !success, headers };
}

export { publicSubmitLimiter, publicReadLimiter, adminLimiter };