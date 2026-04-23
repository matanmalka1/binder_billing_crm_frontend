import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLoading } from "@/components/ui/layout/PageLoading";
import { Alert } from "@/components/ui/overlays/Alert";
import { Button } from "@/components/ui/primitives/Button";
import {
  AnnualReportsFiltersBar,
  CreateReportModal,
  OverdueBanner,
  SeasonProgressBar,
  SeasonReportsTable,
  SeasonSummaryCards,
  useAnnualReportsPage,
} from "@/features/annualReports";

export const AnnualReportsPage: React.FC = () => {
  const {
    taxYear,
    showCreate,
    openCreate,
    closeCreate,
    openReport,
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredReports,
    season,
  } = useAnnualReportsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="דוחות שנתיים"
        description="ניהול ומעקב אחר דוחות שנתיים"
        actions={
          <Button variant="primary" onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            דוח חדש
          </Button>
        }
      />

      {season.overdue.length > 0 && (
        <OverdueBanner overdue={season.overdue} onSelect={openReport} />
      )}

      <AnnualReportsFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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
              reports={filteredReports}
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

      <CreateReportModal open={showCreate} onClose={closeCreate} />
    </div>
  );
};
