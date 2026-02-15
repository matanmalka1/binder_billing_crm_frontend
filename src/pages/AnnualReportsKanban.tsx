import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Calendar, ChevronLeft, User, AlertCircle } from "lucide-react";
import { annualReportsApi, type KanbanStageResponse } from "../api/annualReports.api";
import { getReportStageLabel, getStageColor } from "../api/annualReports.utils";
import { getErrorMessage } from "../utils/utils";
import { toast } from "../utils/toast";

const STAGE_ORDER = [
  "material_collection",
  "in_progress",
  "final_review",
  "client_signature",
  "transmitted",
];

export const AnnualReportsKanban: React.FC = () => {
  const queryClient = useQueryClient();
  const [transitioning, setTransitioning] = useState<number | null>(null);

  // Fetch kanban data
  const kanbanQuery = useQuery({
    queryKey: ["tax", "annual-reports", "kanban"],
    queryFn: () => annualReportsApi.getKanbanView(),
  });

  // Transition mutation
  const transitionMutation = useMutation({
    mutationFn: async ({ reportId, newStage }: { reportId: number; newStage: string }) => {
      return annualReportsApi.transitionAnnualReport(reportId, newStage);
    },
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

  const handleTransition = async (reportId: number, currentStage: string, direction: "forward" | "back") => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex === -1) return;

    const newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= STAGE_ORDER.length) return;

    const newStage = STAGE_ORDER[newIndex];
    setTransitioning(reportId);
    await transitionMutation.mutateAsync({ reportId, newStage });
  };

  if (kanbanQuery.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="לוח דוחות שנתיים" description="תצוגת קנבן לפי שלבי עבודה" />
        <PageLoading message="טוען לוח דוחות..." />
      </div>
    );
  }

  if (kanbanQuery.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="לוח דוחות שנתיים" />
        <ErrorCard message={getErrorMessage(kanbanQuery.error, "שגיאה בטעינת לוח דוחות")} />
      </div>
    );
  }

  const stages = kanbanQuery.data?.stages || [];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <PageHeader
        title="לוח דוחות שנתיים"
        description="ניהול ומעקב אחר דוחות שנתיים בתצוגת קנבן"
        variant="gradient"
      />

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {STAGE_ORDER.map((stageKey, stageIndex) => {
            const stageData = stages.find((s: KanbanStageResponse) => s.stage === stageKey);
            const reports = stageData?.reports || [];

            return (
              <div
                key={stageKey}
                className="w-80 shrink-0 animate-fade-in"
                style={{ animationDelay: `${stageIndex * 100}ms` }}
              >
                {/* Column Header */}
                <div className="mb-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {getReportStageLabel(stageKey)}
                    </h3>
                    <Badge className={getStageColor(stageKey)}>
                      {reports.length}
                    </Badge>
                  </div>
                  <div className="h-1 w-full rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {reports.length === 0 ? (
                    <Card className="border-dashed">
                      <div className="py-8 text-center text-gray-400">
                        <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm">אין דוחות בשלב זה</p>
                      </div>
                    </Card>
                  ) : (
                    reports.map((report, index) => {
                      const isTransitioning = transitioning === report.id;
                      const canMoveBack = stageIndex > 0;
                      const canMoveForward = stageIndex < STAGE_ORDER.length - 1;

                      return (
                        <Card
                          key={report.id}
                          variant="elevated"
                          className="group hover:shadow-elevation-3 transition-all duration-200 animate-scale-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Report Info */}
                          <div className="mb-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="text-base font-bold text-gray-900 leading-tight">
                                  {report.client_name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  לקוח #{report.client_id}
                                </p>
                              </div>
                              <Badge variant="info" className="shrink-0 font-mono">
                                {report.tax_year}
                              </Badge>
                            </div>

                            {report.days_until_due !== null && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className={cn(
                                  "font-medium",
                                  report.days_until_due < 0 && "text-red-600",
                                  report.days_until_due >= 0 && report.days_until_due <= 7 && "text-orange-600",
                                  report.days_until_due > 7 && "text-gray-600"
                                )}>
                                  {report.days_until_due < 0 
                                    ? `באיחור ${Math.abs(report.days_until_due)} ימים`
                                    : `${report.days_until_due} ימים למועד`
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 border-t border-gray-100 pt-3">
                            {canMoveBack && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleTransition(report.id, stageKey, "back")}
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
                                onClick={() => handleTransition(report.id, stageKey, "forward")}
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
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-primary-600" />
          <h4 className="text-sm font-semibold text-gray-900">מקרא</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-5">
          {STAGE_ORDER.map((stage) => (
            <div key={stage} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", getStageColor(stage).split(' ')[0])} />
              <span className="text-gray-700">{getReportStageLabel(stage)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Helper
const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
