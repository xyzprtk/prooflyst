export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: { retries?: number; delayMs?: number }
): Promise<T> {
  const retries = options?.retries ?? 3;
  const delayMs = options?.delayMs ?? 1000;
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}