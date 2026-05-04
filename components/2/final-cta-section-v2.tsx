import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTASectionV2() {
  return (
    <section className="py-40 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6">
          Your product already has proof.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          You just haven&apos;t structured it yet.
        </p>
        <Button
          size="lg"
          className="rounded-full text-base px-8 h-11 mb-6"
          render={<Link href="/dashboard/setup" />}
        >
          Start building your proof system
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <div>
          <Link
            href="https://github.com/xyzprtk/prooflyst"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Or read the docs →
          </Link>
        </div>
      </div>
    </section>
  );
}
