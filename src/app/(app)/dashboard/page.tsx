import { DueTodayCard } from "@/components/dashboard/due-today-card";
import { RecentEntriesCard } from "@/components/dashboard/recent-entries-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeakItemsCard } from "@/components/dashboard/weak-items-card";
import { Header } from "@/components/header";
import { listEntriesForCurrentWorkspace } from "@/features/entries/actions";

const DASHBOARD_DUE_TODAY_MOCK = 12;

export default async function DashboardPage() {
  const entries = await listEntriesForCurrentWorkspace().catch(() => []);
  const recentEntries = entries
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);

  const vocabularyCount = entries.filter((entry) => entry.type === "vocabulary").length;
  const grammarCount = entries.filter((entry) => entry.type === "grammar").length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Header
        eyebrow="Overview"
        title="Dashboard"
        description="Track what to review next and keep your recent learning context close."
      />
      <DueTodayCard dueCount={DASHBOARD_DUE_TODAY_MOCK} />
      <RecentEntriesCard entries={recentEntries} />
      <div className="grid gap-6 lg:grid-cols-2">
        <WeakItemsCard />
        <StatsGrid
          totalEntries={entries.length}
          vocabularyCount={vocabularyCount}
          grammarCount={grammarCount}
        />
      </div>
    </div>
  );
}
