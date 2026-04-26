import { useState, useMemo } from "react";
import { FileSpreadsheet, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { VatWorkItemsCreateModal } from "./VatWorkItemsCreateModal";

// Logic & Utils
import { vatReportsApi, type CreateVatWorkItemPayload, type VatAnnualSummary, type VatPeriodRow } from "../api";
import { FILE_FORMAT_COLORS } from "../../../utils/chartColors";
import { buildYearOptions, showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { VAT_CLIENT_SUMMARY_STATUS_VARIANTS } from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatVatAmountLtrSafe } from "../utils";
import { semanticMonoToneClasses } from "../../../utils/semanticColors";
import { useVatClientSummary } from "../hooks/useVatClientSummary";
import type { VatClientSummaryPanelProps } from "../types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = formatVatAmountLtrSafe;

const getNetVatTone = (value: string | number | null | undefined) =>
  Number(value) >= 0
    ? semanticMonoToneClasses.negative
    : semanticMonoToneClasses.positive;

// ── Sub-Components ───────────────────────────────────────────────────────────

const AnnualCard = ({ row }: { row: VatAnnualSummary }) => {
  const allFiled = row.filed_count === row.periods_count && row.periods_count > 0;
  const tone = getNetVatTone(row.net_vat);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-hover hover:border-gray-300">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">{row.year}</span>
        <Badge variant={allFiled ? "success" : "neutral"}>
          {row.filed_count}/{row.periods_count} הוגשו
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "מע״מ עסקאות", val: row.total_output_vat },
          { label: "מע״מ תשומות", val: row.total_input_vat },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 p-3">
            <div className="mb-1 text-xs font-medium text-gray-500">{item.label}</div>
            <div dir="ltr" className="text-sm font-semibold tabular-nums text-gray-900">
              {fmt(item.val)}
            </div>
          </div>
        ))}
        <div className="col-span-2 rounded-lg bg-gray-50 p-3">
          <div className="mb-1 text-xs font-medium text-gray-500">נטו לתשלום</div>
          <div dir="ltr" className={`text-sm font-bold tabular-nums ${tone}`}>
            {fmt(row.net_vat)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportControls = ({ clientId }: { clientId: number }) => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [loadingType, setLoadingType] = useState<"excel" | "pdf" | null>(null);

  const handleExport = async (format: "excel" | "pdf") => {
    setLoadingType(format);
    try {
      await vatReportsApi.exportClientVat(clientId, format, year);
    } catch (err) {
      showErrorToast(err, "ייצוא נכשל, נסה שוב");
    } finally {
      setLoadingType(null);
    }
  };

  const yearOptions = useMemo(() => 
    buildYearOptions().map((o) => ({ value: o.value, label: o.value })), 
  []);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(year)}
        onChange={(e) => setYear(Number(e.target.value))}
        options={yearOptions}
        className="w-28 py-1.5"
      />
      <Button 
        variant="ghost" 
        size="sm" 
        isLoading={loadingType === "excel"} 
        onClick={() => handleExport("excel")}
      >
        <FileSpreadsheet className={`h-4 w-4 ${FILE_FORMAT_COLORS.excel}`} />
        Excel
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        isLoading={loadingType === "pdf"} 
        onClick={() => handleExport("pdf")}
      >
        <FileText className={`h-4 w-4 ${FILE_FORMAT_COLORS.pdf}`} />
        PDF
      </Button>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

export const VatClientSummaryPanel = ({ clientId }: VatClientSummaryPanelProps) => {
  const role = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { data, isLoading, error, createMutation } = useVatClientSummary(clientId);

  const columns = useMemo((): Column<VatPeriodRow>[] => [
    {
      key: "period",
      header: "תקופה",
      render: (r) => <span className="font-mono text-sm font-semibold text-gray-800">{r.period}</span>,
    },
    {
      key: "status",
      header: "סטטוס",
      render: (r) => (
        <Badge variant={VAT_CLIENT_SUMMARY_STATUS_VARIANTS[r.status] ?? "neutral"}>
          {getVatWorkItemStatusLabel(r.status)}
        </Badge>
      ),
    },
    {
      key: "total_output_net",
      header: "נטו הכנסות",
      render: (r) => <span dir="ltr" className="tabular-nums text-gray-700">{fmt(r.total_output_net)}</span>,
    },
    {
      key: "total_output_vat",
      header: "מע״מ עסקאות",
      render: (r) => <span dir="ltr" className="tabular-nums text-gray-700">{fmt(r.total_output_vat)}</span>,
    },
    {
      key: "total_input_vat",
      header: "מע״מ תשומות",
      render: (r) => <span dir="ltr" className="tabular-nums text-gray-700">{fmt(r.total_input_vat)}</span>,
    },
    {
      key: "net_vat",
      header: "נטו לתשלום",
      render: (r) => (
        <span dir="ltr" className={`tabular-nums font-semibold ${getNetVatTone(r.net_vat)}`}>
          {fmt(r.net_vat)}
        </span>
      ),
    },
    {
      key: "filed_at",
      header: "הוגש",
      render: (r) => r.filed_at ? new Date(r.filed_at).toLocaleDateString("he-IL") : "—",
    },
  ], []);

  const handleCreate = async (payload: CreateVatWorkItemPayload) => {
    setCreateError(null);
    try {
      await createMutation.mutateAsync(payload);
      setCreateOpen(false);
      return true;
    } catch (err) {
      setCreateError(showErrorToast(err, "שגיאה ביצירת תיק המע״מ"));
      return false;
    }
  };

  const handleRowClick = (row: VatPeriodRow) => {
    if (!Number.isInteger(row.work_item_id) || row.work_item_id <= 0) return;
    navigate(`/tax/vat/${row.work_item_id}`);
  };

  if (error) {
    return (
      <Card className="flex h-32 items-center justify-center border-negative-200 bg-negative-50">
        <p className="text-sm font-medium text-negative-700">שגיאה בטעינת נתוני מע״מ. אנא נסה שוב מאוחר יותר.</p>
      </Card>
    );
  }

  const annualData = data?.annual ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          פתיחת תיק מע״מ
        </Button>
        {role === "advisor" && <ExportControls clientId={clientId} />}
      </div>

      <DataTable
        data={data?.periods ?? []}
        columns={columns}
        getRowKey={(r) => r.period}
        isLoading={isLoading}
        emptyMessage='אין תקופות מע״מ ללקוח זה'
        onRowClick={handleRowClick}
      />

      {annualData.length > 0 && (
        <Card title="סיכום שנתי">
          <div 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))` }}
          >
            {annualData.map((row) => (
              <AnnualCard key={row.year} row={row} />
            ))}
          </div>
        </Card>
      )}

      <VatWorkItemsCreateModal
        open={createOpen}
        createError={createError}
        createLoading={createMutation.isPending}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        initialClientId={clientId}
      />
    </div>
  );
};
