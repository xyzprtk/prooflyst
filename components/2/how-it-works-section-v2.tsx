import { IsometricBrowser, IsometricForm, IsometricEmbed } from "./isometric-illustrations";

const steps = [
  {
    number: "01",
    title: "Add your site",
    description: "Create a site in seconds. Get a hosted submission form and a wall of proofs ready to go.",
    illustration: IsometricBrowser,
  },
  {
    number: "02",
    title: "Collect testimonials",
    description: "Share your form link. Let people submit their thoughts. No friction, no follow-ups.",
    illustration: IsometricForm,
  },
  {
    number: "03",
    title: "Embed anywhere",
    description: "Copy a snippet. Paste it on your landing page. Your proof system goes live instantly.",
    illustration: IsometricEmbed,
  },
];

export function HowItWorksSectionV2() {
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three steps. No complexity. Start collecting proof today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-px bg-border/30" />

          {steps.map((step) => {
            const Illustration = step.illustration;
            return (
              <div key={step.number} className="relative">
                <div className="mb-8">
                  <Illustration />
                </div>
                <div className="text-sm font-mono text-muted-foreground mb-3">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
