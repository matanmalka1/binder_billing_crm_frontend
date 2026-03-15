import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { VatComplianceReportView } from "../../features/reports/components/VatComplianceReportView";
import { cn } from "../../utils/utils";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { PaginationCard } from "../../components/ui/PaginationCard";
import { VatWorkItemsCreateModal } from "../../features/vatReports/components/VatWorkItemsCreateModal";
import { VatWorkItemsFiltersCard } from "../../features/vatReports/components/VatWorkItemsFiltersCard";
import { buildVatWorkItemColumns } from "../../features/vatReports/components/VatWorkItemColumns";
import { VatWorkItemDrawer } from "../../features/vatReports/components/VatWorkItemDrawer";
import { useVatWorkItemsPage } from "../../features/vatReports/hooks/useVatWorkItemsPage";
import type { VatWorkItemResponse } from "../../api/vatReports.api";

type ActiveTab = "list" | "compliance";

const TAB_LABELS: Record<ActiveTab, string> = {
  list: "רשימה",
  compliance: 'דוח ציות',
};

export const VatWorkItems: React.FC = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const activeTab = (urlParams.get("tab") as ActiveTab) ?? "list";
  const setTab = (tab: ActiveTab) => setUrlParams(tab === "list" ? {} : { tab });

  const {
    actionLoadingId,
    workItems,
    createError,
    createLoading,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    sendBackWithNote,
    setFilter,
    setSearchParams,
    submitCreate,
    total,
  } = useVatWorkItemsPage();
  const [selectedItem, setSelectedItem] = useState<VatWorkItemResponse | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const columns = useMemo(
    () => buildVatWorkItemColumns({ isAdvisor, actionLoadingId, runAction }),
    [isAdvisor, actionLoadingId, runAction],
  );
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));
  const stats = useMemo(() => {
    const typing = workItems.filter((i) =>
      i.status === "data_entry_in_progress" || i.status === "material_received"
    ).length;
    const review = workItems.filter((i) => i.status === "ready_for_review").length;
    const filed = workItems.filter((i) => i.status === "filed").length;
    const pending = workItems.filter((i) => i.status === "pending_materials").length;
    return { typing, review, filed, pending };
  }, [workItems]);
  return (
    <div className="space-y-6">
      <div role="tablist" className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 w-fit">
        {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setTab(tab)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      {activeTab === "compliance" && <VatComplianceReportView />}
      {activeTab === "list" && <>
      <PageHeader
        title='דוחות מע"מ'
        description='ניהול תיקי מע"מ חודשיים — הקלדה, בדיקה והגשה'
        actions={
          isAdvisor ? (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              תיק חדש
            </Button>
          ) : undefined
        }
      />
      {!isAdvisor && (
        <Alert
          variant="info"
          message='צפייה בלבד. פתיחת תיקי מע"מ זמינה ליועץ. ניתן לבצע הקלדת נתונים בתוך כל תיק.'
        />
      )}
      <VatWorkItemsFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
        stats={!loading && workItems.length > 0 ? stats : undefined}
      />
      {error && <Alert variant="error" message={error} />}
      <DataTable
        data={workItems}
        columns={columns}
        getRowKey={(item) => item.id}
        isLoading={loading}
        onRowClick={setSelectedItem}
        emptyMessage='אין תיקי מע"מ להצגה'
        emptyState={{
          title: 'לא נמצאו תיקי מע"מ',
          message: isAdvisor
            ? "נסה לשנות את הסינון או לפתוח תיק חדש"
            : "נסה לשנות את הסינון",
          action: isAdvisor
            ? { label: "תיק חדש", onClick: () => setShowCreateModal(true) }
            : undefined,
        }}
      />
      {!loading && total > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          label='תיקי מע"מ'
          onPageChange={(page) => setFilter("page", String(page))}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(pageSize) => setFilter("page_size", String(pageSize))}
        />
      )}
      <VatWorkItemDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSendBack={sendBackWithNote}
      />
      <VatWorkItemsCreateModal
        open={showCreateModal}
        createError={createError}
        createLoading={createLoading}
        onClose={() => setShowCreateModal(false)}
        onSubmit={submitCreate}
      />
      </>}
    </div>
  );
};
