import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { getAdminKey } from "@/lib/session";
import { hashKey } from "@/lib/keys";
import { getLocalSiteById } from "@/lib/local-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SiteSettingsPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  const adminHash = hashKey(adminKey);
  
  // Try database first - use allSettled to never throw
  const [dbResult] = await Promise.allSettled([
    db
      .select()
      .from(sites)
      .where(and(eq(sites.id, siteId), eq(sites.adminKey, adminHash)))
      .limit(1)
  ]);

  let site = dbResult.status === "fulfilled" && dbResult.value.length > 0 
    ? dbResult.value[0] 
    : undefined;

  // Fall back to local store
  if (!site) {
    const local = await getLocalSiteById(siteId);
    if (local && local.adminKey === adminHash) {
      site = {
        id: local.id,
        slug: local.slug,
        name: local.name,
        domain: local.domain,
        adminKey: local.adminKey,
        publicKey: local.publicKey,
        webhookUrl: null,
        branding: null,
        createdAt: new Date(local.createdAt),
      };
    }
  }

  if (!site) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Site Settings</h1>
          <p className="text-sm text-muted-foreground">{site.name}</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-accent"
        >
          Back to dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Site ID</span>
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{site.id}</code>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Slug</span>
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{site.slug}</code>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Domain</span>
            <span>{site.domain}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Public Key</span>
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{site.publicKey}</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hosted URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Submission Form</span>
            <a
              href={`${appUrl}/t/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-primary underline"
            >
              {appUrl}/t/{site.slug}
            </a>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Public Wall</span>
            <a
              href={`${appUrl}/wall/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-primary underline"
            >
              {appUrl}/wall/{site.slug}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
