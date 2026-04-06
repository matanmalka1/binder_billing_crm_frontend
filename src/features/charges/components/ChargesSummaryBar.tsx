import { Clock, CheckCircle2, FileText, XCircle } from "lucide-react";
import { semanticStatToneClasses } from "@/utils/semanticColors";
import type { ChargeResponse } from "../api";
import { formatILS } from "../utils";

interface ChargesSummaryBarProps {
  charges: ChargeResponse[];
  isAdvisor: boolean;
  total: number;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: keyof typeof semanticStatToneClasses;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, tone }) => {
  const styles = semanticStatToneClasses[tone];

  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
      <div className={`absolute bottom-0 right-0 top-0 w-1 rounded-r-xl ${styles.accent}`} />
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}>
      {icon}
      </div>
      <div className="min-w-0">
        <p className="mb-0.5 text-xs text-gray-500">{label}</p>
        <p className={`text-lg font-bold leading-tight tabular-nums ${styles.value}`}>{value}</p>
      </div>
    </div>
  );
};

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
        icon={<Clock className="h-5 w-5" />}
        tone="info"
      />
      <StatCard
        label="שולם"
        value={amountOrCount("paid")}
        icon={<CheckCircle2 className="h-5 w-5" />}
        tone="positive"
      />
      <StatCard
        label="טיוטה"
        value={amountOrCount("draft")}
        icon={<FileText className="h-5 w-5" />}
        tone="neutral"
      />
      <StatCard
        label="בוטל"
        value={amountOrCount("canceled")}
        icon={<XCircle className="h-5 w-5" />}
        tone="negative"
      />
    </div>
  );
};

ChargesSummaryBar.displayName = "ChargesSummaryBar";
