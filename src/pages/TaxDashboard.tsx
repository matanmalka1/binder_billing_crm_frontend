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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוחות מס" description="ניהול דוחות שנתיים ומועדים" />
        <PageLoading message="טוען נתוני מס..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוחות מס" />
        <ErrorCard message={getErrorMessage(hasError, "שגיאה בטעינת נתוני מס")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="דוחות מס"
        description={`סטטוס דיווח ומועדים קריטיים לשנת ${currentYear}`}
        variant="gradient"
      />

      <TaxSubmissionStats data={submissionsQuery.data} />
      {deadlinesQuery.data && (
        <>
          <TaxUrgentDeadlines items={deadlinesQuery.data.urgent} />
          <TaxUpcomingDeadlines items={deadlinesQuery.data.upcoming} />
        </>
      )}
    </div>
  );
};
