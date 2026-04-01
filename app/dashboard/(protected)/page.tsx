import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { getAdminKey } from "@/lib/session";
import { hashKey } from "@/lib/keys";
import { withRetry } from "@/lib/retry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SiteOverview } from "@/components/dashboard/site-overview";
import { TestimonialsTable } from "@/components/dashboard/testimonials-table";

export default async function DashboardPage() {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  const adminHash = hashKey(adminKey);

  const site = await withRetry(async () => {
    const [result] = await db
      .select()
      .from(sites)
      .where(eq(sites.adminKey, adminHash))
      .limit(1);
    return result;
  });

  if (!site) {
    redirect("/dashboard/setup");
  }

  const rows = await withRetry(async () => {
    return db
      .select()
      .from(testimonials)
      .where(eq(testimonials.siteId, site.id))
      .orderBy(desc(testimonials.createdAt))
      .limit(100);
  });

  const stats = {
    total: rows.filter((r) => r.status !== "deleted").length,
    approved: rows.filter((r) => r.status === "approved").length,
    pending: rows.filter((r) => r.status === "pending").length,
    deleted: rows.filter((r) => r.status === "deleted").length,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage testimonials for <span className="font-medium">{site.name}</span>
        </p>
      </div>

      <StatsCards total={stats.total} pending={stats.pending} approved={stats.approved} deleted={stats.deleted} />

      <Card>
        <CardHeader>
          <CardTitle>Site Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SiteOverview site={site} appUrl={appUrl} />
        </CardContent>
      </Card>

      <TestimonialsTable testimonials={rows} />
    </div>
  );
}