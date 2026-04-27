import { CheckCircle2, Clock, Users, XCircle, TrendingUp, Banknote } from "lucide-react";
import { StatsCard } from "@/components/ui/layout/StatsCard";
import { fmtCurrency } from "@/utils/utils";
import type { TaxSubmissionWidgetResponse } from "../api";

interface TaxSubmissionStatsProps {
  data?: TaxSubmissionWidgetResponse;
  activeFilter?: string;
  onFilter?: (status: string) => void;
}

export const TaxSubmissionStats = ({ data, activeFilter, onFilter }: TaxSubmissionStatsProps) => {
  if (!data) return null;

  const filter = (status: string) => {
    if (!onFilter) return undefined;
    return () => onFilter(activeFilter === status ? "" : status);
  };

  const stats = [
    {
      key: "total",
      title: 'סה"כ לקוחות',
      value: data.total_clients,
      icon: Users,
      variant: "neutral" as const,
      filterValue: "",
    },
    {
      key: "submitted",
      title: "דוחות שהוגשו",
      value: data.reports_submitted,
      icon: CheckCircle2,
      variant: "green" as const,
      filterValue: "completed",
    },
    {
      key: "in_progress",
      title: "בתהליך עבודה",
      value: data.reports_in_progress,
      icon: Clock,
      variant: "blue" as const,
      filterValue: "pending",
    },
    {
      key: "not_started",
      title: "טרם התחילו",
      value: data.reports_not_started,
      icon: XCircle,
      variant: "red" as const,
      filterValue: null,
    },
    {
      key: "completion",
      title: "אחוז השלמה",
      value: `${data.submission_percentage}%`,
      icon: TrendingUp,
      variant: "purple" as const,
      filterValue: null,
    },
    ...(data.total_refund_due > 0
      ? [{ key: "refund", title: "החזרי מס", value: fmtCurrency(data.total_refund_due), icon: Banknote, variant: "green" as const, filterValue: null }]
      : []),
    ...(data.total_tax_due > 0
      ? [{ key: "tax_due", title: "תשלומי מס", value: fmtCurrency(data.total_tax_due), icon: Banknote, variant: "red" as const, filterValue: null }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ key, title, value, icon, variant, filterValue }) => {
        const isFilterable = filterValue !== null;
        const isSelected = isFilterable && activeFilter === filterValue;
        return (
          <StatsCard
            key={key}
            title={title}
            value={value}
            icon={icon}
            variant={variant}
            onClick={isFilterable ? filter(filterValue) : undefined}
            selected={isSelected}
          />
        );
      })}
    </div>
  );
};

TaxSubmissionStats.displayName = "TaxSubmissionStats";
