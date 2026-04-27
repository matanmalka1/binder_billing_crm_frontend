import { useState, useMemo } from "react";
import { CheckCircle2, ExternalLink, MinusCircle, Plus, ReceiptText, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { StatsCard } from "../../../components/ui/layout/StatsCard";
import { VatWorkItemsCreateModal } from "./VatWorkItemsCreateModal";
import { VatExportButtons } from "./VatExportButtons";
import type { CreateVatWorkItemPayload, VatAnnualSummary, VatPeriodRow } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { VAT_CLIENT_SUMMARY_STATUS_VARIANTS } from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatVatAmountLtrSafe } from "../utils";
import { useVatClientSummary } from "../hooks/useVatClientSummary";
import type { VatClientSummaryPanelProps } from "../types";
import {
  canOpenVatPeriodRow,
  formatVatPeriodLabel,
  getClientSummaryRowsForYear,
  getNetVatTone,
} from "../view.helpers";

const fmt = formatVatAmountLtrSafe;

const AmountCell = ({ value, bold }: { value: string | number | null | undefined; bold?: boolean }) => (
  <span
    dir="ltr"
    className={`inline-block min-w-24 text-left font-mono tabular-nums ${bold ? "font-bold" : ""} ${getNetVatTone(value)}`}
  >
    {fmt(value)}
  </span>
);

const NeutralAmount = ({ value }: { value: string | number | null | undefined }) => (
  <span dir="ltr" className="inline-block min-w-24 text-left font-mono tabular-nums text-gray-700">
    {fmt(value)}
  </span>
);

const thCls = "px-5 py-3 text-right text-xs font-semibold text-gray-500";
const tdCls = "px-5 py-4 text-sm";
const currencyTdCls = `${tdCls} text-left align-middle tabular-nums`;

interface YearGroupProps {
  annual: VatAnnualSummary;
  rows: VatPeriodRow[];
  onRowClick: (row: VatPeriodRow) => void;
}

const YearSummary = ({ annual }: { annual: VatAnnualSummary }) => (
  <section className="space-y-3">
    <div className="mb-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">סיכום מע״מ לשנת {annual.year}</h3>
        <p className="mt-0.5 text-xs text-gray-500">נתוני התקופות שהוקלדו והוגשו עבור הלקוח</p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="תקופות שהוגשו"
        value={`${annual.filed_count} מתוך ${annual.periods_count}`}
        icon={CheckCircle2}
        variant="green"
      />
      <StatsCard
        title="מע״מ עסקאות"
        value={fmt(annual.total_output_vat)}
        icon={ReceiptText}
        variant="neutral"
      />
      <StatsCard
        title="מע״מ תשומות"
        value={fmt(annual.total_input_vat)}
        icon={MinusCircle}
        variant="neutral"
      />
      <StatsCard
        title="מע״מ נטו לתשלום"
        value={fmt(annual.net_vat)}
        icon={WalletCards}
        variant={Number(annual.net_vat) >= 0 ? "red" : "green"}
      />
    </div>
  </section>
);

const YearGroup: React.FC<YearGroupProps> = ({ annual, rows, onRowClick }) => {
  const isBimonthly = annual.periods_count <= 6;

  return (
    <>
      {rows.map((row) => (
        <tr
          key={row.period}
          onClick={() => onRowClick(row)}
          className="group cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50"
        >
          <td className={tdCls}>
            <div className="font-semibold text-gray-900">{formatVatPeriodLabel(row.period, isBimonthly)}</div>
          </td>
          <td className={tdCls}>
            <Badge
              variant={VAT_CLIENT_SUMMARY_STATUS_VARIANTS[row.status] ?? "neutral"}
              className="inline-flex min-w-28 items-center justify-center px-3 py-1 text-center"
            >
              {getVatWorkItemStatusLabel(row.status)}
            </Badge>
          </td>
          <td className={currencyTdCls}><NeutralAmount value={row.total_output_vat} /></td>
          <td className={currencyTdCls}><NeutralAmount value={row.total_input_vat} /></td>
          <td className={currencyTdCls}><AmountCell value={row.net_vat} /></td>
          <td className="w-28 px-5 py-4 text-left">
            <Button variant="ghost" size="sm" className="text-gray-500 group-hover:text-primary-600">
              <ExternalLink className="h-3.5 w-3.5" />
              פתח דוח
            </Button>
          </td>
        </tr>
      ))}
    </>
  );
};

export const VatClientSummaryPanel = ({ clientId }: VatClientSummaryPanelProps) => {
  const role = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, error, createMutation } = useVatClientSummary(clientId);

  const yearOptions = useMemo(() => {
    const years = data?.annual.map((a) => a.year) ?? [selectedYear];
    return years.map((year) => ({ value: String(year), label: String(year) }));
  }, [data, selectedYear]);

  const selectedAnnual = useMemo(() => {
    const annual = data?.annual ?? [];
    return annual.find((a) => a.year === selectedYear) ?? annual[0] ?? null;
  }, [data, selectedYear]);

  const rows = useMemo(() => {
    return getClientSummaryRowsForYear(data?.periods, selectedAnnual?.year);
  }, [data, selectedAnnual]);

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
    if (!canOpenVatPeriodRow(row)) return;
    navigate(`/tax/vat/${row.work_item_id}`);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Action bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          פתיחת תיק מע״מ
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(selectedAnnual?.year ?? selectedYear)}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            options={yearOptions}
            className="w-28 py-1.5"
          />
          {role === "advisor" && <VatExportButtons clientId={clientId} year={selectedAnnual?.year ?? selectedYear} />}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-negative-200 bg-negative-50 px-4 py-3 text-sm text-negative-700">
          שגיאה בטעינת נתוני מע״מ. אנא נסה שוב מאוחר יותר.
        </div>
      )}

      {!error && selectedAnnual && <YearSummary annual={selectedAnnual} />}

      {/* Table */}
      {!error && (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm" dir="rtl">
            <thead className="bg-gray-50">
              <tr>
                <th className={thCls}>תקופה</th>
                <th className={thCls}>סטטוס</th>
                <th className={thCls}>מע״מ עסקאות</th>
                <th className={thCls}>מע״מ תשומות</th>
                <th className={thCls}>נטו לתשלום</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    טוען...
                  </td>
                </tr>
              ) : !selectedAnnual || rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    אין תקופות מע״מ ללקוח זה
                  </td>
                </tr>
              ) : (
                <YearGroup annual={selectedAnnual} rows={rows} onRowClick={handleRowClick} />
              )}
            </tbody>
          </table>
        </div>
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

VatClientSummaryPanel.displayName = "VatClientSummaryPanel";
