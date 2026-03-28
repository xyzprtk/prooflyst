"use client";

import { useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SiteOverviewProps {
  site: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    publicKey: string;
    adminKey: string;
  };
  appUrl: string;
}

export function SiteOverview({ site, appUrl }: SiteOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Site Name</p>
          <p className="font-medium">{site.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Slug</p>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{site.slug}</code>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Domain</p>
          <p className="text-sm">{site.domain}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Public Key</p>
          <CopyableValue value={site.publicKey} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Admin Key</p>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            {site.adminKey.slice(0, 12)}••••••••
          </code>
        </div>
      </div>

      <div className="space-y-3 sm:col-span-2">
        <div>
          <p className="text-xs text-muted-foreground">Hosted Form URL</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
              {appUrl}/t/{site.slug}
            </code>
            <CopyButton value={`${appUrl}/t/${site.slug}`} />
            <a
              href={`${appUrl}/t/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hosted Wall URL</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
              {appUrl}/wall/{site.slug}
            </code>
            <CopyButton value={`${appUrl}/wall/${site.slug}`} />
            <a
              href={`${appUrl}/wall/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-1 flex items-center gap-2">
      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{value}</code>
      <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}