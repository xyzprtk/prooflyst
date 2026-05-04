import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  variant?: "default" | "error" | "success" | "primary";
  noChrome?: boolean;
}

export function TerminalCard({
  children,
  className,
  title = "output.log",
  variant = "default",
  noChrome = false,
}: TerminalCardProps) {
  const borderColors = {
    default: "border-white/10 dark:border-white/10",
    error: "border-destructive/20",
    success: "border-emerald-500/20",
    primary: "border-primary/20",
  };

  const titleColors = {
    default: "text-white/40",
    error: "text-destructive/60",
    success: "text-emerald-500/60",
    primary: "text-primary/60",
  };

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden bg-[#0d0d0d] dark:bg-[#0d0d0d]",
        borderColors[variant],
        className
      )}
    >
      {!noChrome && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className={cn("text-[10px] font-mono ml-2", titleColors[variant])}>
            {title}
          </span>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
