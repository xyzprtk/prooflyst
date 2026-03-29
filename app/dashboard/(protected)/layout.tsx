import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { LogoutButton } from "@/components/dashboard/logout-button";
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

function Logo() {
  return (
    <div className="relative h-7 w-7">
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={28}
        height={28}
        className="block dark:hidden"
      />
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={28}
        height={28}
        className="hidden dark:block"
      />
    </div>
  );
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
              <Logo />
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