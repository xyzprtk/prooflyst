interface WallFooterProps {
  accentColor?: string;
}

export function WallFooter({ accentColor }: WallFooterProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://prooflyst.com";

  return (
    <footer className="pt-8 text-center text-xs text-muted-foreground">
      Powered by{" "}
      <a
        href={appUrl}
        className="underline underline-offset-4 transition-colors hover:text-foreground"
        style={accentColor ? { color: accentColor } : undefined}
      >
        Prooflyst
      </a>
    </footer>
  );
}