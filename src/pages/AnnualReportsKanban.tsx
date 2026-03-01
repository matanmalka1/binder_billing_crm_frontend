import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import { Button } from "../components/ui/Button";
import { AnnualReportColumn } from "../features/annualReports/components/AnnualReportColumn";
import { AnnualReportsLegend } from "../features/annualReports/components/AnnualReportsLegend";
import { AnnualReportDetailDrawer } from "../features/annualReports/components/AnnualReportDetailDrawer";
import { SeasonSummaryCards } from "../features/annualReports/components/SeasonSummaryCards";
import { SeasonProgressBar } from "../features/annualReports/components/SeasonProgressBar";
import { SeasonReportsTable } from "../features/annualReports/components/SeasonReportsTable";
import { CreateReportModal } from "../features/annualReports/components/CreateReportModal";
import { useAnnualReportsKanbanPage } from "../features/annualReports/hooks/useAnnualReportsKanbanPage";
import { STAGE_ORDER, KANBAN_PAGE_SIZE, TAB_LABELS, type ActiveTab } from "../features/annualReports/types";
import { cn } from "../utils/utils";

export const AnnualReportsKanban: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedReportId,
    setSelectedReportId,
    taxYear,
    decrementYear,
    incrementYear,
    canIncrementYear,
    showCreate,
    openCreate,
    closeCreate,
    stages,
    transitioning,
    handleTransition,
    kanbanQuery,
    page,
    setPage,
    totalPages,
    maxCount,
    season,
  } = useAnnualReportsKanbanPage();

  if (kanbanQuery.isPending && activeTab === "kanban") {
    return (
      <div className="space-y-6">
        <PageHeader title="לוח דוחות שנתיים" description="תצוגת קנבן לפי שלבי עבודה" />
        <PageLoading message="טוען לוח דוחות..." />
      </div>
    );
  }

  if (kanbanQuery.error && activeTab === "kanban") {
    return (
      <div className="space-y-6">
        <PageHeader title="לוח דוחות שנתיים" />
        <ErrorCard message="שגיאה בטעינת לוח דוחות" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="לוח דוחות שנתיים"
        description="ניהול ומעקב אחר דוחות שנתיים"
        variant="gradient"
        actions={
          activeTab === "season" ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={decrementYear}
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label="שנה קודמת"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="w-16 text-center text-sm font-bold text-gray-900">
                  {taxYear}
                </span>
                <button
                  type="button"
                  onClick={incrementYear}
                  disabled={!canIncrementYear}
                  className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
                  aria-label="שנה הבאה"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              <Button variant="primary" onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                דוח חדש
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
        {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {activeTab === "kanban" && (
        <>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2">
              {STAGE_ORDER.map((stageKey, stageIndex) => {
                const stageData = stages.find((s) => s.stage === stageKey);
                return (
                  <AnnualReportColumn
                    key={stageKey}
                    stage={stageData ?? { stage: stageKey, reports: [] }}
                    stageIndex={stageIndex}
                    page={page}
                    pageSize={KANBAN_PAGE_SIZE}
                    transitioningId={transitioning}
                    onTransition={handleTransition}
                    onOpenDetail={setSelectedReportId}
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
        </>
      )}

      {activeTab === "season" && (
        <>
          {season.isLoading && <PageLoading message="טוען נתוני עונה..." />}
          {season.error && <ErrorCard message={season.error} />}

          {!season.isLoading && !season.error && season.summary && (
            <>
              <SeasonSummaryCards summary={season.summary} />
              <SeasonProgressBar summary={season.summary} />
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  כל הדוחות — שנת מס {taxYear}
                </h2>
                <SeasonReportsTable
                  reports={season.reports}
                  isLoading={season.isLoading}
                  onSelect={(report) => setSelectedReportId(report.id)}
                />
              </div>
            </>
          )}

          {!season.isLoading && !season.error && !season.summary && (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
              <p className="text-lg font-medium">אין דוחות לשנת מס {taxYear}</p>
              <p className="mt-1 text-sm">לחץ על "דוח חדש" כדי להתחיל</p>
            </div>
          )}
        </>
      )}

      <AnnualReportDetailDrawer
        reportId={selectedReportId}
        onClose={() => setSelectedReportId(null)}
      />

      <CreateReportModal open={showCreate} onClose={closeCreate} />
    </div>
  );
};
