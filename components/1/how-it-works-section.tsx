export function HowItWorksSection() {
  const steps = [
    {
      title: "Add your site",
      description: "Create a site in seconds. Get a hosted submission form and wall of proofs.",
      code: "your-site.prooflyst.com/t/your-site",
    },
    {
      title: "Collect testimonials",
      description: "Share your form link. Let people submit their thoughts. No friction.",
      code: "people submit → you approve",
    },
    {
      title: "Embed anywhere",
      description: "Copy a snippet. Paste it on your landing page. Done.",
      code: "<script src=\"prooflyst.io/embed.js\">",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Three steps. No complexity. Start collecting proof today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative p-6 rounded-2xl border border-border bg-background"
            >
              <div className="text-sm text-muted-foreground mb-4 font-mono">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground overflow-x-auto">
                {step.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}