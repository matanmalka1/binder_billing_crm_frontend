import { useState, useMemo } from "react";
import { Plus, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/ui/primitives/Badge";
import { Button } from "../../../components/ui/primitives/Button";
import { VatWorkItemsCreateModal } from "./VatWorkItemsCreateModal";
import { VatExportButtons } from "./VatExportButtons";
import type { CreateVatWorkItemPayload, VatAnnualSummary, VatPeriodRow } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";
import { VAT_CLIENT_SUMMARY_STATUS_VARIANTS } from "../constants";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { formatVatAmountLtrSafe } from "../utils";
import { semanticMonoToneClasses } from "../../../utils/semanticColors";
import { useVatClientSummary } from "../hooks/useVatClientSummary";
import type { VatClientSummaryPanelProps } from "../types";

const fmt = formatVatAmountLtrSafe;

const getNetVatTone = (value: string | number | null | undefined) =>
  Number(value) >= 0 ? semanticMonoToneClasses.negative : semanticMonoToneClasses.positive;

const AmountCell = ({ value, bold }: { value: string | number | null | undefined; bold?: boolean }) => (
  <span dir="ltr" className={`tabular-nums ${bold ? "font-bold" : ""} ${getNetVatTone(value)}`}>
    {fmt(value)}
  </span>
);

const NeutralAmount = ({ value }: { value: string | number | null | undefined }) => (
  <span dir="ltr" className="tabular-nums text-gray-700">{fmt(value)}</span>
);

const thCls = "px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500";
const tdCls = "px-4 py-3 text-sm";

interface YearGroupProps {
  annual: VatAnnualSummary;
  rows: VatPeriodRow[];
  onRowClick: (row: VatPeriodRow) => void;
}

const YearGroup: React.FC<YearGroupProps> = ({ annual, rows, onRowClick }) => {
  const allFiled = annual.filed_count === annual.periods_count && annual.periods_count > 0;

  return (
    <>
      {/* Year header row */}
      <tr className="bg-gray-50/80 border-t-2 border-gray-200">
        <td className="px-4 py-2 font-bold text-gray-800 text-sm">{annual.year}</td>
        <td className="px-4 py-2">
          <Badge variant={allFiled ? "success" : "neutral"} className="text-xs">
            {annual.filed_count}/{annual.periods_count} הוגשו
          </Badge>
        </td>
        <td className={`${tdCls} font-semibold`}>
          <NeutralAmount value={annual.total_output_vat} />
        </td>
        <td className={`${tdCls} font-semibold`}>
          <NeutralAmount value={annual.total_input_vat} />
        </td>
        <td className={`${tdCls} font-bold`}>
          <AmountCell value={annual.net_vat} bold />
        </td>
        <td />
      </tr>

      {/* Period rows */}
      {rows.map((row) => (
        <tr
          key={row.period}
          onClick={() => onRowClick(row)}
          className="group cursor-pointer border-t border-gray-100 transition-colors hover:bg-primary-50/30"
        >
          <td className={`${tdCls} pl-8 font-mono font-medium text-gray-700`}>{row.period}</td>
          <td className={tdCls}>
            <Badge variant={VAT_CLIENT_SUMMARY_STATUS_VARIANTS[row.status] ?? "neutral"}>
              {getVatWorkItemStatusLabel(row.status)}
            </Badge>
          </td>
          <td className={tdCls}><NeutralAmount value={row.total_output_vat} /></td>
          <td className={tdCls}><NeutralAmount value={row.total_input_vat} /></td>
          <td className={tdCls}><AmountCell value={row.net_vat} /></td>
          <td className="px-3 py-3 w-8">
            <ExternalLink className="h-3.5 w-3.5 text-gray-300 transition-colors group-hover:text-primary-500" />
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
  const { data, isLoading, error, createMutation } = useVatClientSummary(clientId);

  const grouped = useMemo(() => {
    const periods = data?.periods ?? [];
    const annual = data?.annual ?? [];
    return annual.map((a) => ({
      annual: a,
      rows: periods.filter((p) => p.period.startsWith(String(a.year))),
    }));
  }, [data]);

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

  return (
    <div className="space-y-4" dir="rtl">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          פתיחת תיק מע״מ
        </Button>
        {role === "advisor" && <VatExportButtons clientId={clientId} showYearSelector />}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-negative-200 bg-negative-50 px-4 py-3 text-sm text-negative-700">
          שגיאה בטעינת נתוני מע״מ. אנא נסה שוב מאוחר יותר.
        </div>
      )}

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
              ) : grouped.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                    אין תקופות מע״מ ללקוח זה
                  </td>
                </tr>
              ) : (
                grouped.map(({ annual, rows }) => (
                  <YearGroup
                    key={annual.year}
                    annual={annual}
                    rows={rows}
                    onRowClick={handleRowClick}
                  />
                ))
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
