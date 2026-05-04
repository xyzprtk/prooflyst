import { ReactNode } from "react";

interface CodeBlockProps {
  language: string;
  title?: string;
  children: ReactNode;
}

export function CodeBlock({ language, title, children }: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-[#0d0d0d] dark:bg-[#0d0d0d] overflow-hidden my-6">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] font-mono text-white/40 ml-2">{title}</span>
          <span className="text-[10px] font-mono text-white/20 ml-auto">{language}</span>
        </div>
      )}
      <pre className="p-5 text-sm font-mono overflow-x-auto leading-relaxed">
        <code className="text-white/80">{children}</code>
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
    GET: "text-emerald-400",
    POST: "text-blue-400",
    PATCH: "text-yellow-400",
    DELETE: "text-red-400",
    PUT: "text-purple-400",
  };

  return (
    <div className="flex items-center gap-3 font-mono text-sm mb-4">
      <span className={methodColors[method] || "text-white"}>{method}</span>
      <span className="text-white/60">{path}</span>
    </div>
  );
}

export function ParameterTable({ params }: { params: { name: string; type: string; required: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Parameter</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Required</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-border/30">
              <td className="py-2.5 px-3 font-mono text-xs">{p.name}</td>
              <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{p.type}</td>
              <td className="py-2.5 px-3">
                <span className={p.required === "Yes" ? "text-emerald-400 text-xs" : "text-muted-foreground text-xs"}>
                  {p.required}
                </span>
              </td>
              <td className="py-2.5 px-3 text-muted-foreground">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
