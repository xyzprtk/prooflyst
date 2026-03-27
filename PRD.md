# Product Requirements Document (PRD)

## Product Name: Prooflyst

## Version: MVP (v1)

## Type: Developer-first SaaS (Headless API)

---

## 1. Overview

**Prooflyst** is a headless testimonial API that enables developers to collect, moderate, and serve customer testimonials while maintaining complete control over frontend rendering.

Unlike traditional tools that provide rigid widgets, Prooflyst focuses on:

- Data infrastructure
- API simplicity
- Developer flexibility

---

## 2. Problem Statement

Developers currently face:

- No simple backend for testimonials — they build from scratch every time
- Existing tools are UI-heavy and restrictive
- Lack of control over styling and UX
- No clean API for testimonials (especially for future AI/agent use)

---

## 3. Solution

Prooflyst provides:

- A simple REST API to store and fetch testimonials
- A moderation layer to control content
- A public submission endpoint
- A developer-first integration experience

---

## 4. Target Users

### Primary

- Developers building SaaS products
- Indie hackers
- Technical founders

### Secondary

- Agencies (later stage)

---

## 5. Goals (MVP)

### Primary Goals

- Enable testimonial collection via API
- Provide moderation workflow
- Deliver approved testimonials via API
- Keep system simple, fast, and reliable

### Non-Goals (for MVP)

- Analytics
- AI summaries
- Advanced UI dashboards
- A/B testing
- Multi-role teams

---

## 6. Core Features (MVP)

### 6.1 Site Management

Sites are the top-level organizational unit. Each site represents a project or product collecting testimonials.

#### Create Site

```http
POST /v1/sites
```

**Headers:**

```
Authorization: Bearer pl_admin_xxx
```

**Request:**

```json
{
  "name": "My SaaS App",
  "domain": "https://myapp.com"
}
```

**Response:**

```json
{
  "site": {
    "id": "site_abc123",
    "name": "My SaaS App",
    "domain": "https://myapp.com",
    "public_key": "pl_pub_xxx",
    "created_at": "2026-03-27T00:00:00Z"
  }
}
```

#### List Sites

```http
GET /v1/sites
```

**Headers:**

```
Authorization: Bearer pl_admin_xxx
```

---

### 6.2 Testimonial Submission (Public API)

#### Endpoint

```http
POST /v1/testimonials
```

**Description:** Allows end users to submit testimonials via developer-built forms. Authenticated with the site's public key.

**Request:**

```json
{
  "site_id": "site_abc123",
  "public_key": "pl_pub_xxx",
  "author": "Asha",
  "content": "Loved the product!",
  "rating": 5
}
```

**Behavior:**

- Validates `public_key` matches the `site_id`
- Validates request origin against site's registered domain (when configured)
- Stores testimonial with `status = pending`
- Returns success response

**Response:**

```json
{
  "success": true,
  "message": "Testimonial submitted successfully."
}
```

---

### 6.3 Moderation API (Admin)

All moderation endpoints require admin key authentication.

**Headers:**

```
Authorization: Bearer pl_admin_xxx
```

#### Approve / Reject

```http
PATCH /v1/testimonials/:id
```

```json
{
  "status": "approved"
}
```

#### Soft Delete

```http
DELETE /v1/testimonials/:id
```

Sets `status = deleted`. Testimonials are never hard-deleted in MVP to preserve audit trails and allow recovery.

---

### 6.4 Fetch Testimonials (Admin Read API)

#### Endpoint

```http
GET /v1/testimonials
```

**Headers:**

```
Authorization: Bearer pl_admin_xxx
```

**Query Params:**

| Param    | Required | Default    | Description                          |
| -------- | -------- | ---------- | ------------------------------------ |
| site_id  | Yes      | —          | Filter by site                       |
| status   | No       | all        | Filter: pending, approved, deleted   |
| limit    | No       | 20         | Max results per page (max 100)       |
| cursor   | No       | —          | Cursor for pagination                |
| sort     | No       | newest     | Sort order: newest, oldest, rating   |

**Response:**

```json
{
  "testimonials": [
    {
      "id": "t_abc123",
      "site_id": "site_abc123",
      "author": "Asha",
      "content": "Loved it!",
      "rating": 5,
      "status": "approved",
      "created_at": "2026-03-27T00:00:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6InRfYWJjMTIzIn0",
  "has_more": false
}
```

---

### 6.5 Public Read Endpoint

#### Endpoint

```http
GET /v1/public/testimonials/:site_id
```

**Description:** Returns only approved testimonials. No authentication required. Designed for frontend consumption and future AI agent access.

**Query Params:**

| Param  | Required | Default | Description                    |
| ------ | -------- | ------- | ------------------------------ |
| limit  | No       | 20      | Max results per page (max 50)  |
| cursor | No       | —       | Cursor for pagination          |
| sort   | No       | newest  | Sort order: newest, oldest     |

**Response:**

```json
{
  "testimonials": [
    {
      "id": "t_abc123",
      "author": "Asha",
      "content": "Loved it!",
      "rating": 5,
      "created_at": "2026-03-27T00:00:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6InRfYWJjMTIzIn0",
  "has_more": false
}
```

---

### 6.6 Hosted Submission Page

Every site gets a public, Prooflyst-hosted form page for collecting testimonials without the developer building any UI.

#### URL

```
https://prooflyst.com/t/:site_slug
```

`site_slug` is a unique, human-readable identifier set during site creation (e.g., `my-saas-app`).

#### Behavior

- Renders a clean, branded submission form (author, content, optional rating)
- Submits to `POST /v1/testimonials` internally
- Developer can customize: heading text, thank-you message, accent color
- Footer displays: **"Collect testimonials for your product → prooflyst.com"**
- Developers can share the link directly, embed it in emails, or iframe it

#### Site Creation (updated)

```json
{
  "name": "My SaaS App",
  "domain": "https://myapp.com",
  "slug": "my-saas-app",
  "branding": {
    "heading": "We'd love your feedback!",
    "thank_you": "Thanks for sharing your experience.",
    "accent_color": "#6366f1"
  }
}
```

#### Why This Matters

This is the primary viral mechanism. Every hosted form URL is a public-facing artifact that exposes the Prooflyst brand to end users — the Cal.com / Typeform model. The person leaving a testimonial is often a founder or developer themselves, making them a warm lead.

---

### 6.7 Thank-You Page with CTA

After a testimonial is submitted via the hosted form, the end user sees a confirmation page.

#### Content

- Developer-configured thank-you message (default: "Thanks for your testimonial!")
- Subtle CTA below: **"Want to collect testimonials for your product? Try Prooflyst →"** with a link to the signup page

#### Controls

- The CTA is always present on the free tier
- Paid tier can remove it or replace with custom content

This turns every single testimonial submission into a potential acquisition touchpoint.

---

### 6.8 Hosted Testimonial Wall

A public, read-only page displaying a site's approved testimonials.

#### URL

```
https://prooflyst.com/wall/:site_slug
```

#### Behavior

- Fetches from `GET /v1/public/testimonials/:site_id` internally
- Renders testimonials in a clean, responsive masonry/grid layout
- Includes site name, testimonial count, and Prooflyst branding in footer
- Developer can link to it as a "See what our customers say" page
- Open Graph meta tags for social sharing previews

#### Customization

- Accent color (inherits from site branding)
- Layout preference: grid or list (default: grid)

#### Why This Matters

Creates a shareable, indexable public page for every Prooflyst site. Developers get a zero-effort "social proof" page they can link from landing pages, pitch decks, or investor updates. Every wall page is organic SEO surface area for Prooflyst.

---

### 6.9 Webhook (Basic)

A single webhook event for MVP: `testimonial.submitted`.

When a new testimonial is submitted, Prooflyst sends a POST request to the configured webhook URL.

**Payload:**

```json
{
  "event": "testimonial.submitted",
  "data": {
    "id": "t_abc123",
    "site_id": "site_abc123",
    "author": "Asha",
    "content": "Loved the product!",
    "created_at": "2026-03-27T00:00:00Z"
  }
}
```

This enables Slack/Discord notifications and custom moderation workflows without polling.

---

## 7. Data Models (MVP)

### Site

```
Site {
  id:          string        // "site_abc123"
  slug:        string        // unique, URL-safe identifier ("my-saas-app")
  name:        string
  domain:      string        // registered origin for public key validation
  admin_key:   string        // "pl_admin_xxx" (hashed in storage)
  public_key:  string        // "pl_pub_xxx"
  webhook_url: string?       // optional webhook endpoint
  branding: {
    heading:      string?    // hosted form heading text
    thank_you:    string?    // post-submission message
    accent_color: string?    // hex color for hosted pages
    wall_layout:  string?    // "grid" | "list"
  }
  created_at:  timestamp
}
```

### Testimonial

```
Testimonial {
  id:          string        // "t_abc123"
  site_id:     string        // FK → Site.id
  author:      string
  content:     string
  rating:      number?       // 1-5, optional
  status:      "pending" | "approved" | "deleted"
  created_at:  timestamp
  updated_at:  timestamp
}
```

---

## 8. Error Response Format

All errors follow a consistent envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'content' is required.",
    "details": {}
  }
}
```

### Standard Error Codes

| Code                | HTTP Status | Description                        |
| ------------------- | ----------- | ---------------------------------- |
| VALIDATION_ERROR    | 400         | Invalid or missing input           |
| UNAUTHORIZED        | 401         | Missing or invalid API key         |
| FORBIDDEN           | 403         | Key lacks permission               |
| NOT_FOUND           | 404         | Resource does not exist            |
| RATE_LIMITED        | 429         | Too many requests                  |
| INTERNAL_ERROR      | 500         | Unexpected server error            |

---

## 9. Authentication and Security

### Key Types

- **Public Key (`pl_pub_*`)** — Used in the submission endpoint. Scoped to a single site. Validated against registered domain origin when configured.
- **Admin Key (`pl_admin_*`)** — Required for moderation, site management, and admin reads. Full access to the site's resources.

### Rate Limits

| Endpoint               | Limit              |
| ---------------------- | ------------------ |
| Public submission      | 30 requests/min    |
| Public read            | 120 requests/min   |
| Admin endpoints        | 300 requests/min   |

### Protections

- Rate limiting per key / IP
- Input validation and sanitization
- Domain origin validation for public keys
- Only approved testimonials exposed on public endpoints
- Admin keys stored as hashed values
- No PII exposed on public endpoints beyond author name

---

## 10. User Flows

### Flow A: Developer with Custom Frontend

1. Developer signs up → creates a site via API or CLI → receives admin key, public key, and hosted URLs
2. Developer builds custom form using SDK or raw API → end user submits → stored as `pending`
3. Developer receives webhook notification (optional) → approves or deletes via admin API
4. Developer's frontend calls `GET /v1/public/testimonials/:site_id` → renders with full styling control

### Flow B: Developer Using Hosted Pages (Zero Frontend Work)

1. Developer signs up → creates a site → receives hosted form URL (`prooflyst.com/t/:slug`)
2. Developer shares the form link in emails, landing pages, or social media
3. End user visits hosted form → submits testimonial → sees thank-you page with Prooflyst CTA
4. Developer moderates via admin API
5. Developer links to hosted wall (`prooflyst.com/wall/:slug`) or fetches via API

### Flow C: Viral Acquisition

1. End user submits testimonial on hosted form
2. Thank-you page shows: "Want to collect testimonials for your product? Try Prooflyst →"
3. End user (who is often a developer/founder) clicks through → signs up → creates their own site
4. Loop repeats

---

## 11. System Architecture

```
Developer's App                   Prooflyst Hosted Pages
(custom form / display)           (form + wall + thank-you)
        |                                  |
        v                                  v
              Prooflyst API (REST)
                      |
                      v
               Database (PostgreSQL)
```

### Components

- **API Server:** Node.js with Fastify
- **Hosted Pages:** Server-rendered pages for submission form, wall, and thank-you
- **Database:** PostgreSQL
- **Validation:** Zod for request/response schemas
- **Authentication:** API key-based (header or query param)
- **Optional cache layer:** (future — Redis for public reads)

---

## 12. SDK (MVP)

### React SDK (`@prooflyst/react`)

Open-source (MIT license) from day one. Published on npm for discoverability.

#### Headless Layer

- `useTestimonials(siteId, options)` hook — fetches approved testimonials with pagination
- `useSubmitTestimonial(siteId, publicKey)` hook — handles form submission, loading/error states
- Zero styling imposed, full render control

#### Styled Components (Optional)

Ship alongside the headless hooks as opt-in, beautiful defaults:

- `<TestimonialWall />` — responsive grid/list of testimonials with sensible default styling
- `<TestimonialForm />` — ready-to-use submission form with validation
- `<TestimonialCard />` — individual testimonial display
- All styled components accept `className` and `unstyled` props for full override

The styled components serve two purposes: faster developer onboarding (copy-paste and it works) and organic distribution (developers share good-looking components).

#### CLI

```bash
npx prooflyst init
```

Interactive setup that:
1. Prompts for admin key
2. Creates a site (or selects existing)
3. Generates a working example component in the current project
4. Outputs the public key and hosted form URL

The CLI is a tweetable onboarding moment.

### Starter Templates

Framework-specific examples published as public GitHub repos:

- `prooflyst/starter-nextjs`
- `prooflyst/starter-astro`
- `prooflyst/starter-remix`

Each template is a working app with testimonial collection and display wired up. One-click deploy to Vercel/Netlify.

Python SDK and other language SDKs are deferred until post-MVP based on user demand.

---

## 13. Virality and Distribution

### Viral Loop (Built Into the Product)

The core loop works like this:

```
Developer creates site
  → shares hosted form link (prooflyst.com/t/slug)
    → end user submits testimonial
      → sees thank-you page with Prooflyst CTA
        → end user is often a founder/dev themselves
          → signs up → creates their own site → loop repeats
```

Every testimonial submission is an acquisition touchpoint. Every hosted page is brand exposure.

### Surface Area (Public Artifacts)

| Artifact                  | URL                                | Brand Exposure To          |
| ------------------------- | ---------------------------------- | -------------------------- |
| Hosted submission form    | `prooflyst.com/t/:slug`            | End users leaving reviews  |
| Hosted testimonial wall   | `prooflyst.com/wall/:slug`         | Visitors, social shares    |
| Thank-you page CTA        | (shown after hosted form submit)   | End users post-submission  |
| "Powered by" in SDK       | (footer on styled components)      | Site visitors              |
| Open-source SDK on npm    | `npmjs.com/package/@prooflyst/react` | Developers searching npm |
| Starter templates         | `github.com/prooflyst/starter-*`   | Developers on GitHub       |
| CLI onboarding            | `npx prooflyst init`               | Developers in terminal     |

### Free vs. Paid Branding

| Element                     | Free Tier                     | Paid Tier                      |
| --------------------------- | ----------------------------- | ------------------------------ |
| Hosted form footer CTA      | Always shown                  | Removable                      |
| Thank-you page CTA          | Always shown                  | Replaceable with custom        |
| Testimonial wall branding   | "Powered by Prooflyst"        | Removable                      |
| SDK styled component footer | "Powered by Prooflyst"        | Removable                      |

This creates a natural upgrade incentive: developers pay to remove Prooflyst branding once they're serious about their product.

### Community and Content

- **Open-source SDK** — MIT license, accepting contributions. Stars and forks drive organic GitHub discovery.
- **Starter templates** — one-click deploy repos for major frameworks. Each template shows Prooflyst in action.
- **"Built with Prooflyst" badge** — developers can add to their README. Links back to prooflyst.com.
- **Public directory** (post-MVP) — opt-in showcase of sites using Prooflyst, with links to their walls.

---

## 14. Success Metrics

### Product Metrics

- Number of sites created
- Number of testimonials submitted
- Approval rate (approved / total)
- API usage per site (calls/day)
- Public endpoint cache hit rate

### Developer Experience

- Time to first integration: target < 10 minutes
- SDK adoption rate
- API error rate < 0.1%

---

## 15. Risks and Mitigations

| Risk                    | Mitigation                                      |
| ----------------------- | ----------------------------------------------- |
| Spam submissions        | Rate limiting + domain origin validation         |
| Abuse of public API     | API key scoping + per-key rate limits            |
| Over-engineering        | Strict MVP scope — ship, learn, iterate          |
| Low adoption            | Developer-first UX + CLI + content marketing     |
| Data loss               | Soft deletes + database backups                  |
| Key leakage             | Public keys are low-privilege by design          |

---

## 16. Out of Scope (MVP)

- Analytics dashboards
- AI summaries / sentiment analysis
- Theme extraction
- A/B testing
- Multi-tenant roles and permissions
- Email notifications
- File/image uploads on testimonials
- Python SDK

---

## 17. Future Scope (Post-MVP Roadmap)

### Phase 2: Data Enrichment

- Authors as a separate entity with profile data
- Metadata support (UTM params, tags, custom fields)
- Advanced sorting and filtering
- Bulk import/export

### Phase 3: Analytics Layer

- Event tracking (views, clicks on testimonials)
- Engagement metrics per testimonial
- Per-site usage dashboards

### Phase 4: Agent Layer

New endpoint:

```http
GET /v1/agent/testimonials/:site_id
```

Capabilities:

- AI-generated summaries of all testimonials
- Sentiment analysis
- Theme extraction
- Representative quote selection

### Phase 5: Optional UI Layer

- Embeddable widgets (opt-in, not default)
- Theme-aware components
- No-code testimonial wall builder

---

## 18. Long-Term Vision

Prooflyst evolves from a **headless testimonial API** into **structured social proof infrastructure for both humans and AI agents**.

The API-first foundation ensures that as AI agents become primary consumers of web content, Prooflyst is already positioned to serve them structured, verified social proof data.

---

## 19. Positioning Statement

> Prooflyst is a developer-first API to collect, manage, and serve testimonials — designed to power both modern applications and future AI systems.
