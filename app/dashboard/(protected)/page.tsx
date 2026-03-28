import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, isDbAvailable } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { getAdminKey } from "@/lib/session";
import { hashKey } from "@/lib/keys";
import {
  getLocalSiteByAdminHash,
  listLocalTestimonialsBySite,
} from "@/lib/local-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SiteOverview } from "@/components/dashboard/site-overview";
import { TestimonialsTable } from "@/components/dashboard/testimonials-table";

export default async function DashboardPage() {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  let site:
    | {
        id: string;
        slug: string;
        name: string;
        domain: string;
        adminKey: string;
        publicKey: string;
      }
    | undefined;
  let rows: Array<{
    id: string;
    author: string;
    content: string;
    rating: number | null;
    status: "pending" | "approved" | "deleted";
    createdAt: Date;
  }> = [];

  const adminHash = hashKey(adminKey);
  const canUseDb = await isDbAvailable();

  if (canUseDb) {
    const [dbSiteResult] = await Promise.allSettled([
      db.select().from(sites).where(eq(sites.adminKey, adminHash)).limit(1),
    ]);

    if (dbSiteResult.status === "fulfilled" && dbSiteResult.value.length > 0) {
      site = dbSiteResult.value[0];

      const [dbTestimonialsResult] = await Promise.allSettled([
        db
          .select()
          .from(testimonials)
          .where(eq(testimonials.siteId, site.id))
          .orderBy(desc(testimonials.createdAt))
          .limit(100),
      ]);

      if (dbTestimonialsResult.status === "fulfilled") {
        rows = dbTestimonialsResult.value;
      }
    }
  }

  if (!site) {
    const local = await getLocalSiteByAdminHash(adminHash);
    if (local) {
      site = {
        id: local.id,
        slug: local.slug,
        name: local.name,
        domain: local.domain,
        adminKey: local.adminKey,
        publicKey: local.publicKey,
      };
      const localRows = await listLocalTestimonialsBySite(local.id);
      rows = localRows.map((item) => ({
        id: item.id,
        author: item.author,
        content: item.content,
        rating: item.rating,
        status: item.status,
        createdAt: new Date(item.createdAt),
      }));
    }
  }

  if (!site) {
    redirect("/dashboard/setup");
  }

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