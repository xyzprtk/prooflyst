import { Logo } from "@/components/logo";
import Link from "next/link";

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
    <>
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Prooflyst
            </span>
          </Link>
          <a
            href={`/t/${slug}`}
            className="rounded-full px-5 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: accentColor,
              color: "white",
            }}
          >
            Share your experience
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading ?? `What people say about ${siteName}`}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {count} testimonial{count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}