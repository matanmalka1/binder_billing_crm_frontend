import { Receipt } from "lucide-react";
import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { DataTable } from "../components/ui/DataTable";
import { Pagination } from "../components/ui/Pagination";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { buildChargeColumns } from "../features/charges/components/chargeColumns";
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

  const columns = useMemo(
    () =>
      buildChargeColumns({
        isAdvisor,
        actionLoadingId,
        runAction,
      }),
    [actionLoadingId, isAdvisor, runAction],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description="רשימת חיובים ופעולות חיוב נתמכות"
        actions={
          isAdvisor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Receipt className="h-4 w-4" />
              <span>יועץ</span>
            </div>
          )
        }
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

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DataTable
          data={charges}
          columns={columns}
          getRowKey={(charge) => charge.id}
          isLoading={loading}
          emptyMessage="אין חיובים להצגה"
        />

        {!loading && charges.length > 0 && (
          <Pagination
            currentPage={filters.page}
            total={total}
            pageSize={filters.page_size}
            onPageChange={(page) => setFilter("page", String(page))}
            showPageSizeSelect
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize) => setFilter("page_size", String(pageSize))}
          />
        )}
      </div>
    </div>
  );
};
