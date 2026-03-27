import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Feels like Stripe for testimonials.",
    author: "Indie Hacker",
  },
  {
    quote: "I stopped using Notion for testimonials after this.",
    author: "SaaS Founder",
  },
  {
    quote: "Finally something that doesn't feel like a form builder.",
    author: "Developer",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-primary/50 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground">— {testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
