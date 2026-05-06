"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight, AlertCircle, Globe, Tag, Building2 } from "lucide-react";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

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
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
        setLoading(false);
        return;
      }

      setResult(data.site);
    } catch {
      setError("Something went wrong");
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

  function inputIconClass(field: string) {
    return focusedField === field ? "text-primary" : "text-muted-foreground";
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/[0.03] blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 -bottom-40 h-[32rem] w-[32rem] rounded-full bg-primary/[0.02] blur-[120px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl shadow-black/[0.03]">
          <div className="px-10 pt-12 pb-10">
            {/* Logo */}
            <motion.div
              className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.02] ring-1 ring-primary/10"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative h-7 w-7">
                <Image src="/logos/logo-dark.png" alt="Prooflyst" width={28} height={28} className="absolute inset-0 block dark:hidden" />
                <Image src="/logos/logo-light.png" alt="Prooflyst" width={28} height={28} className="absolute inset-0 hidden dark:block" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-xl font-semibold tracking-tight">
                {result ? "Your site is ready" : "Create your first site"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {result
                  ? "Save these keys — the admin key won't be shown again"
                  : "Set up your site to start collecting testimonials"}
              </p>
            </motion.div>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                  >
                    {/* Site Name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex flex-col gap-2.5"
                    >
                      <label htmlFor="name" className="text-sm font-medium">Site Name</label>
                      <div className="relative">
                        <Building2 className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${inputIconClass("name")}`} />
                        <input
                          id="name" placeholder="My SaaS App" value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent pl-11 pr-3 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Slug */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28, duration: 0.4 }}
                      className="flex flex-col gap-2.5"
                    >
                      <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                      <div className="relative">
                        <Tag className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${inputIconClass("slug")}`} />
                        <input
                          id="slug" placeholder="my-saas-app" value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          onFocus={() => setFocusedField("slug")}
                          onBlur={() => setFocusedField(null)}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent pl-11 pr-3 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring font-mono"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Used in hosted URLs: /t/{slug || "..."}</p>
                    </motion.div>

                    {/* Domain */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, duration: 0.4 }}
                      className="flex flex-col gap-2.5"
                    >
                      <label htmlFor="domain" className="text-sm font-medium">Domain</label>
                      <div className="relative">
                        <Globe className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${inputIconClass("domain")}`} />
                        <input
                          id="domain" placeholder="https://myapp.com" value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          onFocus={() => setFocusedField("domain")}
                          onBlur={() => setFocusedField(null)}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent pl-11 pr-3 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring"
                          required
                        />
                      </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="flex items-center gap-1.5 text-sm text-destructive">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.44, duration: 0.4 }}
                    >
                      <Button
                        type="submit"
                        disabled={loading || !name || !slug || !domain}
                        className="w-full h-11 gap-2 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-px active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {loading ? (
                            <motion.span key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                              Creating...
                            </motion.span>
                          ) : (
                            <motion.span key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                              Create Site
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-5"
                  >
                    <KeyDisplay label="Admin Key" value={result.admin_key} copied={copied === "admin"} onCopy={() => copyToClipboard(result.admin_key, "admin")} />
                    <KeyDisplay label="Public Key" value={result.public_key} copied={copied === "public"} onCopy={() => copyToClipboard(result.public_key, "public")} />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="rounded-xl bg-destructive/8 px-4 py-3 text-xs text-destructive border border-destructive/10 flex items-start gap-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      Copy and save the admin key now. It will not be shown again.
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
                      <Button onClick={handleContinue} className="w-full h-11 gap-2 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-px active:translate-y-0">
                        Continue to Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

function KeyDisplay({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-xl bg-muted/70 px-4 py-3 text-xs font-mono border border-border/40">{value}</code>
        <Button variant="outline" size="icon" onClick={onCopy} className="h-11 w-11 rounded-xl shrink-0 transition-all duration-200 hover:bg-primary/5 hover:border-primary/20">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Check className="h-4 w-4 text-green-600" />
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Copy className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
}
