import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../../api/annualReport.api";
import { QK } from "../../../../lib/queryKeys";
import { SeasonReportsTable } from "../kanban/SeasonReportsTable";
import { AnnualReportFullPanel } from "../panel/AnnualReportFullPanel";
import { PageLoading } from "../../../../components/ui/PageLoading";
import { Alert } from "../../../../components/ui/Alert";
import { getErrorMessage } from "../../../../utils/utils";
import { cn } from "../../../../utils/utils";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_LIST = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

interface ClientAnnualReportsTabProps {
  clientId: number;
}

export const ClientAnnualReportsTab: React.FC<ClientAnnualReportsTabProps> = ({ clientId }) => {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  const { data, isPending, error } = useQuery({
    queryKey: QK.tax.annualReportsForClient(clientId),
    queryFn: () => annualReportsApi.listClientReports(clientId),
  });

  if (isPending) return <PageLoading message="טוען דוחות שנתיים..." />;
  if (error) return <Alert variant="error" message={getErrorMessage(error, "שגיאה בטעינת דוחות שנתיים")} />;

  const allReports = data ?? [];
  const yearHasReports = (year: number) => allReports.some((r) => r.tax_year === year);
  const filteredReports = allReports.filter((r) => r.tax_year === selectedYear);

  return (
    <div className="flex gap-4">
      {/* Year sidebar */}
      <div className="flex flex-col gap-1 min-w-[80px]">
        {YEAR_LIST.map((year) => {
          const hasReports = yearHasReports(year);
          return (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-right transition-all",
                selectedYear === year
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {year}
              {hasReports && (
                <span className="mr-1 text-xs text-green-600">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reports content */}
      <div className="flex-1 min-w-0">
        {filteredReports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            <p className="text-base font-medium">אין דוחות לשנת מס {selectedYear}</p>
          </div>
        ) : (
          <SeasonReportsTable
            reports={filteredReports}
            onSelect={(report) => setSelectedReportId(report.id)}
          />
        )}
      </div>

      {selectedReportId !== null && (
        <AnnualReportFullPanel
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
        />
      )}
    </div>
  );
};
