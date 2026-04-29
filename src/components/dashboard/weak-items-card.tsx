import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeakItemsCard() {
  return (
    <Card className="border-border bg-card shadow-[var(--shadow-float)]">
      <CardHeader className="px-5 pt-5">
        <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Weak Items
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-sm text-muted-foreground">No weak items yet</p>
      </CardContent>
    </Card>
  );
}
