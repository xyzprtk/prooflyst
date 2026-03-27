"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Copy, Check } from "lucide-react";

export default function SetupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<{
    admin_key: string;
    public_key: string;
    id: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, domain }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "Failed to create site");
        return;
      }

      setResult(data.site);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleContinue() {
    if (!result) return;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: result.admin_key }),
    });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Create Your First Site</CardTitle>
          <CardDescription>
            {result
              ? "Save these keys — the admin key won't be shown again"
              : "Set up your site to start collecting testimonials"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">Site Name</label>
                <input
                  id="name"
                  placeholder="My SaaS App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <input
                  id="slug"
                  placeholder="my-saas-app"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                  required
                />
                <p className="text-xs text-muted-foreground">Used in hosted URLs: /t/{slug || "..."}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="domain" className="text-sm font-medium">Domain</label>
                <input
                  id="domain"
                  placeholder="https://myapp.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading || !name || !slug || !domain}>
                {loading ? "Creating..." : "Create Site"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <KeyDisplay
                label="Admin Key"
                value={result.admin_key}
                copied={copied === "admin"}
                onCopy={() => copyToClipboard(result.admin_key, "admin")}
              />
              <KeyDisplay
                label="Public Key"
                value={result.public_key}
                copied={copied === "public"}
                onCopy={() => copyToClipboard(result.public_key, "public")}
              />
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Copy and save the admin key now. It will not be shown again.
              </div>
              <Button onClick={handleContinue} className="mt-2">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KeyDisplay({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-md bg-muted px-3 py-2 text-xs font-mono">
          {value}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}
