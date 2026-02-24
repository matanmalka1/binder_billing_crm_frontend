import { useMemo, useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { AccessBanner } from "../components/ui/AccessBanner";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PaginationCard } from "../components/ui/PaginationCard";
import { PageStateGuard } from "../components/ui/PageStateGuard";
import { Button } from "../components/ui/Button";
import { ChargesCreateCard } from "../features/charges/components/ChargesCreateCard";
import { ChargesFiltersCard } from "../features/charges/components/ChargesFiltersCard";
import { ChargesSummaryBar } from "../features/charges/components/ChargesSummaryBar";
import { buildChargeColumns } from "../features/charges/components/chargeColumns";
import { ChargeDetailDrawer } from "../features/charges/components/ChargeDetailDrawer";
import { useChargesPage } from "../features/charges/hooks/useChargesPage";
import { AgingReportFilters } from "../features/reports/components/AgingReportFilters";
import { AgingReportSummary } from "../features/reports/components/Agingreportsummary";
import { AgingReportTable } from "../features/reports/components/Agingreporttable";
import { AgingReportMetadata } from "../features/reports/components/Agingreportmetadata";
import { useAgingReport } from "../features/reports/hooks/useAgingReport";
import { ImportExportModal } from "../features/importExport/components/ImportExportModal";
import { cn } from "../utils/utils";

type ActiveTab = "charges" | "aging";

export const Charges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("charges");
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

  const {
    asOfDate,
    setAsOfDate,
    exporting,
    handleExport,
    data: agingData,
    isLoading: agingLoading,
    error: agingError,
  } = useAgingReport();

  const columns = useMemo(
    () => buildChargeColumns({ isAdvisor, actionLoadingId, runAction, onOpenDetail: setSelectedChargeId }),
    [isAdvisor, actionLoadingId, runAction],
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  const tabBar = (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
      {(["charges", "aging"] as ActiveTab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {tab === "charges" ? "חיובים" : "דוח חובות"}
        </button>
      ))}
    </div>
  );

  const agingActions = (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("excel")}
        isLoading={exporting === "excel"}
        disabled={exporting !== null}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("pdf")}
        isLoading={exporting === "pdf"}
        disabled={exporting !== null}
        className="gap-2"
      >
        <FileDown className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={activeTab === "charges" ? "חיובים" : "דוח חובות לקוחות"}
        description={
          activeTab === "charges"
            ? "רשימת חיובים ופעולות חיוב נתמכות"
            : "ניתוח חובות לפי גיל החוב"
        }
        variant={activeTab === "aging" ? "gradient" : undefined}
        actions={
          activeTab === "aging" ? agingActions : (
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              ייבוא / ייצוא
            </Button>
          )
        }
      />

      {tabBar}

      {activeTab === "charges" && (
        <>
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
        </>
      )}

      {activeTab === "aging" && (
        <PageStateGuard
          isLoading={agingLoading}
          error={agingError}
          loadingMessage="טוען דוח..."
          header={null}
        >
          {agingData && (
            <>
              <AgingReportFilters asOfDate={asOfDate} onDateChange={setAsOfDate} />
              <AgingReportSummary data={agingData} />
              <AgingReportTable items={agingData.items} />
              <AgingReportMetadata data={agingData} />
            </>
          )}
        </PageStateGuard>
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
