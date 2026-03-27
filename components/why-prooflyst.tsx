import { X, Check } from "lucide-react";

export function WhyProoflystSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Most tools collect testimonials.<br />
            We structure them.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h3 className="text-lg font-semibold mb-6 text-muted-foreground">
              Typical workflow
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-destructive flex-shrink-0" />
                Take screenshot
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-destructive flex-shrink-0" />
                Paste in Notion
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-destructive flex-shrink-0" />
                Forget it exists
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">
              With Prooflyst
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                Capture
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                Structure
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                Reuse everywhere
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <p className="text-lg font-medium text-foreground">
            Your testimonials shouldn&apos;t be dead assets.
          </p>
        </div>
      </div>
    </section>
  );
}
