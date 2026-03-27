import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Your product already has proof.
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            You just haven&apos;t structured it yet.
          </p>
          <Button size="lg" className="text-base px-8">
            Start building your proof system
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
