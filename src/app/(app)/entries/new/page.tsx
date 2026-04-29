import Link from "next/link";

import { Header } from "@/components/header";
import { EntryCreateForm } from "@/features/entries/entry-create-form";
import { isDatabaseConfigured } from "@/db";

export default function NewEntryPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Header
          eyebrow="Create"
          title="New entry"
          description={
            <>
              Configure <span className="font-mono">DATABASE_URL</span> before creating entries.
            </>
          }
          className="sm:items-start"
        />
        <Link href="/entries" className="text-sm text-foreground underline underline-offset-4">
          Back to entries
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Header
        eyebrow="Create"
        title="New entry"
        description="Minimal capture — type-specific fields will refine this flow later."
        className="sm:items-start"
      />
      <EntryCreateForm />
    </div>
  );
}
