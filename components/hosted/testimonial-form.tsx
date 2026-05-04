"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TestimonialFormProps {
  siteId: string;
  publicKey: string;
  siteName: string;
  accentColor?: string;
  thankYouMessage: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function TestimonialForm({
  siteId,
  publicKey,
  siteName,
  accentColor,
  thankYouMessage,
}: TestimonialFormProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const authorError =
    author.length > 0 && author.length < 1
      ? "Author name is required"
      : author.length > 100
        ? "Author name must be 100 characters or less"
        : null;

  const contentError =
    content.length > 0 && content.length < 1
      ? "Content is required"
      : content.length > 2000
        ? "Content must be 2000 characters or less"
        : null;

  const canSubmit =
    formState === "idle" &&
    author.length >= 1 &&
    author.length <= 100 &&
    content.length >= 1 &&
    content.length <= 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setFormState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/v1/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteId,
          public_key: publicKey,
          author,
          content,
          rating: rating ?? undefined,
        }),
      });

      if (response.ok) {
        setFormState("success");
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(
          data.message || data.error || "Something went wrong. Please try again."
        );
        setFormState("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            !accentColor && "bg-primary/10"
          )}
          {...(accentColor ? { style: { backgroundColor: `${accentColor}20` } } : {})}
        >
          <Check
            className="h-8 w-8"
            {...(accentColor ? { style: { color: accentColor } } : { className: "text-primary" })}
          />
        </div>
        <p className="text-lg font-medium">{thankYouMessage}</p>
        <p className="text-sm text-muted-foreground">
          Want to collect testimonials for your product?{" "}
          <a
            href={process.env.NEXT_PUBLIC_APP_URL}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Try Prooflyst
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="author" className="text-sm font-medium">
          Your name
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="John Doe"
          maxLength={100}
          disabled={formState === "submitting"}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {authorError && (
          <p className="text-xs text-destructive">{authorError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Your testimonial
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Share your experience with ${siteName}...`}
          rows={5}
          maxLength={2000}
          disabled={formState === "submitting"}
          className="resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{contentError && <span className="text-destructive">{contentError}</span>}</span>
          <span>{content.length}/2000</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Rating (optional)</label>
        <StarRating
          value={rating}
          onChange={setRating}
          accentColor={accentColor}
          disabled={formState === "submitting"}
        />
      </div>

      {formState === "error" && errorMessage && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-2 w-full",
          !accentColor && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        {...(accentColor ? { style: { backgroundColor: accentColor, color: "white" } } : {})}
      >
        {formState === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit testimonial"
        )}
      </Button>
    </form>
  );
}