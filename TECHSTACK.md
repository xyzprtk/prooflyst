# Tech Stack

## Overview

Prooflyst is built as a single Next.js application that serves three roles:

1. **REST API** — the core product that external developers consume
2. **Hosted pages** — submission form, testimonial wall, thank-you page
3. **Admin dashboard** — site management and testimonial moderation

All three run from one codebase, deployed to Vercel.

---

## Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15 |
| Language | TypeScript | 5.x |
| Database | PostgreSQL via Neon | Serverless |
| ORM | Drizzle ORM | Latest |
| UI Components | shadcn/ui | Latest |
| Styling | Tailwind CSS | v4 |
| Validation | Zod | Latest |
| Rate Limiting | Upstash Redis + @upstash/ratelimit | Latest |
| Data Fetching | SWR | Latest |
| Deployment | Vercel | — |
| Package Manager | pnpm | Latest |

---

## Rationale

### Next.js 15 (App Router)

Single framework for API routes, server-rendered pages, and the dashboard. Route Handlers (`app/api/`) serve the REST API. Server Components render hosted pages with SEO-friendly HTML. Client Components power the interactive dashboard.

### Neon (Serverless PostgreSQL)

Standard PostgreSQL, serverless-scaled. Connects over HTTP (via `@neondatabase/serverless`) so it works in Vercel's serverless functions without connection pooling issues. Free tier includes 0.5 GB storage, which is more than enough for MVP.

### Drizzle ORM

Type-safe, SQL-close, no code generation step. Schema is defined in TypeScript and pushed to the database with `drizzle-kit push` during development. Migrations are generated with `drizzle-kit generate` for production. Lightweight — no heavy client bundle like Prisma.

### shadcn/ui + Tailwind v4

Component primitives for the admin dashboard and hosted pages. Components are copied into the project (not imported from node_modules), giving full control. Tailwind v4 uses CSS-native configuration.

### Zod

Schema validation shared across the stack: API request validation, form validation, Drizzle type inference. Single source of truth for data shapes.

### Upstash Redis + @upstash/ratelimit

Serverless Redis for rate limiting. Works in Vercel Edge Middleware — requests are rate-limited before they hit the API function. Sliding window algorithm, configured per endpoint tier.

### SWR

Client-side data fetching for the admin dashboard. Automatic revalidation, optimistic updates, and stale-while-revalidate caching. Makes the dashboard feel responsive without WebSocket complexity.

---

## Project Structure

```
prooflyst/
├── app/
│   ├── (dashboard)/              # Admin dashboard (authenticated)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home — list all sites
│   │   └── sites/
│   │       └── [siteId]/
│   │           ├── page.tsx      # Site detail — testimonials list + moderation
│   │           └── settings/
│   │               └── page.tsx  # Site settings, keys, branding, webhooks
│   │
│   ├── (hosted)/                 # Public hosted pages (no auth)
│   │   ├── t/[slug]/
│   │   │   └── page.tsx          # Hosted submission form
│   │   └── wall/[slug]/
│   │       └── page.tsx          # Hosted testimonial wall
│   │
│   ├── api/v1/                   # REST API
│   │   ├── sites/
│   │   │   └── route.ts          # POST (create), GET (list)
│   │   ├── testimonials/
│   │   │   ├── route.ts          # POST (submit), GET (admin list)
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH (moderate), DELETE (soft delete)
│   │   └── public/
│   │       └── testimonials/
│   │           └── [siteId]/
│   │               └── route.ts  # GET (approved only, no auth)
│   │
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   └── dashboard/                # Dashboard-specific components
│
├── lib/
│   ├── db/
│   │   ├── index.ts              # Drizzle client + Neon connection
│   │   └── schema.ts             # Table definitions (sites, testimonials)
│   ├── auth.ts                   # API key generation + validation
│   ├── rate-limit.ts             # Upstash rate limiter configuration
│   ├── keys.ts                   # Key generation utilities (pl_pub_*, pl_admin_*)
│   └── validations.ts            # Zod schemas shared across API + forms
│
├── drizzle.config.ts             # Drizzle Kit configuration
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Template for required env vars
├── PRD.md
├── TECHSTACK.md
└── package.json
```

---

## Environment Variables

```bash
# Neon PostgreSQL
DATABASE_URL=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## What This Stack Does NOT Include

| Excluded | Reason |
|---|---|
| Prisma | Heavier, requires code generation, slower cold starts |
| tRPC | API is REST for external developers, not internal RPC |
| Clerk / NextAuth | Auth is custom API keys, not user sessions |
| Redis for caching | Vercel Data Cache + ISR handles public endpoint caching |
| Separate API server | Next.js Route Handlers are sufficient for MVP |
| WebSockets | SWR polling is enough for dashboard responsiveness |
