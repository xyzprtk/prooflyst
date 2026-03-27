import { redirect } from "next/navigation";

export default async function SitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  redirect(`/dashboard/sites/${siteId}/settings`);
}
