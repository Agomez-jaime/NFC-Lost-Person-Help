import TagView from "./TagView";

export default async function TagPage({ params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params;
  return <TagView tagId={tagId} />;
}
