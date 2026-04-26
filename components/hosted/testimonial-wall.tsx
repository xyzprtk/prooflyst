"use client";

import { useState, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { MasonryGrid } from "./masonry-grid";
import { TestimonialCard } from "./testimonial-card";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { WallHeader } from "./wall-header";
import { WallFooter } from "./wall-footer";

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
  const accentColor = branding?.accentColor ?? "#6366f1";
  const showRating = branding?.wallShowRating ?? true;
  const showDate = branding?.wallShowDate ?? false;
  const showAvatar = branding?.wallShowAvatar ?? true;

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
      <div
        className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12"
        style={{ "--accent-color": accentColor } as React.CSSProperties}
      >
        <div className="flex flex-col gap-8">
          <WallHeader
            siteName={siteName}
            heading={branding?.heading}
            count={0}
            slug={slug}
            accentColor={accentColor}
          />

          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No testimonials yet.
            </p>
            <a
              href={`/t/${slug}`}
              className="text-sm underline underline-offset-4 transition-colors hover:text-foreground"
              style={{ color: accentColor }}
            >
              Be the first to share your experience
            </a>
          </div>

          <WallFooter accentColor={accentColor} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12"
      style={{ "--accent-color": accentColor } as React.CSSProperties}
    >
      <div className="flex flex-col gap-8">
        <WallHeader
          siteName={siteName}
          heading={branding?.heading}
          count={initialCount}
          slug={slug}
          accentColor={accentColor}
        />

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
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load more testimonials.
            </p>
            <button
              onClick={handleRetry}
              className="text-sm underline underline-offset-4 transition-colors hover:text-foreground"
              style={{ color: accentColor }}
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

        <WallFooter accentColor={accentColor} />
      </div>
    </div>
  );
}