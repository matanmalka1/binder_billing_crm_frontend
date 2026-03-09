import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { annualReportsApi } from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { STAGE_ORDER, KANBAN_PAGE_SIZE, type StageKey, type KanbanStage } from "../types";

export const useAnnualReportsKanban = (taxYear: number) => {
  const queryClient = useQueryClient();
  const [transitioning, setTransitioning] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const kanbanQuery = useQuery({
    queryKey: QK.tax.annualReports.kanban,
    queryFn: () => annualReportsApi.getKanbanView(),
  });

  const transitionMutation = useMutation({
    mutationFn: async ({ reportId, newStage }: { reportId: number; newStage: StageKey }) =>
      annualReportsApi.transitionStage(reportId, newStage),
    onSuccess: (_data, { reportId }) => {
      toast.success("דוח הועבר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
      const allReports = kanbanQuery.data?.stages.flatMap((s) => s.reports) ?? [];
      const report = allReports.find((r) => r.id === reportId);
      if (report) {
        queryClient.invalidateQueries({ queryKey: QK.timeline.clientRoot(report.client_id) });
      }
    },
    onError: (error) => {
      showErrorToast(error, "שגיאה בהעברת דוח");
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

  // Normalize + filter by taxYear (client-side — kanban API returns all years)
  const stages: KanbanStage[] =
    kanbanQuery.data?.stages
      .map((stage) => {
        const key = stage.stage as StageKey;
        if (!STAGE_ORDER.includes(key)) return null;
        return {
          stage: key,
          reports: stage.reports.filter((r) => r.tax_year === taxYear),
        };
      })
      .filter((s): s is KanbanStage => Boolean(s)) ?? [];

  const maxCount = Math.max(0, ...stages.map((stage) => stage.reports.length));
  const totalPages = Math.max(1, Math.ceil(maxCount / KANBAN_PAGE_SIZE));

  return {
    stages,
    transitioning,
    setTransitioning,
    handleTransition,
    kanbanQuery,
    page,
    setPage,
    totalPages,
    maxCount,
  };
};