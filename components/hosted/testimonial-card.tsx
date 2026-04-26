import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface TestimonialCardProps {
  id: string;
  author: string;
  content: string;
  rating?: number | null;
  createdAt?: Date | null;
  cardStyle?: "default" | "minimal" | "bordered";
  showRating?: boolean;
  showDate?: boolean;
  showAvatar?: boolean;
  accentColor?: string;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function Avatar({
  name,
  accentColor,
}: {
  name: string;
  accentColor: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium accent-bg-muted"
      style={{ color: accentColor }}
    >
      {initials}
    </div>
  );
}

function StarDisplay({
  rating,
  accentColor,
}: {
  rating: number;
  accentColor: string;
}) {
  return (
    <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = rating >= star;
        return (
          <Star
            key={star}
            className="h-3 w-3"
            fill={isFilled ? accentColor : "transparent"}
            stroke={isFilled ? accentColor : "currentColor"}
            strokeWidth={isFilled ? 2.5 : 1.5}
          />
        );
      })}
    </div>
  );
}

export function TestimonialCard({
  content,
  author,
  rating,
  createdAt,
  cardStyle = "default",
  showRating = true,
  showDate = false,
  showAvatar = true,
  accentColor = "#6366f1",
}: TestimonialCardProps) {
  const displayRating = showRating && rating ? rating : null;
  const displayDate = showDate && createdAt ? formatRelativeDate(new Date(createdAt)) : null;

  if (cardStyle === "minimal") {
    return (
      <article className="masonry-item card-minimal" aria-label={`Testimonial from ${author}`}>
        <p className="line-clamp-10 text-foreground leading-relaxed">
          &ldquo;{content}&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-2">
          {showAvatar && <Avatar name={author} accentColor={accentColor} />}
          <span className="text-sm font-medium">{author}</span>
          {displayDate && (
            <span className="text-xs text-muted-foreground">{displayDate}</span>
          )}
          {displayRating && (
            <StarDisplay rating={displayRating} accentColor={accentColor} />
          )}
        </div>
      </article>
    );
  }

  if (cardStyle === "bordered") {
    return (
      <article
        className="masonry-item card-bordered"
        style={{ borderLeftColor: accentColor }}
        aria-label={`Testimonial from ${author}`}
      >
        <p className="line-clamp-10 text-card-foreground leading-relaxed">
          &ldquo;{content}&rdquo;
        </p>
        <div className="mt-4 flex items-center gap-2">
          {showAvatar && <Avatar name={author} accentColor={accentColor} />}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{author}</span>
            {displayDate && (
              <span className="text-xs text-muted-foreground">{displayDate}</span>
            )}
          </div>
          {displayRating && (
            <div className="ml-auto">
              <StarDisplay rating={displayRating} accentColor={accentColor} />
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className="masonry-item card-default"
      aria-label={`Testimonial from ${author}`}
    >
      {displayRating && (
        <div className="mb-2">
          <StarDisplay rating={displayRating} accentColor={accentColor} />
        </div>
      )}
      <p className="line-clamp-10 text-card-foreground leading-relaxed">
        &ldquo;{content}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2">
        {showAvatar && <Avatar name={author} accentColor={accentColor} />}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{author}</span>
          {displayDate && (
            <span className="text-xs text-muted-foreground">{displayDate}</span>
          )}
        </div>
      </div>
    </article>
  );
}