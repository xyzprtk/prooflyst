import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function CodePreviewSection() {
  return (
    <section id="api" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-none">
              Developer Experience
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              API so clean, it documents itself
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              No SDK required. Just HTTP requests. But we have one if you want it.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Predictable REST</h4>
                  <p className="text-sm text-muted-foreground">Standard HTTP methods and status codes</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">TypeScript Ready</h4>
                  <p className="text-sm text-muted-foreground">Full type definitions for all responses</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Cursor Pagination</h4>
                  <p className="text-sm text-muted-foreground">Efficient listing with next_cursor tokens</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-2xl" />
            <Card className="relative border-border rounded-xl bg-[#111113] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">example.ts</span>
              </div>
              <CardContent className="p-0">
                <pre className="p-6 text-sm font-mono overflow-x-auto">
                  <code className="text-slate-300">
{`// Submit a testimonial
const response = await fetch(
  'https://api.prooflyst.com/v1/testimonials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    site_id: 'site_abc123',
    public_key: 'pl_pub_xxx',
    author: 'Sarah Chen',
    content: 'Amazing product!',
    rating: 5
  }),
});

const data = await response.json();
// { success: true, message: "Testimonial submitted." }`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
