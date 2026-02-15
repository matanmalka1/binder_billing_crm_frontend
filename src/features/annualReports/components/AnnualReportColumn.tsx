import { AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { getReportStageLabel, getStageColor } from "../../../api/annualReports.utils";
import type { KanbanStage, StageKey } from "../hooks/useAnnualReportsKanban";
import { AnnualReportCard } from "./AnnualReportCard";

interface Props {
  stage: KanbanStage;
  stageIndex: number;
  page: number;
  pageSize: number;
  transitioningId: number | null;
  onTransition: (reportId: number, stageKey: StageKey, dir: "forward" | "back") => void;
}

export const AnnualReportColumn: React.FC<Props> = ({
  stage,
  stageIndex,
  page,
  pageSize,
  transitioningId,
  onTransition,
}) => {
  const pagedReports = stage.reports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      className="w-56 shrink-0 animate-fade-in"
      style={{ animationDelay: `${stageIndex * 70}ms` }}
    >
      <div className="mb-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2.5 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{getReportStageLabel(stage.stage)}</h3>
          <Badge className={getStageColor(stage.stage)}>{stage.reports.length}</Badge>
        </div>
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
      </div>

      <div className="space-y-1.5">
        {pagedReports.length === 0 ? (
          <Card className="border-dashed">
            <div className="py-8 text-center text-gray-400">
              <AlertCircle className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">אין דוחות בשלב זה</p>
            </div>
          </Card>
        ) : (
          pagedReports.map((report, index) => {
            const canMoveBack = stageIndex > 0;
            const canMoveForward = stageIndex < 4;
            return (
              <AnnualReportCard
                key={report.id}
                report={report}
                stageKey={stage.stage}
                stageIndex={stageIndex}
                isTransitioning={transitioningId === report.id}
                canMoveBack={canMoveBack}
                canMoveForward={canMoveForward}
                onTransition={onTransition}
                animationDelay={index * 40}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
