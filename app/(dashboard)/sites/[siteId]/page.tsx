export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
      <p className="text-muted-foreground">
        Manage testimonials for site {siteId}.
      </p>
    </div>
  );
}
