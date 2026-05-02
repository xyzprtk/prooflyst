import { Logo } from "@/components/logo";

interface WallFooterProps {
  accentColor?: string;
}

export function WallFooter({ accentColor }: WallFooterProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://prooflyst.com";

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={appUrl}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Logo size={20} />
            <span className="text-sm font-medium">Prooflyst</span>
          </a>
          <p className="text-xs text-muted-foreground">
            Collect &amp; showcase testimonials
          </p>
        </div>
      </div>
    </footer>
  );
}