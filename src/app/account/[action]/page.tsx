import { InfoPageView } from "@/components/sites/brooklinen/InfoPageView";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { action } = await params;
  return <InfoPageView slug={action} section="account" />;
}
