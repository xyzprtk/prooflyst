import { authenticateAdmin } from "@/lib/auth";
import { hashKey } from "@/lib/keys";
import { checkRateLimit, adminLimiter } from "@/lib/rate-limit";

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization || !/^Bearer\s+/i.test(authorization)) {
    return null;
  }
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  return token || null;
}

export async function checkAdminRateLimit(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return { auth, limited: false, headers: {} };
  }

  const adminKey = getBearerToken(request);
  if (!adminKey) {
    return {
      auth: {
        success: false as const,
        error: "Missing or invalid Authorization header",
        status: 401,
      },
      limited: false,
      headers: {},
    };
  }

  const adminHash = hashKey(adminKey);
  const { limited, headers } = await checkRateLimit(adminLimiter, `admin:${adminHash}`);
  return { auth, limited, headers };
}
