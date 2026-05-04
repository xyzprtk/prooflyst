"use client";

export function AsciiLogo() {
  return (
    <pre className="font-mono text-[8px] sm:text-[9px] md:text-[10px] leading-[1.15] text-foreground/15 select-none whitespace-pre">
{`█████  █████  █████  █████  █████  █     █   █  █████  █████
█   █  █   █  █   █  █   █  █      █      █   █  █        █  
█████  █████  █   █  █   █  █████  █       ███  █████    █  
█      █  █   █   █  █   █  █      █        █       █    █  
█      █  █   █████  █████  █      █████    █    █████    █  `}
    </pre>
  );
}

export function AsciiBox({ width = 40, height = 12 }: { width?: number; height?: number }) {
  const top = "┌" + "─".repeat(width - 2) + "┐";
  const mid = "│" + " ".repeat(width - 2) + "│";
  const bottom = "└" + "─".repeat(width - 2) + "┘";
  const lines = [top];
  for (let i = 0; i < height - 2; i++) lines.push(mid);
  lines.push(bottom);

  return (
    <pre className="font-mono text-[8px] leading-[1.2] text-foreground/20 select-none whitespace-pre">
      {lines.join("\n")}
    </pre>
  );
}

export function AsciiArrow() {
  return (
    <span className="font-mono text-sm text-muted-foreground select-none">
      {" → "}
    </span>
  );
}

export function AsciiGridPattern() {
  return (
    <div className="absolute inset-0 ascii-grid-bg pointer-events-none" />
  );
}
