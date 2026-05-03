"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
  accentColor?: string;
  disabled?: boolean;
}

export function StarRating({
  value,
  onChange,
  accentColor,
  disabled = false,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = value !== null && value >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={cn(
              "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              "hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={isSelected}
          >
            <Star
              className={cn(
                "h-6 w-6",
                isSelected && !accentColor && "text-primary"
              )}
              fill={isSelected ? (accentColor ?? "currentColor") : "transparent"}
              stroke={isSelected ? (accentColor ?? "currentColor") : "currentColor"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}