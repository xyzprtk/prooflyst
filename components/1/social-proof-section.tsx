import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SocialProofSection() {
  return (
    <section className="py-20 border-y border-border/50 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-lg md:text-xl text-foreground mb-8 max-w-2xl mx-auto">
          Built for developers and product teams who care about the details.
        </p>
        <Button variant="outline" size="lg" className="rounded-full px-8 h-11" render={<Link href="/dashboard/setup" />}>
          See it in action
        </Button>
      </div>
    </section>
  );
}