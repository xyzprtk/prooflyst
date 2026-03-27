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

### 6.6 Webhook (Basic)

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
  name:        string
  domain:      string        // registered origin for public key validation
  admin_key:   string        // "pl_admin_xxx" (hashed in storage)
  public_key:  string        // "pl_pub_xxx"
  webhook_url: string?       // optional webhook endpoint
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

## 10. User Flow

### Step 1: Developer Setup

Developer signs up → creates a site → receives admin key and public key.

### Step 2: End User Submission

End user fills a developer-built form → form calls `POST /v1/testimonials` with public key → testimonial stored as `pending`.

### Step 3: Moderation

Developer receives webhook notification (optional) → reviews pending testimonials → approves or deletes via `PATCH /v1/testimonials/:id`.

### Step 4: Display

Developer's frontend calls `GET /v1/public/testimonials/:site_id` → renders approved testimonials with full styling control.

---

## 11. System Architecture

```
Frontend App (User Form / Display UI)
        |
        v
  Prooflyst API (REST)
        |
        v
  Database (PostgreSQL)
```

### Components

- **API Server:** Node.js with Fastify
- **Database:** PostgreSQL
- **Validation:** Zod for request/response schemas
- **Authentication:** API key-based (header or query param)
- **Optional cache layer:** (future — Redis for public reads)

---

## 12. SDK (MVP)

### React SDK (`@prooflyst/react`)

- `useTestimonials(siteId, options)` hook — fetches approved testimonials
- `<TestimonialForm />` headless component — handles submission logic, no styling imposed
- Zero dependencies beyond React

Python SDK and other language SDKs are deferred until post-MVP based on user demand.

---

## 13. Virality and Distribution

### Built-in Mechanisms

- **"Powered by Prooflyst" badge** — Optional, enabled by default on free tier. Links back to Prooflyst. Every site using the product becomes a passive awareness driver.
- **Testimonial submission confirmation** — After submitting, end users see a brief "Submitted via Prooflyst" message (configurable by developer).
- **CLI onboarding** — `npx prooflyst init` for instant project setup. Shareable, tweetable developer experience.
- **Open-source React SDK** — Published on npm, discoverable through search and ecosystem.

### Content and Community

- Template gallery (post-MVP) — example integrations for Next.js, Remix, Astro, etc.
- Public testimonial showcase — opt-in directory of sites using Prooflyst.

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
