import { Check } from "lucide-react";

export function WhyProoflystSection() {
  const problems = [
    "Screenshots get lost in folders",
    "Notion tables are hard to share",
    "Random forms lack structure",
    "No easy way to embed",
  ];

  const solutions = [
    "Structured storage, searchable",
    "Shareable walls with one link",
    "Rich context for every testimonial",
    "Drop-in embed widgets",
  ];

  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Why Prooflyst
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Stop managing testimonials like it's 2015.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div className="p-8 rounded-2xl border border-border bg-background">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Old way</span>
            </div>
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li key={problem} className="flex items-start gap-3 text-sm">
                  <span className="text-red-500 mt-0.5">×</span>
                  <span className="text-muted-foreground">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">Prooflyst way</span>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution) => (
                <li key={solution} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-foreground">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}