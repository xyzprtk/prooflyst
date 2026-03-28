import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

// Initialize Redis only if environment variables are set
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const CACHE_PREFIX = "site:";
const CACHE_TTL_SECONDS = 60 * 15; // 15 minutes

export interface CachedSite {
  id: string;
  name: string;
  slug: string;
  adminKey: string;
}

function getCacheKey(adminKeyHash: string): string {
  return `${CACHE_PREFIX}${adminKeyHash}`;
}

export async function getCachedSite(
  adminKeyHash: string
): Promise<CachedSite | null> {
  if (!redis) {
    return null;
  }

  try {
    const cached = await redis.get<CachedSite>(getCacheKey(adminKeyHash));
    return cached;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCachedSite(
  adminKeyHash: string,
  site: CachedSite
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.set(getCacheKey(adminKeyHash), site, { ex: CACHE_TTL_SECONDS });
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export async function deleteCachedSite(adminKeyHash: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.del(getCacheKey(adminKeyHash));
  } catch (error) {
    console.error("Redis del error:", error);
  }
}

export function hasRedis(): boolean {
  return redis !== null;
}