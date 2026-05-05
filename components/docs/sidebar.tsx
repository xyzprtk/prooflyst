"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "authentication", label: "Authentication" },
  { id: "sites", label: "Sites" },
  { id: "testimonials", label: "Testimonials" },
  { id: "public-api", label: "Public API" },
  { id: "errors", label: "Errors" },
  { id: "sdk", label: "SDK" },
];

export function DocsSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 overflow-y-auto h-[calc(100vh-8rem)] pr-4">
        <nav className="space-y-1">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {section.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground mb-3 px-3">Resources</p>
          <nav className="space-y-1">
            <a
              href="https://github.com/xyzprtk/prooflyst"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              GitHub
            </a>
            <a
              href="/dashboard/setup"
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Dashboard
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
}
