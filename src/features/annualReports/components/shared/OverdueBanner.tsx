import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { AnnualReportFull } from "../../../../api/annualReport.api";
import { formatDate, cn } from "../../../../utils/utils";

interface OverdueBannerProps {
  overdue: AnnualReportFull[];
  onSelect: (id: number) => void;
}

const daysOverdue = (deadline: string | null): number | null => {
  if (!deadline) return null;
  const diff = Math.floor(
    (Date.now() - new Date(deadline).getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : null;
};

export const OverdueBanner: React.FC<OverdueBannerProps> = ({ overdue, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  if (overdue.length === 0) return null;

  const visible = expanded ? overdue : overdue.slice(0, 3);
  const hasMore = overdue.length > 3;

  return (
    <div
      className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="rounded-lg bg-red-100 p-2 shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-900">
            {overdue.length === 1
              ? "דוח אחד חרג ממועד ההגשה"
              : `${overdue.length} דוחות חרגו ממועד ההגשה`}
          </p>
          <p className="text-xs text-red-700 mt-0.5">
            לחץ על שם הלקוח לפתיחת פרטי הדוח
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-lg p-1.5 text-red-700 hover:bg-red-100 transition-colors"
          aria-label={expanded ? "כווץ רשימה" : "הרחב רשימה"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Report list */}
      <div className="border-t border-red-200/60 px-4 pb-3 pt-2 space-y-1.5">
        {visible.map((report) => {
          const days = daysOverdue(report.filing_deadline);
          return (
            <div
              key={report.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2",
                "bg-white/60 hover:bg-white/90 transition-colors cursor-pointer",
              )}
              onClick={() => onSelect(report.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(report.id)}
            >
              <span className="text-sm font-medium text-gray-900 truncate">
                {report.client_name ?? `לקוח #${report.client_id}`}
              </span>
              <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                <span className="tabular-nums">{formatDate(report.filing_deadline)}</span>
                {days !== null && (
                  <span className="font-semibold text-red-600 tabular-nums">
                    {days} ימים
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full pt-1 text-xs font-medium text-red-700 hover:text-red-900 transition-colors text-center"
            aria-expanded={expanded}
            aria-label={expanded ? "הצג פחות דוחות" : `הצג ${overdue.length - 3} דוחות נוספים שחרגו ממועד ההגשה`}
          >
            {expanded
              ? "הצג פחות"
              : `+ עוד ${overdue.length - 3} דוחות`}
          </button>
        )}
      </div>
    </div>
  );
};

OverdueBanner.displayName = "OverdueBanner";
