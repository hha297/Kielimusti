import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24">
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Personal language memory
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Kielimuisti
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Capture what you learn, organize it by language and type, and review on your own terms.
          Built for self‑learners who want structure without a fixed curriculum.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/entries" className={buttonVariants()}>
          Open app
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
