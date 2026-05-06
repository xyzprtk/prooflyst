"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "./copy-button";

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

const easeOut = [0.22, 1, 0.36, 1] as const;

export function SiteOverview({ site, appUrl }: SiteOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut, delay: 0.2 }}
      className="grid gap-6 sm:grid-cols-2"
    >
      <div className="space-y-4">
        <Field label="Site Name" value={site.name} />
        <Field label="Slug" value={site.slug} mono />
        <Field label="Domain" value={site.domain} />
      </div>

      <div className="space-y-4">
        <CopyableField label="Public Key" value={site.publicKey} />
        <div>
          <p className="text-xs text-muted-foreground mb-1">Admin Key</p>
          <code className="rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">pl_admin_••••••••</code>
          <p className="mt-1 text-xs text-muted-foreground">Full key was shown during setup and cannot be recovered</p>
        </div>
      </div>

      <div className="space-y-4 sm:col-span-2">
        <UrlField label="Hosted Form URL" url={`${appUrl}/t/${site.slug}`} />
        <UrlField label="Hosted Wall URL" url={`${appUrl}/wall/${site.slug}`} />
      </div>
    </motion.div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={mono ? "font-mono text-sm" : "text-sm font-medium"}>{value}</p>
    </div>
  );
}

function CopyableField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <code className="rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">{value}</code>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function UrlField({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <code className="rounded-xl bg-muted/70 px-3 py-2 font-mono text-xs border border-border/40">{url}</code>
        <CopyButton value={url} />
        <motion.a
          href={url}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </motion.a>
      </div>
    </div>
  );
}
