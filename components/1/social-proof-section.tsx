import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonials = [
  {
    quote: "This space is reserved for our very first user. Will it be you?",
    author: "The Prooflyst Team",
  },
  {
    quote: "Imagine your best customer saying something amazing about your product right here.",
    author: "Future You",
  },
  {
    quote: "We built this because collecting feedback shouldn't require a messy spreadsheet.",
    author: "The Prooflyst Team",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-24 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            What people are saying
          </h2>
          <p className="text-sm text-muted-foreground">
            Real testimonials from real users. Coming soon.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="text-4xl text-primary/20 absolute top-4 right-4 font-serif">
                &rdquo;
              </div>
              <blockquote className="text-sm mb-4 text-foreground/90 leading-relaxed">
                {testimonial.quote}
              </blockquote>
              <cite className="text-xs text-muted-foreground not-italic">
                — {testimonial.author}
              </cite>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="rounded-full text-base px-8 h-11" render={<Link href="/dashboard/setup" />}>
            This could be yours
          </Button>
        </div>
      </div>
    </section>
  );
}