import { Card, CardContent } from "@/components/ui/card";
import { Code, Shield, Database, Webhook, Globe, LayoutGrid } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Clean REST API",
    description: "Intuitive endpoints with predictable responses. JSON in, JSON out. No surprises.",
  },
  {
    icon: Shield,
    title: "API Key Auth",
    description: "Simple key-based authentication. Public keys for submission, admin keys for management.",
  },
  {
    icon: Database,
    title: "PostgreSQL + Drizzle",
    description: "Your data lives in Postgres. Type-safe ORM with migrations. Export anytime.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Get notified when testimonials arrive. Slack, Discord, or your own endpoint.",
  },
  {
    icon: Globe,
    title: "Hosted Pages",
    description: "Get instant submission forms and testimonial walls at your custom domain.",
  },
  {
    icon: LayoutGrid,
    title: "Moderation",
    description: "Approve, reject, or edit testimonials before they go live. Full control.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-base text-muted-foreground">
            Built for developers who want control. No bloat, no lock-in.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="group border-border rounded-xl bg-background hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
