import { PageHeader } from "../components/layout/PageHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { getErrorMessage } from "../utils/utils";
import { useTaxDashboard } from "../features/taxDashboard/hooks/useTaxDashboard";
import { TaxSubmissionStats } from "../features/taxDashboard/components/TaxSubmissionStats";
import { TaxUrgentDeadlines } from "../features/taxDashboard/components/TaxUrgentDeadlines";
import { TaxUpcomingDeadlines } from "../features/taxDashboard/components/TaxUpcomingDeadlines";

export const TaxDashboard: React.FC = () => {
  const { currentYear, submissionsQuery, deadlinesQuery, isLoading, hasError } =
    useTaxDashboard();

  const header = (
    <PageHeader
      title="דוחות מס"
      description={`סטטוס דיווח ומועדים קריטיים לשנת ${currentYear}`}
      variant="gradient"
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        {header}
        <PageLoading message="טוען נתוני מס..." rows={3} columns={4} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-8">
        {header}
        <ErrorCard message={getErrorMessage(hasError, "שגיאה בטעינת נתוני מס")} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {header}

      {/* Stats row */}
      <TaxSubmissionStats data={submissionsQuery.data} />

      {/* Deadlines: two-column layout on large screens */}
      {deadlinesQuery.data && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaxUrgentDeadlines items={deadlinesQuery.data.urgent} />
          </div>
          <div>
            <TaxUpcomingDeadlines items={deadlinesQuery.data.upcoming} />
          </div>
        </div>
      )}
    </div>
  );
};