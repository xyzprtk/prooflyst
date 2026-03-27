import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export const publicSubmitLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "rl:submit",
});

export const publicReadLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(120, "1 m"),
  prefix: "rl:public-read",
});

export const adminLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(300, "1 m"),
  prefix: "rl:admin",
});

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ limited: boolean; headers: Record<string, string> }> {
  const { success, limit, remaining, reset } =
    await limiter.limit(identifier);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  return { limited: !success, headers };
}
