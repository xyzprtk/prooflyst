import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const freeFeatures = [
  "Unlimited testimonials",
  "Hosted collection form",
  "Basic embed widget",
  "Community support",
];

const proFeatures = [
  "Everything in Free",
  "API access",
  "Custom domains",
  "Priority support",
  "Advanced analytics",
];

export function PricingSectionV2() {
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Simple pricing. No nonsense.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Start free, scale when you need to. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-border/60 relative overflow-hidden rounded-xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Free</h3>
                <p className="text-sm text-muted-foreground">
                  For getting started
                </p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$0</span>
                <span className="text-muted-foreground text-sm ml-2">
                  forever
                </span>
              </div>
              <ul className="space-y-4 mb-10">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full"
              >
                Start free
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 relative overflow-hidden rounded-xl bg-primary/[0.02]">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
              Popular
            </div>
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">Pro</h3>
                <p className="text-sm text-muted-foreground">
                  For people who actually care about growth
                </p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$9</span>
                <span className="text-muted-foreground text-sm ml-2">
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-10">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-full rounded-full">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
