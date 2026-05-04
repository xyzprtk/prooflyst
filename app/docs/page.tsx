import { NavbarDocs } from "@/components/docs/navbar-docs";
import { DocsSidebar } from "@/components/docs/sidebar";
import { CodeBlock, InlineCode, Endpoint, ParameterTable } from "@/components/docs/code-block";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Documentation",
  description: "Prooflyst API documentation. Learn how to collect, manage, and serve testimonials.",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <NavbarDocs />

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <div className="flex gap-12">
          <DocsSidebar />

          <div className="flex-1 max-w-3xl">
            {/* Introduction */}
            <section id="introduction" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">GETTING STARTED</p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                Documentation
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Prooflyst is a developer-first API for collecting, managing, and serving testimonials.
                Build trust into your product with structured social proof.
              </p>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-6 mb-8">
                <h3 className="text-sm font-semibold mb-2">Base URL</h3>
                <CodeBlock language="bash" title="base">https://api.prooflyst.com/v1</CodeBlock>
              </div>

              <h2 className="text-xl font-semibold tracking-tight mb-4 mt-12">Quick Start</h2>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-sm font-mono text-primary shrink-0">1.</span>
                  <span>Create a site via the dashboard or the <InlineCode>/sites</InlineCode> API endpoint.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sm font-mono text-primary shrink-0">2.</span>
                  <span>Use your <InlineCode>public_key</InlineCode> to collect testimonials from users.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sm font-mono text-primary shrink-0">3.</span>
                  <span>Use your <InlineCode>admin_key</InlineCode> to moderate and manage testimonials.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-sm font-mono text-primary shrink-0">4.</span>
                  <span>Serve approved testimonials via the public API or embed widget.</span>
                </li>
              </ol>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Authentication */}
            <section id="authentication" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">AUTHENTICATION</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Authentication
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Prooflyst uses two types of authentication. Public keys are used for collecting testimonials
                from end users. Admin keys are used for managing your site and moderating testimonials.
              </p>

              <h3 className="text-lg font-semibold tracking-tight mb-3 mt-8">Public Key</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Used when submitting testimonials. Pass it in the request body along with the <InlineCode>site_id</InlineCode>.
              </p>
              <CodeBlock language="json" title="request">
{`{
  "site_id": "site_abc123",
  "public_key": "pl_pub_xxx",
  "author": "Sarah Chen",
  "content": "Amazing product!",
  "rating": 5
}`}
              </CodeBlock>

              <h3 className="text-lg font-semibold tracking-tight mb-3 mt-8">Admin Key</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Used for all management endpoints. Pass it in the <InlineCode>Authorization</InlineCode> header
                as a Bearer token.
              </p>
              <CodeBlock language="bash" title="header">
{`Authorization: Bearer pl_admin_xxx`}
              </CodeBlock>

              <div className="rounded-xl border border-border/50 bg-muted/30 p-6 mt-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> Admin keys are generated once
                  when you create a site. Store them securely. They cannot be retrieved again.
                </p>
              </div>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Sites API */}
            <section id="sites" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">SITES</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Sites
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                A site represents your product or project. Each site gets its own hosted collection form,
                testimonial wall, and API keys.
              </p>

              {/* POST /sites */}
              <div className="mb-14">
                <Endpoint method="POST" path="/sites" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Create a new site. Requires admin authentication. Returns the site details including
                  the generated admin key, public key, and hosted URLs.
                </p>

                <h4 className="text-sm font-semibold mb-3">Request Body</h4>
                <ParameterTable params={[
                  { name: "name", type: "string", required: "Yes", description: "Display name of your site. Max 100 characters." },
                  { name: "domain", type: "string", required: "Yes", description: "Valid URL of your site." },
                  { name: "slug", type: "string", required: "Yes", description: "Unique identifier. Lowercase letters, numbers, hyphens only. 3–50 chars." },
                  { name: "branding", type: "object", required: "No", description: "Optional branding configuration." },
                  { name: "webhookUrl", type: "string", required: "No", description: "Optional webhook URL for events." },
                ]} />

                <CodeBlock language="json" title="request">
{`{
  "name": "Acme Inc",
  "domain": "https://acme.com",
  "slug": "acme",
  "branding": {
    "heading": "Share your experience",
    "accentColor": "#3B82F6",
    "wallLayout": "grid",
    "wallColumns": 3
  }
}`}
                </CodeBlock>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "site": {
    "id": "site_abc123",
    "slug": "acme",
    "name": "Acme Inc",
    "domain": "https://acme.com",
    "public_key": "pl_pub_abc123",
    "admin_key": "pl_admin_xyz789",
    "hosted_form_url": "https://prooflyst.com/t/acme",
    "hosted_wall_url": "https://prooflyst.com/wall/acme",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`}
                </CodeBlock>
              </div>

              {/* GET /sites */}
              <div className="mb-14">
                <Endpoint method="GET" path="/sites" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  List all sites associated with your admin key. Requires admin authentication.
                </p>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "sites": [
    {
      "id": "site_abc123",
      "slug": "acme",
      "name": "Acme Inc",
      "domain": "https://acme.com",
      "public_key": "pl_pub_abc123",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}`}
                </CodeBlock>
              </div>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Testimonials API */}
            <section id="testimonials" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">TESTIMONIALS</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Testimonials
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Manage testimonials through the admin API. Submit testimonials using the public endpoint
                or collect them through the hosted form.
              </p>

              {/* POST /testimonials */}
              <div className="mb-14">
                <Endpoint method="POST" path="/testimonials" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Submit a new testimonial. This is a public endpoint that uses your public key for authentication.
                  New testimonials are created with <InlineCode>pending</InlineCode> status and must be approved
                  before they appear on your wall.
                </p>

                <h4 className="text-sm font-semibold mb-3">Request Body</h4>
                <ParameterTable params={[
                  { name: "site_id", type: "string", required: "Yes", description: "ID of the site this testimonial belongs to." },
                  { name: "public_key", type: "string", required: "Yes", description: "Public key for the site." },
                  { name: "author", type: "string", required: "Yes", description: "Name of the person giving the testimonial. Max 100 chars." },
                  { name: "content", type: "string", required: "Yes", description: "The testimonial text. Max 2000 chars." },
                  { name: "rating", type: "number", required: "No", description: "Optional rating from 1 to 5." },
                ]} />

                <CodeBlock language="json" title="request">
{`{
  "site_id": "site_abc123",
  "public_key": "pl_pub_abc123",
  "author": "Sarah Chen",
  "content": "This product completely changed how we handle customer feedback. The API is clean and the embed widget just works.",
  "rating": 5
}`}
                </CodeBlock>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "success": true,
  "message": "Testimonial submitted successfully."
}`}
                </CodeBlock>
              </div>

              {/* GET /testimonials */}
              <div className="mb-14">
                <Endpoint method="GET" path="/testimonials" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  List testimonials for a site. Requires admin authentication. Supports filtering by status,
                  pagination via cursor, and sorting.
                </p>

                <h4 className="text-sm font-semibold mb-3">Query Parameters</h4>
                <ParameterTable params={[
                  { name: "site_id", type: "string", required: "Yes", description: "Filter by site ID." },
                  { name: "status", type: "string", required: "No", description: "pending, approved, deleted, or all. Default: all." },
                  { name: "limit", type: "number", required: "No", description: "Max 100. Default: 20." },
                  { name: "cursor", type: "string", required: "No", description: "Pagination cursor from previous response." },
                  { name: "sort", type: "string", required: "No", description: "newest, oldest, or rating. Default: newest." },
                ]} />

                <CodeBlock language="bash" title="request">
{`GET /testimonials?site_id=site_abc123&status=approved&limit=10&sort=newest`}
                </CodeBlock>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "testimonials": [
    {
      "id": "test_abc123",
      "site_id": "site_abc123",
      "author": "Sarah Chen",
      "content": "Amazing product!",
      "rating": 5,
      "status": "approved",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNVQxMDozMDowMC4wMDBaIn0",
  "has_more": false
}`}
                </CodeBlock>
              </div>

              {/* PATCH /testimonials/:id */}
              <div className="mb-14">
                <Endpoint method="PATCH" path="/testimonials/:id" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Update the status of a testimonial. Requires admin authentication. Use this to approve
                  or reject pending testimonials.
                </p>

                <h4 className="text-sm font-semibold mb-3">Request Body</h4>
                <ParameterTable params={[
                  { name: "status", type: "string", required: "Yes", description: "approved or pending." },
                ]} />

                <CodeBlock language="json" title="request">
{`{
  "status": "approved"
}`}
                </CodeBlock>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "testimonial": {
    "id": "test_abc123",
    "status": "approved",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}`}
                </CodeBlock>
              </div>

              {/* DELETE /testimonials/:id */}
              <div className="mb-14">
                <Endpoint method="DELETE" path="/testimonials/:id" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Soft-delete a testimonial. The testimonial is marked as <InlineCode>deleted</InlineCode> and
                  will no longer appear in lists. Requires admin authentication.
                </p>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "testimonial": {
    "id": "test_abc123",
    "status": "deleted",
    "updated_at": "2024-01-15T11:05:00.000Z"
  }
}`}
                </CodeBlock>
              </div>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Public API */}
            <section id="public-api" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">PUBLIC API</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Public API
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                The public API lets you serve approved testimonials on your own site or application.
                No authentication required. Responses are cached for 60 seconds.
              </p>

              <div className="mb-14">
                <Endpoint method="GET" path="/public/testimonials/:siteId" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Retrieve all approved testimonials for a site. This endpoint is designed to be called
                  directly from your frontend. Results are paginated and sorted by creation date.
                </p>

                <h4 className="text-sm font-semibold mb-3">Query Parameters</h4>
                <ParameterTable params={[
                  { name: "limit", type: "number", required: "No", description: "Max 50. Default: 20." },
                  { name: "cursor", type: "string", required: "No", description: "Pagination cursor." },
                  { name: "sort", type: "string", required: "No", description: "newest or oldest. Default: newest." },
                ]} />

                <CodeBlock language="bash" title="request">
{`GET /public/testimonials/site_abc123?limit=10&sort=newest`}
                </CodeBlock>

                <h4 className="text-sm font-semibold mb-3">Response</h4>
                <CodeBlock language="json" title="response">
{`{
  "testimonials": [
    {
      "id": "test_abc123",
      "author": "Sarah Chen",
      "content": "Amazing product!",
      "rating": 5,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "test_def456",
      "author": "Marcus Johnson",
      "content": "Clean API, great docs.",
      "rating": 5,
      "created_at": "2024-01-14T09:15:00.000Z"
    }
  ],
  "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNFQwOToxNTowMC4wMDBaIn0",
  "has_more": true
}`}
                </CodeBlock>
              </div>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Errors */}
            <section id="errors" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">ERRORS</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                Errors
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Prooflyst uses standard HTTP status codes and returns structured error responses.
                All errors follow the same JSON format.
              </p>

              <CodeBlock language="json" title="error-response">
{`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "issues": [
        { "path": ["author"], "message": "Author name is required" }
      ]
    }
  }
}`}
              </CodeBlock>

              <h3 className="text-lg font-semibold tracking-tight mb-3 mt-8">Error Codes</h3>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Code</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: "VALIDATION_ERROR", status: "400", desc: "Request body or query parameters are invalid." },
                      { code: "UNAUTHORIZED", status: "401", desc: "Missing or invalid admin key." },
                      { code: "FORBIDDEN", status: "403", desc: "Valid key but insufficient permissions for this resource." },
                      { code: "NOT_FOUND", status: "404", desc: "Resource not found." },
                      { code: "RATE_LIMITED", status: "429", desc: "Too many requests." },
                      { code: "INTERNAL_ERROR", status: "500", desc: "Something went wrong on our end." },
                    ].map((e) => (
                      <tr key={e.code} className="border-b border-border/30">
                        <td className="py-2.5 px-3 font-mono text-xs">{e.code}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{e.status}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{e.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* SDK */}
            <section id="sdk" className="mb-20">
              <p className="text-xs font-mono text-muted-foreground mb-3">SDK</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                SDK
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                You do not need an SDK to use Prooflyst. The API is simple enough to call directly
                with <InlineCode>fetch</InlineCode>. Here is a complete example of submitting a testimonial
                from a React component.
              </p>

              <CodeBlock language="tsx" title="SubmitTestimonial.tsx">
{`"use client";

import { useState } from "react";

export function SubmitTestimonial({ siteId, publicKey }: { siteId: string; publicKey: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");

    const response = await fetch("https://api.prooflyst.com/v1/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_id: siteId,
        public_key: publicKey,
        author: formData.get("author"),
        content: formData.get("content"),
        rating: Number(formData.get("rating")),
      }),
    });

    if (response.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="author" placeholder="Your name" required />
      <textarea name="content" placeholder="Your testimonial" required />
      <input name="rating" type="number" min={1} max={5} />
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}`}
              </CodeBlock>

              <h3 className="text-lg font-semibold tracking-tight mb-3 mt-8">Embed Widget</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Add this script tag to any HTML page to display your testimonial wall. No build step required.
              </p>
              <CodeBlock language="html" title="embed.html">
{`<script
  src="https://prooflyst.com/embed.js"
  data-site-id="site_abc123"
  data-theme="auto"
></script>
<div id="prooflyst-wall"></div>`}
              </CodeBlock>
            </section>

            <hr className="border-border/30 mb-20" />

            {/* Footer CTA */}
            <section className="text-center py-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Ready to build?
              </h2>
              <p className="text-base text-muted-foreground mb-8">
                Start collecting testimonials in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/dashboard/setup"
                  className="inline-flex items-center justify-center rounded-full px-8 h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="https://github.com/xyzprtk/prooflyst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full px-8 h-11 text-sm font-medium border border-border/60 hover:bg-foreground/5 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
