import {
  pgTable,
  text,
  integer,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  adminKey: text("admin_key").notNull(),
  publicKey: text("public_key").notNull(),
  webhookUrl: text("webhook_url"),
  branding: jsonb("branding").$type<{
    heading?: string;
    thankYou?: string;
    accentColor?: string;
    wallLayout?: "grid" | "list";
    wallColumns?: 2 | 3 | 4;
    wallCardStyle?: "default" | "minimal" | "bordered";
    wallShowRating?: boolean;
    wallShowDate?: boolean;
    wallShowAvatar?: boolean;
    wallTheme?: "light" | "dark" | "auto";
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const testimonials = pgTable(
  "testimonials",
  {
    id: text("id").primaryKey(),
    siteId: text("site_id")
      .references(() => sites.id, { onDelete: "cascade" })
      .notNull(),
    author: text("author").notNull(),
    content: text("content").notNull(),
    rating: integer("rating"),
    status: text("status", {
      enum: ["pending", "approved", "deleted"],
    })
      .default("pending")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("testimonials_site_id_idx").on(table.siteId),
    index("testimonials_status_idx").on(table.status),
    index("testimonials_site_status_idx").on(table.siteId, table.status),
  ]
);

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
