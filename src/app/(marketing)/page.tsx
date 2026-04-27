import Link from "next/link";
import { BookOpen, LayoutDashboard, Library, Sparkles, UserCircle2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function MarketingPage() {
  const session = await getSession();
  const user = session?.user;
  const signedIn = Boolean(user);
  const greetingName =
    user && typeof user.name === "string" && user.name.trim().length > 0
      ? user.name.trim()
      : user?.email ?? "there";

  const highlights = [
    {
      icon: Library,
      title: "Structured entries",
      description: "Vocabulary, grammar, and notes in one model—titles, languages, and rich text when you need it.",
    },
    {
      icon: Sparkles,
      title: "Your own taxonomy",
      description: "Tag and filter by language and type so the corpus stays browsable as it grows.",
    },
    {
      icon: BookOpen,
      title: "Review on demand",
      description: "A dedicated review space so recall stays separate from capture—no fixed deck required.",
    },
  ] as const;

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-20 md:py-28">

      <div className="relative z-[1] flex w-full max-w-3xl flex-col items-center gap-12">
        <div className="max-w-lg text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-normal uppercase tracking-[0.04em] text-[#141413]">
            <span className="text-light-signal-orange" aria-hidden>
              ●
            </span>
            <span>Personal language memory</span>
          </p>
          <h1 className="mt-4 text-4xl font-normal leading-none tracking-[-0.02em] text-[#141413] md:text-6xl">
            Kielimuisti
          </h1>
          <p className="mt-5 text-base font-normal leading-relaxed text-muted-foreground">
            Capture what you learn, organize it by language and type, and review on your own terms. Built for
            self‑learners who want structure without a fixed curriculum.
          </p>
        </div>

        {signedIn ? (
          <div className="flex w-full max-w-xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{greetingName}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/dashboard" className={buttonVariants()}>
                <LayoutDashboard className="size-4 opacity-80" aria-hidden />
                Dashboard
              </Link>
              <Link href="/entries" className={buttonVariants({ variant: "outline" })}>
                <Library className="size-4 opacity-80" aria-hidden />
                Entries
              </Link>
              <Link href="/review" className={buttonVariants({ variant: "outline" })}>
                <BookOpen className="size-4 opacity-80" aria-hidden />
                Review
              </Link>
              <Link href="/profile" className={buttonVariants({ variant: "outline" })}>
                <UserCircle2 className="size-4 opacity-80" aria-hidden />
                Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-in" className={buttonVariants()}>
              Sign in
            </Link>
            <Link href="/sign-up" className={buttonVariants({ variant: "outline" })}>
              Create account
            </Link>
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
              Dashboard
            </Link>
          </div>
        )}

        <div className="w-full border-t border-border pt-12">
          <p className="mb-8 flex items-center justify-center gap-2 text-sm font-normal uppercase tracking-[0.04em] text-muted-foreground">
            <span className="text-light-signal-orange" aria-hidden>
              ●
            </span>
            <span>What you can do</span>
          </p>
          <ul className="grid gap-6 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className={cn("h-full text-left transition-shadow hover:shadow-[var(--shadow-elevated)]")}>
                  <CardHeader className="gap-4">
                    <div className="relative mx-auto flex size-[4.5rem] items-center justify-center rounded-full border border-border bg-white shadow-[var(--shadow-float)]">
                      <Icon className="size-6 text-[#141413] opacity-80" aria-hidden />
                    </div>
                    <CardTitle className="text-center text-lg tracking-[-0.02em]">{title}</CardTitle>
                    <CardDescription className="text-center text-sm leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
