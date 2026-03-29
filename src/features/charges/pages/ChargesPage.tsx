import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PaginatedDataTable } from "@/components/ui/PaginatedDataTable";
import {
  ChargeBulkToolbar,
  buildChargeColumns,
  ChargesCreateModal,
  ChargeDetailDrawer,
  ChargesFiltersCard,
  ChargesSummaryBar,
  useChargesPage,
} from "@/features/charges";
import { ImportExportModal } from "@/features/importExport";
import { ToolbarContainer } from "@/components/ui/ToolbarContainer";

export const Charges: React.FC = () => {
  const [, setSearchParams] = useSearchParams();
  const [selectedChargeId, setSelectedChargeId] = useState<number | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    actionLoadingId,
    bulkLoading,
    charges,
    createError,
    createLoading,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    runBulkAction,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    setFilter,
    submitCreate,
    total,
  } = useChargesPage();
  const allIds = useMemo(() => charges.map((c) => c.id), [charges]);
  const columns = useMemo(
    () =>
      buildChargeColumns({
        isAdvisor,
        actionLoadingId,
        runAction,
        onOpenDetail: setSelectedChargeId,
        selectedIds,
        onToggleSelect: toggleSelect,
        onToggleAll: toggleSelectAll,
        allIds,
      }),
    [isAdvisor, actionLoadingId, runAction, selectedIds, toggleSelect, toggleSelectAll, allIds],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="חיובים"
        description="רשימת חיובים ופעולות חיוב נתמכות"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              <ArrowUpDown className="h-3.5 w-3.5" />
              ייבוא / ייצוא
            </Button>
            {isAdvisor && (
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-3.5 w-3.5" />
                חיוב חדש
              </Button>
            )}
          </div>
        }
      />

      <ChargesSummaryBar charges={charges} isAdvisor={isAdvisor} total={total} />

      {!isAdvisor && (
        <Alert
          variant="info"
          message="צפייה בלבד. יצירה ושינוי חיובים זמינים ליועץ בלבד."
        />
      )}

      <ToolbarContainer>
        <ChargesFiltersCard
          filters={filters}
          onFilterChange={setFilter}
          onClear={() => setSearchParams(new URLSearchParams())}
        />
      </ToolbarContainer>

      {isAdvisor && selectedIds.size > 0 && (
        <ChargeBulkToolbar
          selectedCount={selectedIds.size}
          loading={bulkLoading}
          onAction={runBulkAction}
          onClear={clearSelection}
        />
      )}

      <PaginatedDataTable
        data={charges}
        columns={columns}
        getRowKey={(charge) => charge.id}
        onRowClick={(charge) => setSelectedChargeId(charge.id)}
        isLoading={loading}
        error={error}
        page={filters.page}
        pageSize={filters.page_size}
        total={total}
        label="חיובים"
        onPageChange={(page) => setFilter("page", String(page))}
        onPageSizeChange={(pageSize) => setFilter("page_size", String(pageSize))}
        rowClassName={(charge) => {
          if (charge.status === "canceled") return "text-gray-400";
          if (charge.status === "issued") return "bg-primary-50/20";
          return "";
        }}
        emptyMessage="אין חיובים להצגה"
        emptyState={{
          title: "לא נמצאו חיובים",
          message: isAdvisor
            ? "אין חיובים התואמים את הסינון. ניתן ליצור חיוב חדש בטופס למעלה."
            : "אין חיובים התואמים את הסינון הנוכחי.",
          action: isAdvisor
            ? { label: "חיוב חדש", onClick: () => setShowCreateModal(true) }
            : undefined,
        }}
      />

      <ChargeDetailDrawer chargeId={selectedChargeId} onClose={() => setSelectedChargeId(null)} />
      <ChargesCreateModal
        open={showCreateModal}
        createError={createError}
        createLoading={createLoading}
        onClose={() => setShowCreateModal(false)}
        onSubmit={submitCreate}
      />
      <ImportExportModal open={showImportExport} onClose={() => setShowImportExport(false)} />
    </div>
  );
};
