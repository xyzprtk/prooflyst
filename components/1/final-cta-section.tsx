import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Your product already has proof.
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            You just haven&apos;t structured it yet.
          </p>
          <Button size="lg" className="rounded-full text-base px-8 h-11" render={<Link href="/dashboard/setup" />}>
            Start building your proof system
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}