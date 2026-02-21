import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import type { ChargeResponse } from "../../../api/charges.api";

interface ChargesSummaryBarProps {
  charges: ChargeResponse[];
  isAdvisor: boolean;
}

const formatAmount = (amount: number): string =>
  `₪${amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ChargesSummaryBar: React.FC<ChargesSummaryBarProps> = ({ charges, isAdvisor }) => {
  if (!isAdvisor || charges.length === 0) return null;

  const advisorCharges = charges.filter(
    (c): c is ChargeResponse & { amount: number; currency: string } =>
      "amount" in c && typeof c.amount === "number"
  );

  if (advisorCharges.length === 0) return null;

  const totalIssued = advisorCharges
    .filter((c) => c.status === "issued")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaid = advisorCharges
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalDraft = advisorCharges
    .filter((c) => c.status === "draft")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalCanceled = advisorCharges
    .filter((c) => c.status === "canceled")
    .reduce((sum, c) => sum + c.amount, 0);

  const stats = [
    {
      label: "ממתין לגביה",
      value: formatAmount(totalIssued),
      icon: Clock,
      colorClass: "text-blue-700 bg-blue-50 border-blue-200",
      iconClass: "text-blue-500",
      show: totalIssued > 0,
    },
    {
      label: "שולם",
      value: formatAmount(totalPaid),
      icon: CheckCircle,
      colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
      iconClass: "text-emerald-500",
      show: totalPaid > 0,
    },
    {
      label: "טיוטות",
      value: formatAmount(totalDraft),
      icon: TrendingUp,
      colorClass: "text-gray-700 bg-gray-50 border-gray-200",
      iconClass: "text-gray-400",
      show: totalDraft > 0,
    },
    {
      label: "מבוטל",
      value: formatAmount(totalCanceled),
      icon: XCircle,
      colorClass: "text-red-700 bg-red-50 border-red-200",
      iconClass: "text-red-400",
      show: totalCanceled > 0,
    },
  ].filter((s) => s.show);

  if (stats.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
      <span className="text-xs font-semibold text-gray-400 shrink-0">סיכום עמוד:</span>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${stat.colorClass}`}
        >
          <stat.icon className={`h-3.5 w-3.5 shrink-0 ${stat.iconClass}`} />
          <span className="text-xs font-semibold tabular-nums">{stat.value}</span>
          <span className="text-xs opacity-70">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

ChargesSummaryBar.displayName = "ChargesSummaryBar";
