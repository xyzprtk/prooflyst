export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { retries?: number; baseDelayMs?: number }
): Promise<T> {
  const retries = options?.retries ?? 5;
  const baseDelayMs = options?.baseDelayMs ?? 2000;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if this is a retryable error (connection/timeout issues)
      const errorMessage = lastError.message.toLowerCase();
      const isErrorRetryable = 
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("econnrefused") ||
        errorMessage.includes("etimedout") ||
        errorMessage.includes("network error") ||
        errorMessage.includes("failed query") || // Drizzle query errors
        errorMessage.includes("error connecting") ||
        errorMessage.includes("database is unavailable");

      if (!isErrorRetryable || attempt >= retries - 1) {
        console.error(`Query failed (attempt ${attempt + 1}/${retries}):`, lastError.message);
        throw lastError;
      }

      // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`Database query retry ${attempt + 1}/${retries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}