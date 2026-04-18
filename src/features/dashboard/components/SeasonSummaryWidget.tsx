import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";
import { semanticMonoToneClasses, semanticSignalBadgeClasses } from "@/utils/semanticColors";
import { useSeasonSummary } from "../hooks/useSeasonSummary";

export const SeasonSummaryWidget: React.FC = () => {
  const { stats, isPending } = useSeasonSummary();

  if (isPending) {
    return <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />;
  }

  if (!stats || stats.total === 0) return null;

  return (
    <Link
      to="/tax/reports"
      className={cn(
        "block rounded-2xl border border-gray-100 bg-white p-5",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            עונת הגשה {stats.currentYear}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-gray-900">
            {stats.done} / {stats.total} דוחות הוגשו
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {stats.hasOverdue ? (
            <div className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1", semanticSignalBadgeClasses.negative)}>
              <AlertTriangle className="h-3.5 w-3.5 text-negative-500" />
              <span className="text-xs font-semibold text-negative-600">
                {stats.overdueCount} באיחור
              </span>
            </div>
          ) : stats.done > 0 && (
            <div className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1", semanticSignalBadgeClasses.positive)}>
              <CheckCircle className="h-3.5 w-3.5 text-positive-500" />
              <span className="text-xs font-semibold text-positive-700">ללא איחורים</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">{stats.completionPct}%</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-2 rounded-full transition-all duration-700", stats.progressColor)}
          style={{ width: `${stats.completionPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <StatLabel count={stats.notStarted} label="לא התחילו" />
        <StatLabel count={stats.inProgress} label="בעבודה" className={semanticMonoToneClasses.info} />
        <StatLabel count={stats.submitted} label="הוגשו" className={semanticMonoToneClasses.positive} />
        <StatLabel count={stats.closed} label="סגורים" />
      </div>
    </Link>
  );
};

/** קומפוננטת עזר פנימית להצגת פריט סטטיסטיקה */
const StatLabel = ({ count, label, className }: { count: number; label: string; className?: string }) => {
  if (count <= 0) return null;
  return (
    <span>
      <span className={cn("font-semibold text-gray-700", className)}>{count}</span> {label}
    </span>
  );
};

SeasonSummaryWidget.displayName = "SeasonSummaryWidget";