import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, Shield, Code, Globe, Database, Webhook, Check, Copy, CheckCircle2, Clock, Lock, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Zap className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Prooflyst</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/prooflyst" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_50%)]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">
              Now in Public Beta
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Collect testimonials
              <span className="block text-emerald-500">without the widget</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Developer-first API to collect, moderate, and serve testimonials. 
              You own the frontend. We handle the infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-base px-8">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                View Documentation
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Free tier forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Open source SDK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for developers who want control. No bloat, no lock-in.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Code className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Clean REST API</h3>
                <p className="text-sm text-muted-foreground">
                  Intuitive endpoints with predictable responses. JSON in, JSON out. No surprises.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">API Key Auth</h3>
                <p className="text-sm text-muted-foreground">
                  Simple key-based authentication. Public keys for submission, admin keys for management.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Database className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">PostgreSQL + Drizzle</h3>
                <p className="text-sm text-muted-foreground">
                  Your data lives in Postgres. Type-safe ORM with migrations. Export anytime.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Webhook className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when testimonials arrive. Slack, Discord, or your own endpoint.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Globe className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hosted Pages</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant submission forms and testimonial walls at your custom domain.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <LayoutGrid className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Moderation</h3>
                <p className="text-sm text-muted-foreground">
                  Approve, reject, or edit testimonials before they go live. Full control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section id="api" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-emerald-500/10 text-emerald-600 border-none">
                Developer Experience
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                API so clean, it documents itself
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                No SDK required. Just HTTP requests. But we have one if you want it.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Predictable REST</h4>
                    <p className="text-sm text-muted-foreground">Standard HTTP methods and status codes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">TypeScript Ready</h4>
                    <p className="text-sm text-muted-foreground">Full type definitions for all responses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Cursor Pagination</h4>
                    <p className="text-sm text-muted-foreground">Efficient listing with next_cursor tokens</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-2xl" />
              <Card className="relative border-border/50 bg-[#0d1117] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">example.ts</span>
                </div>
                <CardContent className="p-0">
                  <pre className="p-6 text-sm font-mono overflow-x-auto">
                    <code className="text-slate-300">
{`// Submit a testimonial
const response = await fetch(
  'https://api.prooflyst.com/v1/testimonials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    site_id: 'site_abc123',
    public_key: 'pl_pub_xxx',
    author: 'Sarah Chen',
    content: 'Amazing product!',
    rating: 5
  }),
});

const data = await response.json();
// { success: true, message: "Testimonial submitted." }`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Three steps to testimonial bliss
            </h2>
            <p className="text-lg text-muted-foreground">
              From signup to production in under 10 minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a site</h3>
              <p className="text-muted-foreground">
                One API call. Get your admin key, public key, and hosted URLs instantly.
              </p>
              <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent -translate-x-6" />
            </div>
            
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect feedback</h3>
              <p className="text-muted-foreground">
                Use our hosted form or build your own. Submit via API with your public key.
              </p>
              <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent -translate-x-6" />
            </div>
            
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Display anywhere</h3>
              <p className="text-muted-foreground">
                Fetch approved testimonials via API. Render them however you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale when you need to. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-border/50 relative overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Starter</h3>
                  <p className="text-sm text-muted-foreground">For side projects</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Up to 100 testimonials
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    1 site
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Hosted submission form
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Moderation dashboard
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Community support
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <p className="text-sm text-muted-foreground">For growing products</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Unlimited testimonials
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Unlimited sites
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Custom domains
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Webhooks
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Remove branding
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Zap className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-lg font-semibold tracking-tight">Prooflyst</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Developer-first API to collect, manage, and serve testimonials. 
                Built for the modern web.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#api" className="hover:text-foreground transition-colors">API Docs</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">GitHub</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Twitter</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Prooflyst. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
