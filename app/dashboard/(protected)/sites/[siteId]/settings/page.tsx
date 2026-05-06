import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { getAdminKey } from "@/lib/session";
import { hashKey } from "@/lib/keys";
import { withRetry } from "@/lib/retry";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ArrowLeft, ExternalLink } from "lucide-react";

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

  const site = await withRetry(async () => {
    const [result] = await db.select().from(sites).where(and(eq(sites.id, siteId), eq(sites.adminKey, adminHash))).limit(1);
    return result;
  });

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
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border px-4 text-sm hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold tracking-tight">Site Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Site ID</span>
            <code className="block rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">{site.id}</code>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Slug</span>
            <code className="block rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">{site.slug}</code>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Domain</span>
            <p className="text-sm">{site.domain}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Public Key</span>
            <div className="flex items-center gap-2">
              <code className="rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">{site.publicKey}</code>
              <CopyButton value={site.publicKey} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold tracking-tight">Hosted URLs</h2>
        <div className="space-y-4">
          <UrlRow label="Submission Form" url={`${appUrl}/t/${site.slug}`} />
          <UrlRow label="Public Wall" url={`${appUrl}/wall/${site.slug}`} />
        </div>
      </div>
    </div>
  );
}

function UrlRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="text-xs text-muted-foreground w-32 shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <code className="rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40 truncate">{url}</code>
        <CopyButton value={url} />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
