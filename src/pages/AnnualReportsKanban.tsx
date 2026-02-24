import { useState } from "react";
import { getYear } from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import { Button } from "../components/ui/Button";
import {
  useAnnualReportsKanban,
  STAGE_ORDER,
  type StageKey,
} from "../features/annualReports/hooks/useAnnualReportsKanban";
import { useSeasonDashboard } from "../features/annualReports/hooks/useSeasonDashboard";
import { AnnualReportColumn } from "../features/annualReports/components/AnnualReportColumn";
import { AnnualReportsLegend } from "../features/annualReports/components/AnnualReportsLegend";
import { AnnualReportDetailDrawer } from "../features/annualReports/components/AnnualReportDetailDrawer";
import { SeasonSummaryCards } from "../features/annualReports/components/SeasonSummaryCards";
import { SeasonProgressBar } from "../features/annualReports/components/SeasonProgressBar";
import { SeasonReportsTable } from "../features/annualReports/components/SeasonReportsTable";
import { CreateReportModal } from "../features/annualReports/components/CreateReportModal";
import { cn } from "../utils/utils";
import type { AnnualReportFull } from "../api/annualReports.api";

type ActiveTab = "kanban" | "season";

export const AnnualReportsKanban: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("kanban");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const currentYear = getYear(new Date());
  const [taxYear, setTaxYear] = useState(currentYear - 1);
  const [showCreate, setShowCreate] = useState(false);

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

  const { summary, reports, isLoading: seasonLoading, error: seasonError } = useSeasonDashboard(taxYear);

  const handleSeasonSelect = (report: AnnualReportFull) => setSelectedReportId(report.id);

  const tabBar = (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
      {(["kanban", "season"] as ActiveTab[]).map((tab) => (
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
          {tab === "kanban" ? "קנבן" : "עונה"}
        </button>
      ))}
    </div>
  );

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
        <ErrorCard message={"שגיאה בטעינת לוח דוחות"} />
      </div>
    );
  }

  const maxCount = Math.max(0, ...stages.map((stage) => stage.reports.length));

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
                  onClick={() => setTaxYear((y) => y - 1)}
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
                  onClick={() => setTaxYear((y) => Math.min(y + 1, currentYear))}
                  disabled={taxYear >= currentYear - 1}
                  className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
                  aria-label="שנה הבאה"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              <Button variant="primary" onClick={() => setShowCreate(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                דוח חדש
              </Button>
            </div>
          ) : undefined
        }
      />

      {tabBar}

      {activeTab === "kanban" && (
        <>
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
          {seasonLoading && <PageLoading message="טוען נתוני עונה..." />}
          {seasonError && <ErrorCard message={seasonError} />}

          {!seasonLoading && !seasonError && summary && (
            <>
              <SeasonSummaryCards summary={summary} />
              <SeasonProgressBar summary={summary} />
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  כל הדוחות — שנת מס {taxYear}
                </h2>
                <SeasonReportsTable
                  reports={reports}
                  isLoading={seasonLoading}
                  onSelect={handleSeasonSelect}
                />
              </div>
            </>
          )}

          {!seasonLoading && !seasonError && !summary && (
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

      <CreateReportModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
};
