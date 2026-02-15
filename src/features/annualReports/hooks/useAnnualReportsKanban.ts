import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { annualReportsApi } from "../../../api/annualReports.api";
import { getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

export const STAGE_ORDER = [
  "material_collection",
  "in_progress",
  "final_review",
  "client_signature",
  "transmitted",
] as const;

export type StageKey = (typeof STAGE_ORDER)[number];

export interface KanbanStage {
  stage: StageKey;
  reports: {
    id: number;
    client_id: number;
    client_name: string;
    tax_year: number;
    days_until_due: number | null;
  }[];
}

export const useAnnualReportsKanban = () => {
  const queryClient = useQueryClient();
  const [transitioning, setTransitioning] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const kanbanQuery = useQuery({
    queryKey: ["tax", "annual-reports", "kanban"],
    queryFn: () => annualReportsApi.getKanbanView(),
  });

  const transitionMutation = useMutation({
    mutationFn: async ({ reportId, newStage }: { reportId: number; newStage: StageKey }) =>
      annualReportsApi.transitionAnnualReport(reportId, newStage),
    onSuccess: () => {
      toast.success("דוח הועבר בהצלחה");
      queryClient.invalidateQueries({ queryKey: ["tax", "annual-reports"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בהעברת דוח"));
    },
    onSettled: () => {
      setTransitioning(null);
    },
  });

  const handleTransition = async (
    reportId: number,
    currentStage: StageKey,
    direction: "forward" | "back"
  ) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex === -1) return;
    const newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= STAGE_ORDER.length) return;
    const newStage = STAGE_ORDER[newIndex];
    setTransitioning(reportId);
    await transitionMutation.mutateAsync({ reportId, newStage });
  };

  const stages: KanbanStage[] = kanbanQuery.data?.stages || [];
  const maxCount = Math.max(0, ...stages.map((stage) => stage.reports.length));
  const totalPages = Math.max(1, Math.ceil(maxCount / PAGE_SIZE));

  return {
    stages,
    transitioning,
    setTransitioning,
    handleTransition,
    kanbanQuery,
    page,
    setPage,
    PAGE_SIZE,
    totalPages,
  };
};
