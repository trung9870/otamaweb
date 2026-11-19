import { CollectionView } from "@/components/sites/brooklinen/CollectionView";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionView slug={slug} />;
}
