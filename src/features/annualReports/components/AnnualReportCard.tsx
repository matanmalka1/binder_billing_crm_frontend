import { Calendar, ChevronLeft } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { getReportStageLabel, getStageColor } from "../../../api/annualReports.utils";
import { staggerDelay } from "../../../utils/animation";
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
  stageIndex: number;
  isTransitioning: boolean;
  canMoveBack: boolean;
  canMoveForward: boolean;
  onTransition: (reportId: number, stageKey: StageKey, dir: "forward" | "back") => void;
  animationIndex: number;
}

export const AnnualReportCard: React.FC<Props> = ({
  report,
  stageKey,
  stageIndex,
  isTransitioning,
  canMoveBack,
  canMoveForward,
  onTransition,
  animationIndex,
}) => (
  <Card
    variant="elevated"
    className="group hover:shadow-elevation-3 transition-all duration-200 animate-scale-in h-[220px] flex flex-col"
    style={{ animationDelay: staggerDelay(animationIndex) }}
  >
    <div className="mb-3 flex-1">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-base font-bold text-gray-900 leading-tight">
            {report.client_name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">לקוח #{report.client_id}</p>
        </div>
        <Badge variant="info" className="shrink-0 font-mono">
          {report.tax_year}
        </Badge>
      </div>

      {report.days_until_due !== null && (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span
            className={cn(
              "font-medium",
              report.days_until_due < 0 && "text-red-600",
              report.days_until_due >= 0 &&
                report.days_until_due <= 7 &&
                "text-orange-600",
              report.days_until_due > 7 && "text-gray-600"
            )}
          >
            {report.days_until_due < 0
              ? `באיחור ${Math.abs(report.days_until_due)} ימים`
              : `${report.days_until_due} ימים למועד`}
          </span>
        </div>
      )}
    </div>

    <div className="flex gap-2 border-t border-gray-100 pt-3 mt-auto">
      {canMoveBack && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onTransition(report.id, stageKey, "back")}
          disabled={isTransitioning}
          className="flex-1 gap-1"
        >
          <ChevronLeft className="h-3 w-3 rotate-180" />
          חזור
        </Button>
      )}
      {canMoveForward && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onTransition(report.id, stageKey, "forward")}
          isLoading={isTransitioning}
          disabled={isTransitioning}
          className="flex-1 gap-1"
        >
          {isTransitioning ? "מעביר..." : "קדימה"}
          <ChevronLeft className="h-3 w-3" />
        </Button>
      )}
    </div>
  </Card>
);

const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");
