import { Clock, CheckCircle2, FileText, XCircle } from "lucide-react";
import type { ChargeResponse } from "../../../api/charges.api";

interface ChargesSummaryBarProps {
  charges: ChargeResponse[];
  isAdvisor: boolean;
  total: number;
}

const formatILS = (amount: number): string =>
  amount.toLocaleString("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\s/g, "");

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  valueColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, iconBg, valueColor }) => (
  <div className={`relative flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm overflow-hidden`}>
    <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-r-xl ${accent}`} />
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-lg font-bold tabular-nums leading-tight ${valueColor}`}>{value}</p>
    </div>
  </div>
);

export const ChargesSummaryBar: React.FC<ChargesSummaryBarProps> = ({ charges, isAdvisor }) => {
  if (charges.length === 0) return null;

  const amountOrCount = (status: string): string => {
    const group = charges.filter((c) => c.status === status);
    if (!isAdvisor) return String(group.length);
    const sum = group
      .filter((c): c is ChargeResponse & { amount: number } =>
        "amount" in c && typeof c.amount === "number"
      )
      .reduce((s, c) => s + c.amount, 0);
    return formatILS(sum);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="ממתין לגביה"
        value={amountOrCount("issued")}
        icon={<Clock className="h-5 w-5 text-primary-600" />}
        accent="bg-primary-500"
        iconBg="bg-primary-50"
        valueColor="text-primary-700"
      />
      <StatCard
        label="שולם"
        value={amountOrCount("paid")}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        accent="bg-emerald-500"
        iconBg="bg-emerald-50"
        valueColor="text-emerald-700"
      />
      <StatCard
        label="טיוטה"
        value={amountOrCount("draft")}
        icon={<FileText className="h-5 w-5 text-gray-500" />}
        accent="bg-gray-400"
        iconBg="bg-gray-50"
        valueColor="text-gray-700"
      />
      <StatCard
        label="בוטל"
        value={amountOrCount("canceled")}
        icon={<XCircle className="h-5 w-5 text-red-500" />}
        accent="bg-red-400"
        iconBg="bg-red-50"
        valueColor="text-red-600"
      />
    </div>
  );
};

ChargesSummaryBar.displayName = "ChargesSummaryBar";
