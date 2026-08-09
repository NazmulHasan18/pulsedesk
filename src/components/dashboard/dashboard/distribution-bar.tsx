import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Segment {
  key: string;
  label: string;
  value: number;
  dotClass: string;
  badgeClass: string;
}

interface DistributionBarProps {
  title: string;
  segments: Segment[];
}

export function DistributionBar({ title, segments }: DistributionBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className="shadow-panel-soft">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-ink">{title}</CardTitle>
        <span className="text-xs text-muted-foreground">{total.toLocaleString()} total</span>
      </CardHeader>
      <CardContent>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          {total === 0 ? (
            <div className="h-full w-full bg-muted" />
          ) : (
            segments.map((s) =>
              s.value === 0 ? null : (
                <div
                  key={s.key}
                  className={`${s.dotClass} h-full first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${(s.value / total) * 100}%` }}
                  title={`${s.label}: ${s.value}`}
                />
              ),
            )
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {segments.map((s) => (
            <Badge key={s.key} variant="outline" className={s.badgeClass}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${s.dotClass}`} />
              {s.label}
              <span className="ml-1.5 tabular-nums opacity-70">{s.value}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
