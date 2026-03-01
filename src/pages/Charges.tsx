import { useMemo, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import { Button } from "../components/ui/Button";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { ChargesSummaryBar } from "../features/charges/components/ChargesSummaryBar";
import { buildChargeColumns } from "../features/charges/components/chargeColumns";
import { ChargeDetailDrawer } from "../features/charges/components/ChargeDetailDrawer";
import { useChargesPage } from "../features/charges/hooks/useChargesPage";
import { ImportExportModal } from "../features/importExport/components/ImportExportModal";

export const Charges: React.FC = () => {
  const [selectedChargeId, setSelectedChargeId] = useState<number | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);

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
        onOpenDetail: setSelectedChargeId,
      }),
    [isAdvisor, actionLoadingId, runAction],
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description="רשימת חיובים ופעולות חיוב נתמכות"
        actions={
          <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
            ייבוא / ייצוא
          </Button>
        }
      />

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

      {!loading && <ChargesSummaryBar charges={charges} isAdvisor={isAdvisor} />}

      {error && <ErrorCard message={error} />}

      <DataTable
        data={charges}
        columns={columns}
        getRowKey={(charge) => charge.id}
        onRowClick={(charge) => setSelectedChargeId(charge.id)}
        isLoading={loading}
        emptyMessage="אין חיובים להצגה"
        emptyState={{
          title: "לא נמצאו חיובים",
          message: isAdvisor
            ? "אין חיובים התואמים את הסינון. ניתן ליצור חיוב חדש בטופס למעלה."
            : "אין חיובים התואמים את הסינון הנוכחי.",
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

      <ChargeDetailDrawer
        chargeId={selectedChargeId}
        onClose={() => setSelectedChargeId(null)}
      />

      <ImportExportModal
        open={showImportExport}
        onClose={() => setShowImportExport(false)}
      />
    </div>
  );
};