export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Prooflyst
        </h1>
        <p className="text-lg text-muted-foreground">
          Developer-first API to collect, manage, and serve testimonials —
          designed to power both modern applications and future AI systems.
        </p>
        <div className="flex gap-3">
          <a
            href="/api/v1"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            API Docs
          </a>
          <a
            href="https://github.com/prooflyst"
            className="inline-flex h-10 items-center rounded-md border bg-background px-6 text-sm font-medium hover:bg-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
