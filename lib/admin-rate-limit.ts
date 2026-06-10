import { authenticateAdmin } from "@/lib/auth";
import { hashKey } from "@/lib/keys";
import { checkRateLimit, adminLimiter } from "@/lib/rate-limit";

export async function checkAdminRateLimit(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return { auth, limited: false, headers: {} };
  }
  const adminKey = request.headers.get("authorization")!.slice(7);
  const adminHash = hashKey(adminKey);
  const { limited, headers } = await checkRateLimit(adminLimiter, `admin:${adminHash}`);
  return { auth, limited, headers };
}
