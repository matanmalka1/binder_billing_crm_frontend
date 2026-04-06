import { ChevronLeft } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { cn } from "../../../utils/utils";
import { formatVatAmount } from "../utils";
import { ISRAEL_VAT_RATE_PERCENT } from "../constants";
import type { VatInputCardProps, VatNetBannerProps, VatOutputCardProps } from "../types";

// ── Output (income) card ──────────────────────────────────────────────────────

export const VatOutputCard: React.FC<VatOutputCardProps> = ({ data, onNavigate }) => (
  <div className="rounded-xl border border-gray-100 border-r-4 border-r-positive-400 bg-white p-4 shadow-sm" dir="rtl">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-positive-700">
        מע&quot;מ עסקאות – מכירות
      </p>
      {onNavigate && (
        <Button type="button" variant="ghost" size="sm" onClick={onNavigate} className="p-0.5 text-positive-600 hover:text-positive-800 hover:bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>סה&quot;כ מכירות (ללא מע&quot;מ)</span>
        <span className="font-mono tabular-nums">{formatVatAmount(data.totalIncomeNet)}</span>
      </div>
      <div className="flex justify-between text-gray-400">
        <span>שיעור מע&quot;מ</span>
        <span className="font-mono">{ISRAEL_VAT_RATE_PERCENT}%</span>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
      <span className="text-sm font-semibold text-gray-700">מע&quot;מ עסקאות</span>
      <span className="font-mono text-2xl font-bold text-positive-700 tabular-nums">
        {formatVatAmount(data.totalOutputVat)}
      </span>
    </div>
  </div>
);

VatOutputCard.displayName = "VatOutputCard";

// ── Input (expense) card ──────────────────────────────────────────────────────

export const VatInputCard: React.FC<VatInputCardProps> = ({ data, onNavigate }) => (
  <div className="rounded-xl border border-gray-100 border-r-4 border-r-warning-400 bg-white p-4 shadow-sm" dir="rtl">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-warning-700">
        מע&quot;מ תשומות – הוצאות
      </p>
      {onNavigate && (
        <Button type="button" variant="ghost" size="sm" onClick={onNavigate} className="p-0.5 text-warning-600 hover:text-warning-800 hover:bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
    <div className="space-y-1.5 text-sm">
      {data.expenseRows.map((row) => (
        <div key={row.categoryKey} className="flex justify-between">
          <span className="text-gray-500">
            {row.label}
            {row.deductionRate < 1 && row.deductionRate > 0 && (
              <span className="mr-1 text-xs text-gray-400">
                ({Math.round(row.deductionRate * 100)}%)
              </span>
            )}
          </span>
          <span className="font-mono tabular-nums text-warning-700">
            {formatVatAmount(row.deductibleVat)}
          </span>
        </div>
      ))}
    </div>
    <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>סה&quot;כ הוצאות (ללא מע&quot;מ)</span>
        <span className="font-mono tabular-nums">{formatVatAmount(data.totalExpenseNet)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>מע&quot;מ בחשבוניות</span>
        <span className="font-mono tabular-nums">{formatVatAmount(data.totalGrossVat)}</span>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
      <span className="text-sm font-semibold text-gray-700">מע&quot;מ תשומות לניכוי</span>
      <span className="font-mono text-2xl font-bold text-warning-700 tabular-nums">
        {formatVatAmount(data.totalInputVat)}
      </span>
    </div>
  </div>
);

VatInputCard.displayName = "VatInputCard";

// ── Net VAT banner ────────────────────────────────────────────────────────────

export const VatNetBanner: React.FC<VatNetBannerProps> = ({ outputVat, inputVat, netVat }) => {
  const isPositive = netVat > 0;
  const isNegative = netVat < 0;
  const label = isPositive ? "יתרת מע\"מ לתשלום" : isNegative ? "זיכוי מע\"מ" : "מאוזן";
  const amountClass = isPositive ? "text-warning-400" : isNegative ? "text-positive-400" : "text-gray-300";

  return (
    <div className={cn("rounded-xl px-6 py-5 text-white", "bg-primary-900")} dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-primary-200">
          מע&quot;מ עסקאות ({formatVatAmount(outputVat)}) &minus; מע&quot;מ תשומות ({formatVatAmount(inputVat)})
        </p>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs font-medium text-primary-300">{label}</span>
          <span className={cn("font-mono text-4xl font-bold tabular-nums", amountClass)}>
            {formatVatAmount(Math.abs(netVat))}
          </span>
        </div>
      </div>
    </div>
  );
};

VatNetBanner.displayName = "VatNetBanner";
