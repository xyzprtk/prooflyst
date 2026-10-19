import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  adminKey: text("admin_key").notNull(),
  publicKey: text("public_key").notNull(),
  webhookUrl: text("webhook_url"),
  branding: text("branding", { mode: "json" }).$type<{
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
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const testimonials = sqliteTable(
  "testimonials",
  {
    id: text("id").primaryKey(),
    siteId: text("site_id")
      .references(() => sites.id, { onDelete: "cascade" })
      .notNull(),
    author: text("author").notNull(),
    content: text("content").notNull(),
    rating: integer("rating"),
    status: text("status")
      .$type<"pending" | "approved" | "deleted">()
      .$defaultFn(() => "pending")
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date())
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
