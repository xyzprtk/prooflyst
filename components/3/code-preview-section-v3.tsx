"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "./motion-utils";

export function CodePreviewSectionV3() {
  return (
    <section id="api" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-none text-xs font-mono">
                $ dev --first
              </Badge>
              <h2 className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-6">
                Built for people who hate forms.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                If your first instinct is &quot;can I just use an API?&quot; — yes.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No bloated dashboards. No unnecessary steps. Just clean data you can actually use.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="relative border-white/10 rounded-xl bg-[#0d0d0d] overflow-hidden scanlines">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] text-white/30 ml-2 font-mono">example.ts</span>
              </div>
              <CardContent className="p-0">
                <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed">
                  <code className="text-white/70">
{`// Drop it in. That's it.
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
