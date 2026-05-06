"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { KeyRound, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Invalid admin key");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient background orbs */}
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

      {/* Dot grid */}
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
              <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your admin key to access the dashboard
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-col gap-2.5"
              >
                <label htmlFor="admin-key" className="text-sm font-medium">Admin Key</label>
                <motion.div
                  className="relative"
                  animate={error ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <KeyRound
                    className={cn(
                      "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                      focused ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <input
                    id="admin-key"
                    type={showKey ? "text" : "password"}
                    placeholder="pl_admin_..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="flex h-11 w-full rounded-xl border border-input bg-transparent pl-11 pr-10 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:border-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {focused && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.6 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.6 }}
                        transition={{ duration: 0.25 }}
                        className="pointer-events-none absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
                      />
                    )}
                  </AnimatePresence>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !key.startsWith("pl_admin_")}
                  className="w-full h-11 gap-2 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-px active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Verifying...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        Sign In
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-muted-foreground"
              >
                Don&apos;t have a key?{" "}
                <a href="/dashboard/setup" className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-foreground transition-colors duration-200">
                  Create your first site
                  <Sparkles className="h-3 w-3" />
                </a>
              </motion.p>
            </form>
          </div>

          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
