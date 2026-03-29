import { useClientAnnualReportsTab } from "../../hooks/useClientAnnualReportsTab";
import { SeasonReportsTable } from "../kanban/SeasonReportsTable";
import { PageLoading } from "../../../../components/ui/layout/PageLoading";
import { Alert } from "../../../../components/ui/overlays/Alert";
import { cn } from "../../../../utils/utils";

interface ClientAnnualReportsTabProps {
  businessId: number;
}

export const ClientAnnualReportsTab: React.FC<ClientAnnualReportsTabProps> = ({ businessId }) => {
  const { selectedYear, setSelectedYear, filteredReports, yearHasReports, openReport, isPending, errorMessage, YEAR_LIST } =
    useClientAnnualReportsTab(businessId);

  if (isPending) return <PageLoading message="טוען דוחות שנתיים..." />;
  if (errorMessage) return <Alert variant="error" message={errorMessage} />;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 min-w-[80px]">
        {YEAR_LIST.map((year) => (
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
            {yearHasReports(year) && <span className="mr-1 text-xs text-green-600">✓</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        {filteredReports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            <p className="text-base font-medium">אין דוחות לשנת מס {selectedYear}</p>
          </div>
        ) : (
          <SeasonReportsTable
            reports={filteredReports}
            onSelect={(report) => openReport(report.id)}
          />
        )}
      </div>
    </div>
  );
};

ClientAnnualReportsTab.displayName = "ClientAnnualReportsTab";
