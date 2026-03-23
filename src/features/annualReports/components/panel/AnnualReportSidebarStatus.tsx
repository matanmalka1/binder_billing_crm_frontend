import { useState } from "react";
import type { AnnualReportFull, ReportDetailResponse, StatusTransitionPayload } from "../../api";
import { StatusTransitionPanel } from "../statusTransition/StatusTransitionPanel";

interface AnnualReportSidebarStatusProps {
  report: AnnualReportFull;
  detail: ReportDetailResponse | null;
  availableActions: string[];
  onTransition: (payload: StatusTransitionPayload) => void;
}

export const AnnualReportSidebarStatus = ({ report, onTransition }: AnnualReportSidebarStatusProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransition = async (payload: StatusTransitionPayload) => {
    setIsTransitioning(true);
    try { onTransition(payload); } finally { setIsTransitioning(false); }
  };

  return (
    <div className="p-4">
      <StatusTransitionPanel report={report} onTransition={handleTransition} isLoading={isTransitioning} />
    </div>
  );
};

AnnualReportSidebarStatus.displayName = "AnnualReportSidebarStatus";
