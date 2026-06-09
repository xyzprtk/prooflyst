"use client";

import { memo } from "react";
import { LazyMotion, m, domAnimation } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  accentColor?: string;
}

interface PageItem {
  id: string;
  value: number | "ellipsis";
}

function getPageNumbers(current: number, total: number): PageItem[] {
  let ellipsisCount = 0;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      id: `page-${i + 1}`,
      value: i + 1,
    }));
  }

  const pages: PageItem[] = [];

  const push = (v: number | "ellipsis") => {
    const id = v === "ellipsis" ? `ellipsis-${++ellipsisCount}` : `page-${v}`;
    pages.push({ id, value: v });
  };

  if (current <= 4) {
    for (let i = 1; i <= 5; i++) push(i);
    push("ellipsis");
    push(total);
  } else if (current >= total - 3) {
    push(1);
    push("ellipsis");
    for (let i = total - 4; i <= total; i++) push(i);
  } else {
    push(1);
    push("ellipsis");
    for (let i = current - 1; i <= current + 1; i++) push(i);
    push("ellipsis");
    push(total);
  }

  return pages;
}

function PageButton({
  page,
  isActive,
  onClick,
  accentColor,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
  accentColor?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
    <m.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors",
        isActive
          ? "text-white shadow-md"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      style={
        isActive && accentColor
          ? { backgroundColor: accentColor }
          : isActive
            ? { backgroundColor: "hsl(var(--primary))" }
            : undefined
      }
      aria-label={`Page ${page}`}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <m.div
          layoutId="activePageIndicator"
          className="absolute inset-0 rounded-xl"
          style={
            accentColor
              ? { backgroundColor: accentColor }
              : { backgroundColor: "hsl(var(--primary))" }
          }
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </m.button>
    </LazyMotion>
  );
}

function Ellipsis() {
  return (
    <span className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground">
      &hellip;
    </span>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  accentColor,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  accentColor?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <m.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
        disabled
          ? "text-muted-foreground/40 cursor-not-allowed"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
    >
      <Icon className="h-4 w-4" />
    </m.button>
  );
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  accentColor,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-8"
      aria-label="Pagination"
    >
      <ArrowButton
        direction="prev"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        accentColor={accentColor}
      />

      <div className="flex items-center gap-1">
        {pages.map((page) => {
          if (page.value === "ellipsis") {
            return <Ellipsis key={page.id} />;
          }
          const pageNumber = page.value;
          return (
            <PageButton
              key={page.id}
              page={pageNumber}
              isActive={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber)}
              accentColor={accentColor}
            />
          );
        })}
      </div>

      <ArrowButton
        direction="next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        accentColor={accentColor}
      />
    </nav>
  );
});
