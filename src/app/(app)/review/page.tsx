import { listEntriesForCurrentWorkspace } from "@/features/entries/actions";
import { ReviewSetup } from "@/features/review/review-setup";

export default async function ReviewPage() {
  const rows = await listEntriesForCurrentWorkspace();
  const serializedRows = rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
    meaning: row.meaning,
    payload: row.payload,
    languages: row.languages ?? [],
  }));

  return (
    <ReviewSetup rows={serializedRows} />
  );
}
