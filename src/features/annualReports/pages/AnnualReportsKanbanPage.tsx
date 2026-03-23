import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, BarChart2, FileDown } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLoading } from "@/components/ui/PageLoading";
import { Alert } from "@/components/ui/Alert";
import { PaginationCard } from "@/components/ui/PaginationCard";
import { Button } from "@/components/ui/Button";
import { AnnualReportColumn } from "@/features/annualReports/components/kanban/AnnualReportColumn";
import { SeasonSummaryCards } from "@/features/annualReports/components/kanban/SeasonSummaryCards";
import { SeasonProgressBar } from "@/features/annualReports/components/kanban/SeasonProgressBar";
import { SeasonReportsTable } from "@/features/annualReports/components/kanban/SeasonReportsTable";
import { CreateReportModal } from "@/features/annualReports/components/shared/CreateReportModal";
import { useAnnualReportsKanbanPage } from "@/features/annualReports/hooks/useAnnualReportsKanbanPage";
import { STAGE_ORDER, KANBAN_PAGE_SIZE, TAB_LABELS, type ActiveTab } from "@/features/annualReports/types";
import { OverdueBanner } from "@/features/annualReports/components/shared/OverdueBanner";
import { YearComparisonModal } from "@/features/annualReports/components/kanban/YearComparisonModal";
import { AnnualReportStatusView } from "@/features/reports/components/AnnualReportStatusView";
import { cn } from "@/utils/utils";

export const AnnualReportsKanban: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);
  const openComparison = () => setShowComparison(true);
  const closeComparison = () => setShowComparison(false);

  const {
    activeTab,
    setActiveTab,
    taxYear,
    decrementYear,
    incrementYear,
    canIncrementYear,
    showCreate,
    openCreate,
    closeCreate,
    openReport,
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
        <Alert variant="error" message="שגיאה בטעינת לוח דוחות" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow"
      >
        דלג לתוכן הראשי
      </a>
      <PageHeader
        title="לוח דוחות שנתיים"
        description="ניהול ומעקב אחר דוחות שנתיים"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => window.print()} className="gap-1.5">
              <FileDown className="h-4 w-4" />
              PDF ↓
            </Button>
            <Button variant="secondary" onClick={openComparison} className="gap-1.5">
              <BarChart2 className="h-4 w-4" />
              השוואה
            </Button>
            <Button variant="primary" onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              דוח חדש
            </Button>
          </div>
        }
      />

      {/* Overdue banner — shown whenever season.overdue has entries */}
      {season.overdue.length > 0 && (
        <OverdueBanner
          overdue={season.overdue}
          onSelect={openReport}
        />
      )}

      {/* Controls row — tabs + year picker (always visible) */}
      <div id="main-content" className="flex items-center gap-3 flex-wrap">
        <div
          role="tablist"
          aria-label="מצב תצוגה"
          className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1"
        >
          {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
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

        {/* Year picker — always visible, affects both tabs */}
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
      </div>

      {activeTab === "kanban" && (
        <>
          <div
            className="relative overflow-x-auto pb-4"
            aria-label="עמודות קנבן — גלול לצפייה בכל השלבים"
          >
            {/* Left-edge fade to signal hidden columns in RTL overflow */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-gray-50 to-transparent" aria-hidden="true" />
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
                    onOpenDetail={openReport}
                  />
                );
              })}
            </div>
          </div>

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
          {season.error && <Alert variant="error" message={season.error} />}

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
                  onSelect={(report) => openReport(report.id)}
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

      {activeTab === "status" && (
        <AnnualReportStatusView />
      )}

      <CreateReportModal open={showCreate} onClose={closeCreate} />

      <YearComparisonModal
        open={showComparison}
        onClose={closeComparison}
        currentTaxYear={taxYear}
      />
    </div>
  );
};
