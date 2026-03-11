import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";
import {
  getStatusLabel,
  getStatusVariant,
} from "../../../../api/annualReport.extended.utils";
import type {
  AnnualReportFull,
  ReportDetailResponse,
  StatusTransitionPayload,
} from "../../../../api/annualReport.api";
import { StatusTransitionPanel } from "../statusTransition/StatusTransitionPanel";
import { ReadinessCheckPanel } from "./ReadinessCheckPanel";

interface AnnualReportSidebarStatusProps {
  report: AnnualReportFull;
  detail: ReportDetailResponse | null;
  availableActions: string[];
  onTransition: (payload: StatusTransitionPayload) => void;
}

export const AnnualReportSidebarStatus = ({
  report,
  onTransition,
}: AnnualReportSidebarStatusProps) => {
  const [readinessOpen, setReadinessOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = async (payload: StatusTransitionPayload) => {
    setIsTransitioning(true);
    try {
      onTransition(payload);
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">סטטוס:</span>
        <Badge variant={getStatusVariant(report.status)}>
          {getStatusLabel(report.status)}
        </Badge>
      </div>

      <StatusTransitionPanel
        report={report}
        onTransition={handleTransition}
        isLoading={isTransitioning}
      />

      <div className="rounded-lg border border-gray-200">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setReadinessOpen((prev) => !prev)}
        >
          <span>בדיקת מוכנות להגשה</span>
          {readinessOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {readinessOpen && (
          <div className="border-t border-gray-200 px-4 py-3">
            <ReadinessCheckPanel reportId={report.id} />
          </div>
        )}
      </div>
    </div>
  );
};

AnnualReportSidebarStatus.displayName = "AnnualReportSidebarStatus";
