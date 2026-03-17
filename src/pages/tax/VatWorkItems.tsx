import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Clock, FileText, Hourglass, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { VatComplianceReportView } from "../../features/reports/components/VatComplianceReportView";
import { cn } from "../../utils/utils";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { PaginationCard } from "../../components/ui/PaginationCard";
import { StatsCard } from "../../components/ui/StatsCard";
import { VatWorkItemsCreateModal } from "../../features/vatReports/components/VatWorkItemsCreateModal";
import { VatWorkItemsFiltersCard } from "../../features/vatReports/components/VatWorkItemsFiltersCard";
import { buildVatWorkItemColumns } from "../../features/vatReports/components/VatWorkItemColumns";
import { useVatWorkItemsPage } from "../../features/vatReports/hooks/useVatWorkItemsPage";

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
    setFilter,
    setSearchParams,
    statsFiled,
    statsPending,
    statsReview,
    statsTyping,
    submitCreate,
    total,
  } = useVatWorkItemsPage();

  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const columns = useMemo(
    () => buildVatWorkItemColumns({
      isLoading: loading,
      isDisabled: actionLoadingId !== null,
      runAction,
    }),
    [loading, actionLoadingId, runAction],
  );
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  const tabToggle = (
    <div role="tablist" className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
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
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title='דוחות מע"מ'
        description='ניהול תיקי מע"מ חודשיים — הקלדה, בדיקה והגשה'
        actions={
          <div className="flex items-center gap-3">
            {tabToggle}
            {isAdvisor && activeTab === "list" && (
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                תיק חדש
              </Button>
            )}
          </div>
        }
      />

      {activeTab === "compliance" && <VatComplianceReportView />}

      {activeTab === "list" && (
        <>
          {!isAdvisor && (
            <Alert
              variant="info"
              message='צפייה בלבד. פתיחת תיקי מע"מ זמינה ליועץ. ניתן לבצע הקלדת נתונים בתוך כל תיק.'
            />
          )}

          {!loading && workItems.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatsCard title="ממתין לחומרים" value={statsPending ?? 0} icon={Hourglass} variant="orange" />
              <StatsCard title="בהקלדה" value={statsTyping ?? 0} icon={Clock} variant="blue" />
              <StatsCard title="ממתין לבדיקה" value={statsReview ?? 0} icon={FileText} variant="orange" />
              <StatsCard title="הוגש" value={statsFiled ?? 0} icon={CheckCircle2} variant="green" />
            </div>
          )}

          <VatWorkItemsFiltersCard
            filters={filters}
            onFilterChange={setFilter}
            onClear={() => setSearchParams(new URLSearchParams())}
          />

          {error && <Alert variant="error" message={error} />}

          <DataTable
            data={workItems}
            columns={columns}
            getRowKey={(item) => item.id}
            isLoading={loading}
            onRowClick={(item) => navigate(`/tax/vat/${item.id}`)}
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

          <VatWorkItemsCreateModal
            open={showCreateModal}
            createError={createError}
            createLoading={createLoading}
            onClose={() => setShowCreateModal(false)}
            onSubmit={submitCreate}
          />
        </>
      )}
    </div>
  );
};
