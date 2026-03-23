import { useQuery } from "@tanstack/react-query";
import { getYear } from "date-fns";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { annualReportSeasonApi } from "@/features/annualReports/api";
import { QK } from "../../../lib/queryKeys";
import { cn } from "../../../utils/utils";

const currentYear = getYear(new Date());

export const SeasonSummaryWidget: React.FC = () => {
  const { data, isPending } = useQuery({
    queryKey: QK.tax.annualReports.seasonSummary(currentYear),
    queryFn: () => annualReportSeasonApi.getSeasonSummary(currentYear),
  });

  if (isPending) {
    return (
      <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
    );
  }

  if (!data || data.total === 0) return null;

  const completionPct = Math.round(data.completion_rate);
  const inProgress = data.total - data.not_started - data.submitted - data.accepted - data.closed;
  const done = data.submitted + data.accepted + data.closed;

  const progressColor =
    completionPct >= 75 ? "bg-green-500" :
    completionPct >= 40 ? "bg-blue-500" :
    "bg-amber-500";

  return (
    <Link
      to="/tax/reports"
      className={cn(
        "block rounded-2xl border border-gray-100 bg-white p-5",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60",
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            עונת הגשה {currentYear}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-gray-900">
            {done} / {data.total} דוחות הוגשו
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {data.overdue_count > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-600">
                {data.overdue_count} באיחור
              </span>
            </div>
          )}
          {data.overdue_count === 0 && done > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-semibold text-green-600">ללא איחורים</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700">{completionPct}%</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-2 rounded-full transition-all duration-700", progressColor)}
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        {data.not_started > 0 && (
          <span>
            <span className="font-semibold text-gray-700">{data.not_started}</span> לא התחילו
          </span>
        )}
        {inProgress > 0 && (
          <span>
            <span className="font-semibold text-blue-600">{inProgress}</span> בעבודה
          </span>
        )}
        {data.submitted > 0 && (
          <span>
            <span className="font-semibold text-green-600">{data.submitted}</span> הוגשו
          </span>
        )}
        {data.closed > 0 && (
          <span>
            <span className="font-semibold text-gray-400">{data.closed}</span> סגורים
          </span>
        )}
      </div>
    </Link>
  );
};

SeasonSummaryWidget.displayName = "SeasonSummaryWidget";
