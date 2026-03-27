import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Zap } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { db, isDbAvailable } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getLocalSiteByAdminHash } from "@/lib/local-store";
import { getAdminKey } from "@/lib/session";

async function getSiteByAdminKey(adminKey: string): Promise<{ id: string; name: string } | null> {
  const adminHash = hashKey(adminKey);
  
  // Check if database is available before querying
  const canUseDb = await isDbAvailable();
  
  if (canUseDb) {
    // Try database first - use allSettled to never throw
    const [dbResult] = await Promise.allSettled([
      db
        .select({ id: sites.id, name: sites.name })
        .from(sites)
        .where(eq(sites.adminKey, adminHash))
        .limit(1)
    ]);
    
    if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
      return dbResult.value[0];
    }
  }

  // Fall back to local store
  try {
    const local = await getLocalSiteByAdminHash(adminHash);
    if (local) {
      return { id: local.id, name: local.name };
    }
  } catch {
    // Local store also failed
  }

  return null;
}

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  const site = await getSiteByAdminKey(adminKey);
  if (!site) {
    redirect("/dashboard/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Prooflyst</span>
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <Link
              href={`/dashboard/sites/${site.id}/settings`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {site.name}
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}