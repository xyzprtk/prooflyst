import { NextRequest } from "next/server";

/**
 * Create a mock NextRequest for testing App Router API routes.
 */
export function createNextRequest(
  url: string,
  init?: RequestInit
): NextRequest {
  return new NextRequest(url, init);
}
