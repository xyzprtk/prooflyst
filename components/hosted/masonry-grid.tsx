import { cn } from "@/lib/utils";

interface MasonryGridProps {
  columns: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function MasonryGrid({
  columns,
  children,
  className,
}: MasonryGridProps) {
  return (
    <div
      className={cn("masonry-grid", `masonry-grid-${columns}`, className)}
    >
      {children}
    </div>
  );
}