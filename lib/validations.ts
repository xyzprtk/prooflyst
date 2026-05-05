import { z } from "zod/v4";

export const createSiteSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  domain: z.url("Must be a valid URL"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  branding: z
    .object({
      heading: z.string().max(200).optional(),
      thankYou: z.string().max(200).optional(),
      accentColor: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
        .optional(),
      wallLayout: z.enum(["grid", "list"]).optional(),
      wallColumns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
      wallCardStyle: z.enum(["default", "minimal", "bordered"]).optional(),
      wallShowRating: z.boolean().optional(),
      wallShowDate: z.boolean().optional(),
      wallShowAvatar: z.boolean().optional(),
      wallTheme: z.enum(["light", "dark", "auto"]).optional(),
    })
    .optional(),
  webhookUrl: z.url().optional(),
});

export const submitTestimonialSchema = z.object({
  site_id: z.string().min(1, "Site ID is required"),
  public_key: z.string().min(1, "Public key is required"),
  author: z.string().min(1, "Author name is required").max(100),
  content: z.string().min(1, "Content is required").max(2000),
  rating: z.number().int().min(1).max(5).optional(),
});

export const moderateTestimonialSchema = z.object({
  status: z.enum(["approved", "pending"]),
});

export const listTestimonialsSchema = z.object({
  site_id: z.string().min(1),
  status: z.enum(["pending", "approved", "deleted", "all"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  sort: z.enum(["newest", "oldest", "rating"]).default("newest"),
});

export const publicListSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});
