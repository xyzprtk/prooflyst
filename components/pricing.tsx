import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const starterFeatures = [
  "Up to 100 testimonials",
  "1 site",
  "Hosted submission form",
  "Moderation dashboard",
  "Community support",
];

const proFeatures = [
  "Unlimited testimonials",
  "Unlimited sites",
  "Custom domains",
  "Webhooks",
  "Priority support",
  "Remove branding",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Simple pricing
          </h2>
          <p className="text-base text-muted-foreground">
            Start free, scale when you need to. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-border relative overflow-hidden rounded-xl">
            <CardContent className="p-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Starter</h3>
                <p className="text-sm text-muted-foreground">For side projects</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {starterFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="lg" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/30 relative overflow-hidden rounded-xl">
            <div className="absolute top-0 right-0 bg-primary text-secondary text-xs font-medium px-3 py-1 rounded-bl-lg">
              Popular
            </div>
            <CardContent className="p-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="text-sm text-muted-foreground">For growing products</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-full">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
