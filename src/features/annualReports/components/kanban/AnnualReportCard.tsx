import { ArrowRight, ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { staggerDelay } from "../../../../utils/animation";
import { cn } from "../../../../utils/utils";
import type { StageKey } from "../../types";

interface AnnualReportCardProps {
  report: {
    id: number;
    client_id: number;
    client_name: string;
    tax_year: number;
    days_until_due: number | null;
  };
  stageKey: StageKey;
  isTransitioning: boolean;
  canMoveBack: boolean;
  canMoveForward: boolean;
  onTransition: (reportId: number, stageKey: StageKey, dir: "forward" | "back") => void;
  onOpenDetail: (reportId: number) => void;
  animationIndex: number;
}

const DeadlinePill: React.FC<{ days: number | null }> = ({ days }) => {
  if (days === null) return null;

  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
        <AlertTriangle className="h-3 w-3" />
        באיחור {Math.abs(days)} ימים
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
        <Clock className="h-3 w-3" />
        {days} ימים נותרו
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
      <Clock className="h-3 w-3" />
      {days} ימים
    </span>
  );
};

export const AnnualReportCard: React.FC<AnnualReportCardProps> = ({
  report,
  stageKey,
  isTransitioning,
  canMoveBack,
  canMoveForward,
  onTransition,
  onOpenDetail,
  animationIndex,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 animate-scale-in",
        "hover:shadow-md hover:border-gray-300",
        isTransitioning && "opacity-60 pointer-events-none",
      )}
      style={{ animationDelay: staggerDelay(animationIndex) }}
    >
      {/* Clickable main area */}
      <button
        type="button"
        onClick={() => onOpenDetail(report.id)}
        className="w-full text-right px-4 pt-4 pb-3 block"
        aria-label={`${report.client_name}, שנת ${report.tax_year}${report.days_until_due !== null && report.days_until_due < 0 ? `, באיחור ${Math.abs(report.days_until_due)} ימים` : report.days_until_due !== null ? `, ${report.days_until_due} ימים נותרו` : ""}`}
      >
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="truncate text-sm font-semibold text-gray-900 leading-tight flex-1">
            {report.client_name}
          </h3>
          <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500 tabular-nums">
            {report.tax_year}
          </span>
        </div>
        {report.days_until_due !== null && (
          <div className="mt-1.5">
            <DeadlinePill days={report.days_until_due} />
          </div>
        )}
      </button>

      {/* Arrow row */}
      <div className="flex items-center justify-between border-t border-gray-100 px-2 py-2">
        {canMoveBack ? (
          <button
            type="button"
            onClick={() => onTransition(report.id, stageKey, "back")}
            disabled={isTransitioning}
            aria-label="שלב קודם"
            className="rounded-lg p-1.5 transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="w-[26px]" aria-hidden="true" />
        )}

        <span className="text-xs text-gray-400 select-none">העבר שלב</span>

        {canMoveForward ? (
          <button
            type="button"
            onClick={() => onTransition(report.id, stageKey, "forward")}
            disabled={isTransitioning}
            aria-label="שלב הבא"
            className={cn(
              "rounded-lg p-1.5 transition-colors text-primary-500 hover:bg-primary-50 hover:text-primary-700",
              isTransitioning && "animate-pulse",
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="w-[26px]" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
