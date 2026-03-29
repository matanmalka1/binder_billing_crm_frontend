import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, FileText, Hourglass, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  buildVatWorkItemColumns,
  useVatWorkItemsPage,
  VatWorkItemsCreateModal,
  VatWorkItemsFiltersCard,
} from "@/features/vatReports";
import { VatComplianceReportView } from "@/features/reports";
import { cn } from "@/utils/utils";
import { Alert } from "@/components/ui/overlays/Alert";
import { Button } from "@/components/ui/primitives/Button";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { StatsCard } from "@/components/ui/layout/StatsCard";

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
  const createBusinessId = urlParams.get("business_id");
  const createPeriod = urlParams.get("period");

  useEffect(() => {
    if (urlParams.get("create") === "1") {
      setShowCreateModal(true);
      urlParams.delete("create");
      setUrlParams(urlParams, { replace: true });
    }
  }, [urlParams, setUrlParams]);

  const columns = useMemo(
    () =>
      buildVatWorkItemColumns({
        isLoading: loading,
        isDisabled: actionLoadingId !== null,
        runAction,
      }),
    [loading, actionLoadingId, runAction],
  );

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

          {!loading && workItems.length > 0 && (() => {
            const overdueCount = workItems.filter((item) => item.is_overdue).length;
            const urgentCount = workItems.filter(
              (item) =>
                !item.is_overdue &&
                item.days_until_deadline != null &&
                item.days_until_deadline <= 3,
            ).length;
            return overdueCount > 0 || urgentCount > 0 ? (
              <div className="flex flex-wrap gap-2" dir="rtl">
                {overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {overdueCount} תיקים בחריגת מועד
                  </span>
                )}
                {urgentCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    <Clock className="h-3.5 w-3.5" />
                    {urgentCount} תיקים — נותרו עד 3 ימים
                  </span>
                )}
              </div>
            ) : null;
          })()}

          <VatWorkItemsFiltersCard
            filters={filters}
            onFilterChange={setFilter}
            onClear={() => setSearchParams(new URLSearchParams())}
          />

          <PaginatedDataTable
            data={workItems}
            columns={columns}
            getRowKey={(item) => item.id}
            isLoading={loading}
            error={error}
            onRowClick={(item) => navigate(`/tax/vat/${item.id}`)}
            page={filters.page}
            pageSize={filters.page_size}
            total={total}
            label='תיקי מע"מ'
            onPageChange={(page) => setFilter("page", String(page))}
            onPageSizeChange={(pageSize) => setFilter("page_size", String(pageSize))}
            emptyMessage='אין תיקי מע"מ להצגה'
            emptyState={{
              title: 'לא נמצאו תיקי מע"מ',
              message: isAdvisor ? "נסה לשנות את הסינון או לפתוח תיק חדש" : "נסה לשנות את הסינון",
              action: isAdvisor
                ? { label: "תיק חדש", onClick: () => setShowCreateModal(true) }
                : undefined,
            }}
          />

          <VatWorkItemsCreateModal
            open={showCreateModal}
            createError={createError}
            createLoading={createLoading}
            onClose={() => setShowCreateModal(false)}
            onSubmit={submitCreate}
            initialClientId={createBusinessId ? Number(createBusinessId) : undefined}
            initialPeriod={createPeriod ?? undefined}
          />
        </>
      )}
    </div>
  );
};
