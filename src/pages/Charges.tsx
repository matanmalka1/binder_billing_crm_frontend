import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { buildChargeColumns } from "../features/charges/components/chargeColumns";
import { useChargesPage } from "../features/charges/hooks/useChargesPage";

export const Charges: React.FC = () => {
  const navigate = useNavigate();
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
    () => buildChargeColumns({ isAdvisor, actionLoadingId, runAction }),
    [isAdvisor, actionLoadingId, runAction],
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description="רשימת חיובים ופעולות חיוב נתמכות"
      />

      {/* Role gate: create form for advisors, banner for others */}
      {isAdvisor ? (
        <ChargesCreateCard
          createError={createError}
          createLoading={createLoading}
          onSubmit={submitCreate}
        />
      ) : (
        <AccessBanner
          variant="info"
          message="יצירה ושינוי חיובים זמינים ליועץ בלבד. ניתן לצפות ברשימה."
        />
      )}

      <ChargesFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      {error && <ErrorCard message={error} />}

      <DataTable
        data={charges}
        columns={columns}
        getRowKey={(charge) => charge.id}
        onRowClick={(charge) => navigate(`/charges/${charge.id}`)}
        isLoading={loading}
        emptyMessage="אין חיובים להצגה"
        emptyState={{
          title: "לא נמצאו חיובים",
          message: "נסה לשנות את הסינון או לצור חיוב חדש",
        }}
      />

      {!loading && total > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          label="חיובים"
          onPageChange={(page) => setFilter("page", String(page))}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(pageSize) => setFilter("page_size", String(pageSize))}
        />
      )}
    </div>
  );
};