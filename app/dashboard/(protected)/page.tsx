import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { getAdminKey } from "@/lib/session";
import { hashKey } from "@/lib/keys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

async function approveTestimonial(formData: FormData) {
  "use server";
  await updateStatus(formData, "approved");
}

async function markPending(formData: FormData) {
  "use server";
  await updateStatus(formData, "pending");
}

async function deleteTestimonial(formData: FormData) {
  "use server";
  await updateStatus(formData, "deleted");
}

async function updateStatus(formData: FormData, status: "approved" | "pending" | "deleted") {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const adminKey = await getAdminKey();
  if (!adminKey) return;

  const [site] = await db
    .select({ id: sites.id, slug: sites.slug })
    .from(sites)
    .where(eq(sites.adminKey, hashKey(adminKey)))
    .limit(1);

  if (!site) return;

  await db
    .update(testimonials)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(testimonials.id, id), eq(testimonials.siteId, site.id)));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/sites/${site.id}`);
  revalidatePath(`/wall/${site.slug}`);
}

export default async function DashboardPage() {
  const adminKey = await getAdminKey();
  if (!adminKey) {
    redirect("/dashboard/login");
  }

  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.adminKey, hashKey(adminKey)))
    .limit(1);

  if (!site) {
    redirect("/dashboard/setup");
  }

  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.siteId, site.id))
    .orderBy(desc(testimonials.createdAt))
    .limit(100);

  const stats = {
    total: rows.length,
    approved: rows.filter((row) => row.status === "approved").length,
    pending: rows.filter((row) => row.status === "pending").length,
    deleted: rows.filter((row) => row.status === "deleted").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage testimonials for <span className="font-medium">{site.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/t/${site.slug}`}
            className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-accent"
          >
            Open hosted form
          </a>
          <a
            href={`/wall/${site.slug}`}
            className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-accent"
          >
            Open wall
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Deleted" value={stats.deleted} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No testimonials yet. Share your hosted form to start collecting:
              <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">/t/{site.slug}</code>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Author</th>
                    <th className="py-2 pr-3 font-medium">Content</th>
                    <th className="py-2 pr-3 font-medium">Rating</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-0 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b align-top">
                      <td className="py-3 pr-3 font-medium">{row.author}</td>
                      <td className="max-w-md py-3 pr-3 text-muted-foreground">{row.content}</td>
                      <td className="py-3 pr-3">{row.rating ?? "-"}</td>
                      <td className="py-3 pr-3">
                        <span className="rounded bg-muted px-2 py-1 text-xs capitalize">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <form action={approveTestimonial}>
                            <input type="hidden" name="id" value={row.id} />
                            <Button size="sm">Approve</Button>
                          </form>
                          <form action={markPending}>
                            <input type="hidden" name="id" value={row.id} />
                            <Button size="sm" variant="outline">
                              Pending
                            </Button>
                          </form>
                          <form action={deleteTestimonial}>
                            <input type="hidden" name="id" value={row.id} />
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm">
      <CardContent className="py-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
