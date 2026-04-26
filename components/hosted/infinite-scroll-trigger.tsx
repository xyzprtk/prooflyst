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
    <div className="masonry-item">
      <div className="skeleton h-40 w-full rounded-xl" />
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

      {!hasMore && isLoading && null}

      {hasMore && (
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      )}
    </div>
  );
}