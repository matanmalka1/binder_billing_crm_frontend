import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getYear } from "date-fns";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { SeasonSummaryCards } from "../features/annualReports/components/SeasonSummaryCards";
import { SeasonProgressBar } from "../features/annualReports/components/SeasonProgressBar";
import { SeasonReportsTable } from "../features/annualReports/components/SeasonReportsTable";
import type { AnnualReportFull } from "../api/annualReports.api";
import { CreateReportModal } from "../features/annualReports/components/CreateReportModal";
import { useSeasonDashboard } from "../features/annualReports/hooks/useSeasonDashboard";

export const AnnualReportsSeason: React.FC = () => {
  const currentYear = getYear(new Date());
  const navigate = useNavigate();
  const [taxYear, setTaxYear] = useState(currentYear - 1);
  const [showCreate, setShowCreate] = useState(false);

  const { summary, reports, isLoading, error } = useSeasonDashboard(taxYear);

  const handleSelect = (report: AnnualReportFull) => {
    navigate(`/tax/reports/${report.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="דוחות שנתיים"
        description="ניהול עונת הגשה לפי שנת מס"
        variant="gradient"
        breadcrumbs={[{ label: "דוחות מס", to: "/tax" }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Year selector */}
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

            <Button
              variant="primary"
              onClick={() => setShowCreate(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              דוח חדש
            </Button>
          </div>
        }
      />

      {isLoading && <PageLoading message="טוען נתוני עונה..." />}
      {error && <ErrorCard message={error} />}

      {!isLoading && !error && summary && (
        <>
          <SeasonSummaryCards summary={summary} />
          <SeasonProgressBar summary={summary} />
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              כל הדוחות — שנת מס {taxYear}
            </h2>
            <SeasonReportsTable
              reports={reports}
              isLoading={isLoading}
              onSelect={handleSelect}
            />
          </div>
        </>
      )}

      {!isLoading && !error && !summary && !isLoading && (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          <p className="text-lg font-medium">אין דוחות לשנת מס {taxYear}</p>
          <p className="mt-1 text-sm">לחץ על "דוח חדש" כדי להתחיל</p>
        </div>
      )}

      <CreateReportModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
};
