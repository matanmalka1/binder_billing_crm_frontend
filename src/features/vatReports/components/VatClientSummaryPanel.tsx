import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildYearOptions, showErrorToast } from "../../../utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import type {
  CreateVatWorkItemPayload,
  VatAnnualSummary,
  VatPeriodRow,
} from "../api";
import { vatReportsQK } from "../api/queryKeys";
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Button } from "../../../components/ui/primitives/Button";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { useAuthStore } from "../../../store/auth.store";
import { VatWorkItemsCreateModal } from "./VatWorkItemsCreateModal";
import { toast } from "../../../utils/toast";
import {
  VAT_CLIENT_SUMMARY_STATUS_VARIANTS,
} from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatVatAmountLtrSafe } from "../utils";
import type { VatClientSummaryPanelProps } from "../types";

const fmt = formatVatAmountLtrSafe;

// ── Columns ──────────────────────────────────────────────────────────────────

const buildColumns = (): Column<VatPeriodRow>[] => [
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
    key: "total_input_net",
    header: "נטו תשומות",
    render: (r) => <span dir="ltr" className="tabular-nums text-gray-700">{fmt(r.total_input_net)}</span>,
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
      <span
        dir="ltr"
        className={`tabular-nums font-semibold ${Number(r.net_vat) >= 0 ? "text-red-600" : "text-green-600"}`}
      >
        {fmt(r.net_vat)}
      </span>
    ),
  },
  {
    key: "final_vat_amount",
    header: "סופי",
    render: (r) => <span dir="ltr" className="tabular-nums text-gray-500">{fmt(r.final_vat_amount)}</span>,
  },
  {
    key: "filed_at",
    header: "הוגש",
    render: (r) =>
      r.filed_at ? new Date(r.filed_at).toLocaleDateString("he-IL") : "—",
  },
];

// ── Annual summary card ───────────────────────────────────────────────────────

const AnnualCard = ({ row }: { row: VatAnnualSummary }) => {
  const allFiled = row.filed_count === row.periods_count && row.periods_count > 0;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">{row.year}</span>
        <Badge variant={allFiled ? "success" : "neutral"}>
          {row.filed_count}/{row.periods_count} הוגשו
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 mb-1">מע״מ עסקאות</div>
          <div dir="ltr" className="text-sm font-semibold tabular-nums text-gray-900">
            {fmt(row.total_output_vat)}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 mb-1">מע״מ תשומות</div>
          <div dir="ltr" className="text-sm font-semibold tabular-nums text-gray-900">
            {fmt(row.total_input_vat)}
          </div>
        </div>
        <div className="col-span-2 rounded-lg bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 mb-1">נטו לתשלום</div>
          <div
            dir="ltr"
            className={`text-sm font-bold tabular-nums ${Number(row.net_vat) >= 0 ? "text-red-600" : "text-green-600"}`}
          >
            {fmt(row.net_vat)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Export controls ───────────────────────────────────────────────────────────

const ExportControls = ({ businessId }: { businessId: number }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleExport = async (format: "excel" | "pdf") => {
    const setLoading = format === "excel" ? setLoadingExcel : setLoadingPdf;
    setLoading(true);
    try {
      await vatReportsApi.exportBusinessVat(businessId, format, year);
    } catch (err) {
      showErrorToast(err, "ייצוא נכשל, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const years = buildYearOptions().map((o) => Number(o.value));

  return (
    <div className="flex items-center gap-2">
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <button
        onClick={() => handleExport("excel")}
        disabled={loadingExcel}
        className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loadingExcel ? "מייצא..." : "Excel"}
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={loadingPdf}
        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loadingPdf ? "מייצא..." : "PDF"}
      </button>
    </div>
  );
};

// ── Panel ─────────────────────────────────────────────────────────────────────

export const VatClientSummaryPanel = ({ businessId }: VatClientSummaryPanelProps) => {
  const role = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: vatReportsQK.clientSummary(businessId),
    queryFn: () => vatReportsApi.getBusinessSummary(businessId),
    staleTime: 30_000,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateVatWorkItemPayload) => vatReportsApi.create(payload),
    onSuccess: async () => {
      toast.success('תיק מע"מ נוצר בהצלחה');
      await queryClient.invalidateQueries({
        queryKey: vatReportsQK.clientSummary(businessId),
      });
    },
  });

  const handleCreate = async (payload: CreateVatWorkItemPayload): Promise<boolean> => {
    setCreateError(null);
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (err) {
      setCreateError(showErrorToast(err, "שגיאה ביצירת תיק המע״מ"));
      return false;
    }
  };

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600">שגיאה בטעינת נתוני מע״מ</p>
      </Card>
    );
  }

  const PERIOD_COLUMNS = buildColumns();

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          + פתיחת תיק מע״מ
        </Button>
        {role === "advisor" && <ExportControls businessId={businessId} />}
      </div>

      <DataTable<VatPeriodRow>
        data={data?.periods ?? []}
        columns={PERIOD_COLUMNS}
        getRowKey={(r) => r.period}
        isLoading={isLoading}
        emptyMessage='אין תקופות מע״מ ללקוח זה'
        onRowClick={(r) => navigate(`/tax/vat/${r.work_item_id}`)}
      />

      {(data?.annual ?? []).length > 0 && (
        <Card title="סיכום שנתי">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(data!.annual.length, 3)}, minmax(0, 1fr))` }}
          >
            {data!.annual.map((row) => (
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
        initialClientId={businessId}
      />
    </div>
  );
};
