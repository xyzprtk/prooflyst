interface WallHeaderProps {
  siteName: string;
  heading?: string;
  count: number;
  slug: string;
  accentColor?: string;
}

export function WallHeader({
  siteName,
  heading,
  count,
  slug,
  accentColor = "#6366f1",
}: WallHeaderProps) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        {heading ?? `What people say about ${siteName}`}
      </h1>
      <p className="text-muted-foreground">
        {count} testimonial{count !== 1 ? "s" : ""}
      </p>
      <a
        href={`/t/${slug}`}
        className="mt-2 text-sm underline underline-offset-4 transition-colors hover:text-foreground"
        style={{ color: accentColor }}
      >
        Share your experience
      </a>
    </div>
  );
}