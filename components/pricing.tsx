import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const freeFeatures = [
  "Collect testimonials",
  "Basic organization",
  "Limited embeds",
];

const proFeatures = [
  "Unlimited testimonials",
  "Advanced organization",
  "Embeds + API",
  "Priority updates",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Simple pricing. No nonsense.
          </h2>
          <p className="text-base text-muted-foreground">
            Start free, scale when you need to. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-border relative overflow-hidden rounded-xl">
            <CardContent className="p-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Free</h3>
                <p className="text-sm text-muted-foreground">For getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="lg" className="w-full">
                Start free
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
                <p className="text-sm text-muted-foreground">For people who actually care about growth</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9</span>
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
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          No per-testimonial pricing. No weird limits.
        </p>
      </div>
    </section>
  );
}
