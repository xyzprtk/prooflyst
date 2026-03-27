export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Create a site",
      description: "One API call. Get your admin key, public key, and hosted URLs instantly.",
    },
    {
      number: "2",
      title: "Collect feedback",
      description: "Use our hosted form or build your own. Submit via API with your public key.",
    },
    {
      number: "3",
      title: "Display anywhere",
      description: "Fetch approved testimonials via API. Render them however you want.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Three steps to testimonial bliss
          </h2>
          <p className="text-lg text-muted-foreground">
            From signup to production in under 10 minutes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent -translate-x-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
