"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy } from "lucide-react";
import { ReactNode } from "react";

interface CodeBlockProps {
  language: string;
  title?: string;
  children: ReactNode;
}

export function CodeBlock({ language, title, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeText = typeof children === "string" ? children : "";

  const handleCopy = async () => {
    if (!codeText) return;
    await navigator.clipboard.writeText(codeText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border/40 bg-muted/40 overflow-hidden my-6 group">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/60">
        <div className="flex items-center gap-2">
          {title && (
            <span className="text-[11px] font-mono text-muted-foreground">{title}</span>
          )}
          <span className="text-[10px] font-mono text-muted-foreground/60">{language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-emerald-500"
              >
                <Check className="h-3 w-3" />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="h-3 w-3" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
        <code className="text-foreground/85">{children}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm text-foreground/90">
      {children}
    </code>
  );
}

export function Endpoint({ method, path }: { method: string; path: string }) {
  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    PATCH: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    DELETE: "bg-red-500/10 text-red-600 dark:text-red-400",
    PUT: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 font-mono text-sm mb-4"
    >
      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${methodColors[method] || "bg-muted text-foreground"}`}>
        {method}
      </span>
      <span className="text-muted-foreground">{path}</span>
    </motion.div>
  );
}

export function ParameterTable({ params }: { params: { name: string; type: string; required: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-muted/40">
            <th className="text-left py-2.5 px-3 font-medium text-muted-foreground text-xs">Parameter</th>
            <th className="text-left py-2.5 px-3 font-medium text-muted-foreground text-xs">Type</th>
            <th className="text-left py-2.5 px-3 font-medium text-muted-foreground text-xs">Required</th>
            <th className="text-left py-2.5 px-3 font-medium text-muted-foreground text-xs">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <motion.tr
              key={p.name}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              className="border-b border-border/20 hover:bg-muted/30 transition-colors"
            >
              <td className="py-2.5 px-3 font-mono text-xs">{p.name}</td>
              <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{p.type}</td>
              <td className="py-2.5 px-3">
                <span className={p.required === "Yes" ? "text-emerald-600 dark:text-emerald-400 text-xs font-medium" : "text-muted-foreground text-xs"}>
                  {p.required}
                </span>
              </td>
              <td className="py-2.5 px-3 text-muted-foreground text-sm">{p.description}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
