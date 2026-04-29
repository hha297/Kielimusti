import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
};

export function Header({ title, description, eyebrow, action, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-5xl font-semibold uppercase tracking-wider">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
