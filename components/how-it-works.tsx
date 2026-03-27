export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Collect",
      description: "Pull in testimonials from anywhere. Links, forms, Twitter, LinkedIn, email. No more screenshots. Ever.",
    },
    {
      number: "2",
      title: "Verify",
      description: "Add context to every piece of proof. Who said it, where it came from, when it was added. Because anonymous praise is just noise.",
    },
    {
      number: "3",
      title: "Organize",
      description: "Turn scattered feedback into structured assets. Group by product, feature, use-case. Find the right proof in seconds.",
    },
    {
      number: "4",
      title: "Embed",
      description: "Use your proof where it matters. Landing pages, product pages, pitches. Not buried in a folder somewhere.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            A system, not a feature.
          </h2>
          <p className="text-base text-muted-foreground">
            Most tools help you collect testimonials. Prooflyst helps you use them properly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
