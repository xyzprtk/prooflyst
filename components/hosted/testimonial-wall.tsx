"use client";

import { useState, useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { MasonryGrid } from "./masonry-grid";
import { TestimonialCard } from "./testimonial-card";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { WallHeader } from "./wall-header";
import { WallFooter } from "./wall-footer";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Quote } from "lucide-react";

interface TestimonialItem {
  id: string;
  author: string;
  content: string;
  rating: number | null;
  created_at: string;
}

interface ApiResponse {
  testimonials: TestimonialItem[];
  next_cursor: string | null;
  has_more: boolean;
}

interface BrandingConfig {
  heading?: string;
  accentColor?: string;
  wallLayout?: "grid" | "list";
  wallColumns?: 2 | 3 | 4;
  wallCardStyle?: "default" | "minimal" | "bordered";
  wallShowRating?: boolean;
  wallShowDate?: boolean;
  wallShowAvatar?: boolean;
  wallTheme?: "light" | "dark" | "auto";
}

interface TestimonialWallProps {
  siteName: string;
  siteId: string;
  slug: string;
  branding: BrandingConfig | null;
  initialTestimonials: TestimonialItem[];
  nextCursor: string | null;
  initialCount: number;
}

const PAGE_SIZE = 12;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TestimonialWall({
  siteName,
  siteId,
  slug,
  branding,
  initialTestimonials,
  nextCursor: initialNextCursor,
  initialCount,
}: TestimonialWallProps) {
  const columns = branding?.wallColumns ?? 3;
  const cardStyle = branding?.wallCardStyle ?? "default";
  const accentColor = branding?.accentColor;
  const showRating = branding?.wallShowRating ?? true;
  const showDate = branding?.wallShowDate ?? false;
  const showAvatar = branding?.wallShowAvatar ?? true;
  const wallTheme = branding?.wallTheme ?? "auto";

  const { setTheme } = useTheme();

  useEffect(() => {
    if (wallTheme === "light" || wallTheme === "dark") {
      setTheme(wallTheme);
    } else {
      setTheme("system");
    }
  }, [wallTheme, setTheme]);

  const [retryCount, setRetryCount] = useState(0);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: ApiResponse | null) => {
      if (pageIndex === 0) return null;
      if (previousPageData && !previousPageData.has_more) return null;

      const cursor = previousPageData?.next_cursor ?? initialNextCursor;
      if (!cursor) return null;

      return `/api/v1/public/testimonials/${siteId}?limit=${PAGE_SIZE}&sort=newest&cursor=${cursor}`;
    },
    [siteId, initialNextCursor]
  );

  const { data, size, setSize, error, isValidating } = useSWRInfinite<
    ApiResponse
  >(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const allTestimonials = [
    ...initialTestimonials,
    ...(data?.flatMap((page) => page.testimonials) ?? []),
  ];

  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage ? lastPage.has_more : initialNextCursor !== null;

  const handleLoadMore = useCallback(() => {
    setSize(size + 1);
  }, [size, setSize]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  if (allTestimonials.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <WallHeader
          siteName={siteName}
          heading={branding?.heading}
          count={0}
          slug={slug}
          accentColor={accentColor}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 text-center px-6">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl",
                !accentColor && "bg-primary/10"
              )}
              {...(accentColor ? { style: { backgroundColor: `${accentColor}12` } } : {})}
            >
              <Quote
                className="h-7 w-7"
                {...(accentColor ? { style: { color: accentColor } } : { className: "text-primary" })}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-2">
                No testimonials yet
              </h2>
              <p className="text-muted-foreground max-w-sm">
                Be the first to share your experience with {siteName}.
              </p>
            </div>
            <a
              href={`/t/${slug}`}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
                !accentColor && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              {...(accentColor ? { style: { backgroundColor: accentColor, color: "white" } } : {})}
            >
              Share your experience
            </a>
          </div>
        </div>
        <WallFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <WallHeader
        siteName={siteName}
        heading={branding?.heading}
        count={initialCount}
        slug={slug}
        accentColor={accentColor}
      />

      <div className="flex-1 mx-auto w-full max-w-6xl px-6 pb-16">
        <MasonryGrid columns={columns}>
          {allTestimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              id={t.id}
              author={t.author}
              content={t.content}
              rating={t.rating}
              createdAt={t.created_at ? new Date(t.created_at) : null}
              cardStyle={cardStyle}
              showRating={showRating}
              showDate={showDate}
              showAvatar={showAvatar}
              accentColor={accentColor}
            />
          ))}
        </MasonryGrid>

        {error && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load more testimonials.
            </p>
            <button
              onClick={handleRetry}
              className={cn(
                "text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground",
                !accentColor && "text-primary"
              )}
              {...(accentColor ? { style: { color: accentColor } } : {})}
            >
              Try again
            </button>
          </div>
        )}

        <InfiniteScrollTrigger
          hasMore={hasMore}
          isLoading={isValidating}
          onLoadMore={handleLoadMore}
          columns={columns}
        />
      </div>

      <WallFooter />
    </div>
  );
}