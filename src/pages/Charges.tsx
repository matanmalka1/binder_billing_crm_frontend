
import { Inbox } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { ChargesTableCard } from "../features/charges/components/ChargesTableCard";
import { useChargesPage } from "../features/charges/hooks/useChargesPage";

export const Charges: React.FC = () => {
  const {
    actionLoadingId,
    charges,
    createError,
    createLoading,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total,
  } = useChargesPage();
  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description="רשימת חיובים ופעולות חיוב נתמכות"
      />

      {!isAdvisor && (
        <AccessBanner
          variant="warning"
          message="יצירה ושינוי חיובים זמינים ליועץ בלבד. ניתן לצפות ברשימה בלבד."
        />
      )}

      {isAdvisor && (
        <ChargesCreateCard
          createError={createError}
          createLoading={createLoading}
          onSubmit={submitCreate}
        />
      )}

      <ChargesFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      <PaginatedTableView
        data={charges}
        loading={loading}
        error={error}
        pagination={{
          page: filters.page,
          pageSize: filters.page_size,
          total,
          onPageChange: (nextPage) => setFilter("page", String(nextPage)),
        }}
        renderTable={(data) => (
          <ChargesTableCard
            actionLoadingId={actionLoadingId}
            charges={data}
            isAdvisor={isAdvisor}
            onRunAction={runAction}
          />
        )}
        emptyState={{ icon: Inbox, message: "אין חיובים להצגה" }}
      />
    </div>
  );
};
