import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
  danger?: boolean;
};

export function SettingsSection({ title, description, children, danger }: SettingsSectionProps) {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader className="px-5 pt-5">
        <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription className={danger ? "text-muted-foreground" : undefined}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">{children}</CardContent>
    </Card>
  );
}
