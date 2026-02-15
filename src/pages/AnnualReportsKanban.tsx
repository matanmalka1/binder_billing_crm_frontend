import { PageHeader } from "../components/layout/PageHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import {
  useAnnualReportsKanban,
  STAGE_ORDER,
  type StageKey,
} from "../features/annualReports/hooks/useAnnualReportsKanban";
import { AnnualReportColumn } from "../features/annualReports/components/AnnualReportColumn";
import { AnnualReportsLegend } from "../features/annualReports/components/AnnualReportsLegend";

export const AnnualReportsKanban: React.FC = () => {
  const {
    stages,
    transitioning,
    handleTransition,
    kanbanQuery,
    page,
    setPage,
    PAGE_SIZE,
    totalPages,
  } = useAnnualReportsKanban();

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
        <ErrorCard message={"שגיאה בטעינת לוח דוחות"} />
      </div>
    );
  }

  const maxCount = Math.max(0, ...stages.map((stage) => stage.reports.length));

  return (
    <div className="space-y-6">
      <PageHeader
        title="לוח דוחות שנתיים"
        description="ניהול ומעקב אחר דוחות שנתיים בתצוגת קנבן"
        variant="gradient"
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2">
          {STAGE_ORDER.map((stageKey, stageIndex) => {
            const stageData = stages.find((s) => s.stage === stageKey as StageKey);
            return (
              <AnnualReportColumn
                key={stageKey}
                stage={stageData || { stage: stageKey as StageKey, reports: [] }}
                stageIndex={stageIndex}
                page={page}
                pageSize={PAGE_SIZE}
                transitioningId={transitioning}
                onTransition={handleTransition}
              />
            );
          })}
        </div>
      </div>

      <AnnualReportsLegend />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={maxCount}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
