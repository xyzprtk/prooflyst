import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Zap } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getLocalSiteByAdminHash } from "@/lib/local-store";
import { getAdminKey } from "@/lib/session";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  const adminHash = hashKey(adminKey);

  let site:
    | {
        id: string;
        name: string;
      }
    | undefined;

  try {
    const result = await db
      .select({ id: sites.id, name: sites.name })
      .from(sites)
      .where(eq(sites.adminKey, adminHash))
      .limit(1);
    if (result.length > 0) {
      site = result[0];
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard DB query failed:", error);
    }
  }

  if (!site) {
    try {
      const local = await getLocalSiteByAdminHash(adminHash);
      if (local) {
        site = { id: local.id, name: local.name };
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Local store fallback failed:", error);
      }
    }
  }

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
