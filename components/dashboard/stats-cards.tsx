import { MessageSquare, Clock, CheckCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  pending: number;
  approved: number;
  deleted: number;
}

export function StatsCards({ total, pending, approved, deleted }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <StatCard
        icon={MessageSquare}
        label="Total"
        value={total}
        description="All testimonials"
      />
      <StatCard
        icon={Clock}
        label="Pending"
        value={pending}
        description="Awaiting review"
        highlight={pending > 0}
      />
      <StatCard
        icon={CheckCircle}
        label="Approved"
        value={approved}
        description="Published"
      />
      <StatCard
        icon={Trash2}
        label="Trash"
        value={deleted}
        description="Deleted items"
        variant="deleted"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  highlight = false,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
  highlight?: boolean;
  variant?: "deleted";
}) {
  return (
    <Card size="sm" className={highlight ? "border-primary/50 bg-primary/5" : undefined}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div
            className={`rounded-lg p-2 ${
              variant === "deleted"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : highlight
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}