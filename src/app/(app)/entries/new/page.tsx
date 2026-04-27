import Link from "next/link";

import { EntryCreateForm } from "@/features/entries/entry-create-form";
import { isDatabaseConfigured } from "@/db";

export default function NewEntryPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-5xl font-semibold uppercase tracking-wider">New entry</h1>
          <p className="text-sm text-muted-foreground">
            Configure <span className="font-mono">DATABASE_URL</span> before creating entries.
          </p>
        </div>
        <Link href="/entries" className="text-sm text-foreground underline underline-offset-4">
          Back to entries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-semibold uppercase tracking-wider">New entry</h1>
        <p className="text-sm text-muted-foreground">
          Minimal capture — type-specific fields will refine this flow later.
        </p>
      </div>
      <EntryCreateForm />
    </div>
  );
}
