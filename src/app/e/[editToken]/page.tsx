import EditView from "./EditView";

export default async function EditPage({ params }: { params: Promise<{ editToken: string }> }) {
  const { editToken } = await params;
  return <EditView editToken={editToken} />;
}
