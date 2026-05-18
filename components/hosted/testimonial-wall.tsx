"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MasonryGrid } from "./masonry-grid";
import { TestimonialCard } from "./testimonial-card";
import { Pagination } from "./pagination";
import { WallHeader } from "./wall-header";
import { WallFooter } from "./wall-footer";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Quote, Loader2 } from "lucide-react";

interface TestimonialItem {
  id: string;
  author: string;
  content: string;
  rating: number | null;
  created_at: string;
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
  initialPage: number;
  totalPages: number;
  totalCount: number;
}

const PAGE_SIZE = 20;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      duration: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

export function TestimonialWall({
  siteName,
  siteId,
  slug,
  branding,
  initialTestimonials,
  initialPage,
  totalPages,
  totalCount,
}: TestimonialWallProps) {
  const columns = branding?.wallColumns ?? 3;
  const cardStyle = branding?.wallCardStyle ?? "default";
  const accentColor = branding?.accentColor;
  const showRating = branding?.wallShowRating ?? true;
  const showDate = branding?.wallShowDate ?? false;
  const showAvatar = branding?.wallShowAvatar ?? true;
  const wallTheme = branding?.wallTheme ?? "auto";

  const router = useRouter();
  const searchParams = useSearchParams();

  const { setTheme } = useTheme();

  useEffect(() => {
    if (wallTheme === "light" || wallTheme === "dark") {
      setTheme(wallTheme);
    } else {
      setTheme("system");
    }
  }, [wallTheme, setTheme]);

  const urlPage = parseInt(searchParams.get("p") ?? "1", 10) || 1;
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (urlPage !== currentPage) {
      loadPage(urlPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage]);

  const loadPage = useCallback(
    async (page: number) => {
      if (page === currentPage && testimonials.length > 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/v1/public/testimonials/${siteId}?page=${page}&pageSize=${PAGE_SIZE}&sort=newest`
        );
        if (!res.ok) throw new Error("Failed to load testimonials");

        const data = await res.json();
        setTestimonials(data.testimonials);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, siteId, testimonials.length]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;

      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("p");
      } else {
        params.set("p", String(page));
      }

      const newUrl = `/wall/${slug}${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newUrl, { scroll: false });

      // Scroll to top of grid smoothly
      const gridTop = document.getElementById("testimonial-grid");
      if (gridTop) {
        const y = gridTop.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [currentPage, router, searchParams, slug, totalPages]
  );

  if (totalCount === 0) {
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
        count={totalCount}
        slug={slug}
        accentColor={accentColor}
      />

      <div className="flex-1 mx-auto w-full max-w-6xl px-6 pb-8">
        <div id="testimonial-grid" className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-24"
              >
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={accentColor ? { color: accentColor } : undefined}
                />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-24 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Failed to load testimonials.
                </p>
                <button
                  onClick={() => loadPage(currentPage)}
                  className={cn(
                    "text-sm font-medium underline underline-offset-4 transition-colors hover:text-foreground",
                    !accentColor && "text-primary"
                  )}
                  style={accentColor ? { color: accentColor } : undefined}
                >
                  Try again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`page-${currentPage}`}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MasonryGrid columns={columns}>
                  {testimonials.map((t) => (
                    <motion.div
                      key={t.id}
                      variants={cardVariants}
                      layout
                    >
                      <TestimonialCard
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
                    </motion.div>
                  ))}
                </MasonryGrid>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          accentColor={accentColor}
        />
      </div>

      <WallFooter />
    </div>
  );
}
