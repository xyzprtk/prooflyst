/**
 * Create a mock NextRequest for testing App Router API routes.
 */
export function createNextRequest(
  url: string,
  init?: RequestInit
): Request & { nextUrl: URL } {
  const req = new Request(url, init);
  return Object.assign(req, { nextUrl: new URL(url) });
}
