const requiredEnvVars = ["DATABASE_URL", "NEXT_PUBLIC_APP_URL"] as const;

export type RequiredEnvVar = (typeof requiredEnvVars)[number];

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  return { valid: missing.length === 0, missing };
}

export function getEnv(key: RequiredEnvVar): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function hasRedis(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}