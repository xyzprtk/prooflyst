export default async function SiteSettingsPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Site Settings</h1>
      <p className="text-muted-foreground">
        Configure settings for site {siteId}.
      </p>
    </div>
  );
}
