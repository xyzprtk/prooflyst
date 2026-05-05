import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getAdminKey } from "@/lib/session";
import { withRetry } from "@/lib/retry";

async function getSiteByAdminKey(adminKey: string): Promise<{ id: string; name: string } | null> {
  const adminHash = hashKey(adminKey);

  return withRetry(async () => {
    const [site] = await db
      .select({ id: sites.id, name: sites.name })
      .from(sites)
      .where(eq(sites.adminKey, adminHash))
      .limit(1);
    return site || null;
  });
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
      <header className="sticky top-4 z-40 mx-auto max-w-7xl px-6">
        <nav className="flex h-14 items-center justify-between rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size={24} />
              <span className="text-sm font-semibold tracking-tight">Prooflyst</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/dashboard/sites/${site.id}/settings`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {site.name}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 pt-10">{children}</main>
    </div>
  );
}