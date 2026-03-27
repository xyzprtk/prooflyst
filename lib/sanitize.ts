export function sanitizeString(input: string): string {
  // Remove HTML tags
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  keys: string[]
): T {
  const result = { ...obj };
  for (const key of keys) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(
        result[key] as string
      );
    }
  }
  return result;
}