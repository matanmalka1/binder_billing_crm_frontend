import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Info, Clock, AlertTriangle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { staggerDelay } from "../../../utils/animation";
import { cn } from "../../../utils/utils";
import type { StageKey } from "../hooks/useAnnualReportsKanban";

interface Props {
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
  animationIndex: number;
}

const DeadlinePill: React.FC<{ days: number | null }> = ({ days }) => {
  if (days === null) return null;

  if (days < 0) {
    return (
      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
        <AlertTriangle className="h-3 w-3" />
        באיחור {Math.abs(days)} ימים
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
        <Clock className="h-3 w-3" />
        {days} ימים נותרו
      </span>
    );
  }
  return (
    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
      <Clock className="h-3 w-3" />
      {days} ימים
    </span>
  );
};

export const AnnualReportCard: React.FC<Props> = ({
  report, stageKey, isTransitioning, canMoveBack, canMoveForward, onTransition, animationIndex,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Card
        variant="elevated"
        className="transition-all duration-200 animate-scale-in hover:shadow-md"
        style={{ animationDelay: staggerDelay(animationIndex) }}
      >
        {/* Client name + year badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900 leading-tight">
              {report.client_name}
            </h4>
            <DeadlinePill days={report.days_until_due} />
          </div>
          <Badge variant="info" className="shrink-0 font-mono text-xs">
            {report.tax_year}
          </Badge>
        </div>

        {/* Action row */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
          {/* Back arrow */}
          <button
            type="button"
            onClick={() => onTransition(report.id, stageKey, "back")}
            disabled={!canMoveBack || isTransitioning}
            aria-label="שלב קודם"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              canMoveBack
                ? "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                : "invisible pointer-events-none"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tax/reports/${report.id}`)}
            className="gap-1 text-xs px-2"
          >
            <Info className="h-3.5 w-3.5" />
            פרטים
          </Button>

          {/* Forward arrow */}
          <button
            type="button"
            onClick={() => onTransition(report.id, stageKey, "forward")}
            disabled={!canMoveForward || isTransitioning}
            aria-label="שלב הבא"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              canMoveForward
                ? "text-primary-500 hover:bg-primary-50 hover:text-primary-700"
                : "invisible pointer-events-none",
              isTransitioning && "animate-pulse"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </Card>

    </>
  );
};
