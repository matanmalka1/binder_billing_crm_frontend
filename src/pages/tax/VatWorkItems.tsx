import { useMemo, useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { AccessBanner } from "../../components/ui/AccessBanner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { PaginationCard } from "../../components/ui/PaginationCard";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { VatWorkItemsCreateModal } from "../../features/vatReports/components/VatWorkItemsCreateModal";
import { VatWorkItemsFiltersCard } from "../../features/vatReports/components/VatWorkItemsFiltersCard";
import { buildVatWorkItemColumns } from "../../features/vatReports/components/vatWorkItemColumns";
import { VatWorkItemDrawer } from "../../features/vatReports/components/VatWorkItemDrawer";
import { useVatWorkItemsPage } from "../../features/vatReports/hooks/useVatWorkItemsPage";
import type { VatWorkItemResponse } from "../../api/vatReports.api";

export const VatWorkItems: React.FC = () => {
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
      <PageHeader
        title='דוחות מע"מ'
        description='ניהול תיקי מע"מ חודשיים — הקלדה, בדיקה והגשה'
        variant="gradient"
        actions={
          isAdvisor ? (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              תיק חדש
            </Button>
          ) : undefined
        }
      />

      {!isAdvisor && (
        <AccessBanner
          variant="info"
          message='צפייה בלבד. פתיחת תיקי מע"מ זמינה ליועץ. ניתן לבצע הקלדת נתונים בתוך כל תיק.'
        />
      )}

      <VatWorkItemsFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      {!loading && workItems.length > 0 && (
        <Card>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-0.5">ממתין לחומרים</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.typing}</p>
              <p className="text-xs text-gray-500 mt-0.5">בהקלדה</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.review}</p>
              <p className="text-xs text-gray-500 mt-0.5">ממתין לבדיקה</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.filed}</p>
              <p className="text-xs text-gray-500 mt-0.5">הוגש</p>
            </div>
          </div>
        </Card>
      )}

      {error && <ErrorCard message={error} />}

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
    </div>
  );
};
