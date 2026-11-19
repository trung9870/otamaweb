import { InfoPageView } from "@/components/sites/brooklinen/InfoPageView";

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <InfoPageView slug={slug} section="pages" />;
}
