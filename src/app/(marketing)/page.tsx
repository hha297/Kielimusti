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
    <div className="flex min-h-screen flex-col items-center px-6 py-16 md:py-24">
      <div className="flex w-full max-w-3xl flex-col items-center gap-10">
        <div className="max-w-lg text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Personal language memory
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Kielimuisti</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Capture what you learn, organize it by language and type, and review on your own terms. Built for
            self‑learners who want structure without a fixed curriculum.
          </p>
        </div>

        {signedIn ? (
          <div className="flex w-full max-w-xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{greetingName}</span>
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
              <Link href="/profile" className={buttonVariants({ variant: "ghost" })}>
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

        <div className="w-full border-t border-border/60 pt-10">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What you can do
          </p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card
                  className={cn(
                    "h-full border-border/80 bg-card/40 text-left shadow-none backdrop-blur-sm transition-colors hover:bg-card/60",
                  )}
                >
                  <CardHeader className="gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-muted-foreground">
                      <Icon className="size-5 opacity-90" aria-hidden />
                    </div>
                    <CardTitle className="text-base font-semibold leading-snug">{title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
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
