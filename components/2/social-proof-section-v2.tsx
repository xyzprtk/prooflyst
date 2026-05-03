export function SocialProofSectionV2() {
  return (
    <section className="py-32 border-y border-border/30">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <blockquote className="text-3xl md:text-4xl font-medium tracking-tight text-foreground/90 leading-tight mb-10">
          &ldquo;This completely changed how we handle customer feedback. No more scattered screenshots, no more messy spreadsheets. Just clean, structured proof.&rdquo;
        </blockquote>

        <div className="flex items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">SC</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">Product Lead, TechCorp</p>
          </div>
        </div>
      </div>
    </section>
  );
}
