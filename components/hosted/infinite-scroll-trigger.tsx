"use client";

import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollTriggerProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  columns: 2 | 3 | 4;
}

function SkeletonCard() {
  return (
    <div className="masonry-item mb-4">
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="skeleton h-3 w-20 mb-4 rounded" />
        <div className="skeleton h-4 w-full mb-2 rounded" />
        <div className="skeleton h-4 w-3/4 mb-4 rounded" />
        <div className="flex items-center gap-2.5">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

export function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
  columns,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!hasMore) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, handleIntersect]);

  if (!hasMore && !isLoading) return null;

  return (
    <div aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <div className={`masonry-grid masonry-grid-${columns} mt-4`}>
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      )}
    </div>
  );
}