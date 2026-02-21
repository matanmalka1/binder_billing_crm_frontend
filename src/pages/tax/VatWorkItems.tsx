import { useMemo } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { AccessBanner } from "../../components/ui/AccessBanner";
import { DataTable } from "../../components/ui/DataTable";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { PaginationCard } from "../../components/ui/PaginationCard";
import { VatWorkItemsCreateCard } from "../../features/vatReports/components/VatWorkItemsCreateCard";
import { VatWorkItemsFiltersCard } from "../../features/vatReports/components/VatWorkItemsFiltersCard";
import { buildVatWorkItemColumns } from "../../features/vatReports/components/vatWorkItemColumns";
import { useVatWorkItemsPage } from "../../features/vatReports/hooks/useVatWorkItemsPage";

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
    setFilter,
    setSearchParams,
    submitCreate,
    total,
  } = useVatWorkItemsPage();

  const columns = useMemo(
    () => buildVatWorkItemColumns({ isAdvisor, actionLoadingId, runAction }),
    [isAdvisor, actionLoadingId, runAction],
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  return (
    <div className="space-y-6">
      <PageHeader
        title='דוחות מע"מ'
        description='ניהול תיקי מע"מ חודשיים — הקלדה, בדיקה והגשה'
      />

      {isAdvisor ? (
        <VatWorkItemsCreateCard
          createError={createError}
          createLoading={createLoading}
          onSubmit={submitCreate}
        />
      ) : (
        <AccessBanner
          variant="info"
          message='פתיחת תיקי מע"מ זמינה ליועץ בלבד. ניתן לצפות ולבצע הקלדה.'
        />
      )}

      <VatWorkItemsFiltersCard
        filters={filters}
        onFilterChange={setFilter}
        onClear={() => setSearchParams(new URLSearchParams())}
      />

      {error && <ErrorCard message={error} />}

      <DataTable
        data={workItems}
        columns={columns}
        getRowKey={(item) => item.id}
        isLoading={loading}
        emptyMessage='אין תיקי מע"מ להצגה'
        emptyState={{
          title: 'לא נמצאו תיקי מע"מ',
          message: "נסה לשנות את הסינון או לפתוח תיק חדש",
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
    </div>
  );
};
