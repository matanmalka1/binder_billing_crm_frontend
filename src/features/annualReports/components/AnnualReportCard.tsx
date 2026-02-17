import { useState } from "react";
import { Calendar, ChevronLeft, Info } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { staggerDelay } from "../../../utils/animation";
import { cn } from "../../../utils/utils";
import type { StageKey } from "../hooks/useAnnualReportsKanban";
import { AnnualReportDetailModal } from "./AnnualReportDetailModal";

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

export const AnnualReportCard: React.FC<Props> = ({
  report, stageKey, isTransitioning, canMoveBack, canMoveForward, onTransition, animationIndex,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Card
        variant="elevated"
        className="group hover:shadow-elevation-3 transition-all duration-200 animate-scale-in"
        style={{ animationDelay: staggerDelay(animationIndex) }}
      >
        <div className="mb-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-900 leading-tight">{report.client_name}</h4>
              <p className="text-xs text-gray-500 mt-1">לקוח #{report.client_id}</p>
            </div>
            <Badge variant="info" className="shrink-0 font-mono">{report.tax_year}</Badge>
          </div>
          {report.days_until_due !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className={cn("font-medium", report.days_until_due < 0 && "text-red-600", report.days_until_due >= 0 && report.days_until_due <= 7 && "text-orange-600", report.days_until_due > 7 && "text-gray-600")}>
                {report.days_until_due < 0 ? `באיחור ${Math.abs(report.days_until_due)} ימים` : `${report.days_until_due} ימים למועד`}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowDetail(true)} className="gap-1 text-xs">
            <Info className="h-3 w-3" /> פרטים
          </Button>
          {canMoveBack && (
            <Button type="button" variant="outline" size="sm" onClick={() => onTransition(report.id, stageKey, "back")} disabled={isTransitioning} className="flex-1 gap-1">
              <ChevronLeft className="h-3 w-3 rotate-180" /> חזור
            </Button>
          )}
          {canMoveForward && (
            <Button type="button" variant="primary" size="sm" onClick={() => onTransition(report.id, stageKey, "forward")} isLoading={isTransitioning} disabled={isTransitioning} className="flex-1 gap-1">
              {isTransitioning ? "מעביר..." : "קדימה"} <ChevronLeft className="h-3 w-3" />
            </Button>
          )}
        </div>
      </Card>

      <AnnualReportDetailModal
        open={showDetail}
        reportId={report.id}
        clientName={report.client_name}
        taxYear={report.tax_year}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
};
