import { useState } from "react";
import { Link } from "react-router-dom";
import { buildYearOptions } from "../../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { vatReportsApi } from "../../../api/vatReports.api";
import type { VatAnnualSummary, VatPeriodRow } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { useAuthStore } from "../../../store/auth.store";

// Format currency LTR-safe: negative sign before ₪, not after
const fmt = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "—";
  const n = Number(amount);
  return n < 0 ? `-₪${Math.abs(n).toFixed(2)}` : `₪${n.toFixed(2)}`;
};

// ── Status label ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending_materials: "ממתין לחומרים",
  material_received: "חומרים התקבלו",
  data_entry_in_progress: "הזנת נתונים",
  ready_for_review: "ממתין לבדיקה",
  filed: "הוגש",
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "info" | "neutral"> = {
  filed: "success",
  ready_for_review: "warning",
  data_entry_in_progress: "info",
  material_received: "neutral",
  pending_materials: "neutral",
};

// ── Columns ──────────────────────────────────────────────────────────────────

const PERIOD_COLUMNS: Column<VatPeriodRow>[] = [
  {
    key: "period",
    header: "תקופה",
    render: (r) => <span className="font-mono text-sm">{r.period}</span>,
  },
  {
    key: "status",
    header: "סטטוס",
    render: (r) => (
      <Badge variant={STATUS_VARIANT[r.status] ?? "neutral"}>
        {STATUS_LABELS[r.status] ?? r.status}
      </Badge>
    ),
  },
  {
    key: "total_output_vat",
    header: "עסקאות",
    render: (r) => <span dir="ltr" className="tabular-nums">{fmt(r.total_output_vat)}</span>,
  },
  {
    key: "total_input_vat",
    header: "תשומות",
    render: (r) => <span dir="ltr" className="tabular-nums">{fmt(r.total_input_vat)}</span>,
  },
  {
    key: "net_vat",
    header: "נטו",
    render: (r) => <span dir="ltr" className="tabular-nums">{fmt(r.net_vat)}</span>,
  },
  {
    key: "final_vat_amount",
    header: "סופי",
    render: (r) => <span dir="ltr" className="tabular-nums">{fmt(r.final_vat_amount)}</span>,
  },
  {
    key: "filed_at",
    header: "הוגש",
    render: (r) =>
      r.filed_at
        ? new Date(r.filed_at).toLocaleDateString("he-IL")
        : "—",
  },
  {
    key: "action",
    header: "",
    headerClassName: "w-24",
    className: "w-24",
    render: (r) => (
      <Link
        to={`/tax/vat/${r.work_item_id}`}
        className="text-sm text-blue-600 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        פתח להקלדה
      </Link>
    ),
  },
];

// ── Annual summary cards ──────────────────────────────────────────────────────

const AnnualCard = ({ row }: { row: VatAnnualSummary }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-base font-semibold text-gray-900">{row.year}</span>
      <Badge variant={row.filed_count === row.periods_count && row.periods_count > 0 ? "success" : "neutral"}>
        {row.filed_count}/{row.periods_count} תקופות הוגשו
      </Badge>
    </div>
    <div className="grid grid-cols-3 gap-3 text-center">
      <div>
        <div className="text-xs text-gray-500">עסקאות</div>
        <div className="text-sm font-medium text-gray-900">
          <span dir="ltr" className="tabular-nums">{fmt(row.total_output_vat)}</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">תשומות</div>
        <div className="text-sm font-medium text-gray-900">
          <span dir="ltr" className="tabular-nums">{fmt(row.total_input_vat)}</span>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">נטו</div>
        <div className="text-sm font-semibold" style={{ color: row.net_vat >= 0 ? "#16a34a" : "#dc2626" }}>
          <span dir="ltr" className="tabular-nums">{fmt(row.net_vat)}</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Export controls ───────────────────────────────────────────────────────────

interface ExportControlsProps {
  clientId: number;
}

const ExportControls = ({ clientId }: ExportControlsProps) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleExport = async (format: "excel" | "pdf") => {
    const setLoading = format === "excel" ? setLoadingExcel : setLoadingPdf;
    setLoading(true);
    try {
      await vatReportsApi.exportClientVat(clientId, format, year);
    } finally {
      setLoading(false);
    }
  };

  const years = buildYearOptions().map((o) => Number(o.value));

  return (
    <div className="flex items-center gap-3">
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button
        onClick={() => handleExport("excel")}
        disabled={loadingExcel}
        className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loadingExcel ? "מייצא..." : "ייצוא Excel"}
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={loadingPdf}
        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loadingPdf ? "מייצא..." : "ייצוא PDF"}
      </button>
    </div>
  );
};

// ── Panel ─────────────────────────────────────────────────────────────────────

interface VatClientSummaryPanelProps {
  clientId: number;
}

export const VatClientSummaryPanel = ({ clientId }: VatClientSummaryPanelProps) => {
  const role = useAuthStore((s) => s.user?.role);
  const { data, isLoading, error } = useQuery({
    queryKey: QK.tax.vatWorkItems.clientSummary(clientId),
    queryFn: () => vatReportsApi.getClientSummary(clientId),
    staleTime: 30_000,
    retry: 1,
  });

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600">שגיאה בטעינת נתוני מע״מ</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {role === "advisor" && (
        <div className="flex justify-end">
          <ExportControls clientId={clientId} />
        </div>
      )}

      <DataTable<VatPeriodRow>
        data={data?.periods ?? []}
        columns={PERIOD_COLUMNS}
        getRowKey={(r) => r.period}
        isLoading={isLoading}
        emptyMessage="אין תקופות מע״מ ללקוח זה"
      />

      {(data?.annual ?? []).length > 0 && (
        <Card title="סיכום שנתי">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(data!.annual.length, 3)}, minmax(0, 1fr))` }}>
            {data!.annual.map((row) => (
              <AnnualCard key={row.year} row={row} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
