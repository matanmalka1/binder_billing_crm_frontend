import { Link } from "react-router-dom";
import { AlertTriangle, DollarSign, Package, CheckCircle2 } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { cn } from "../../../utils/utils";
import { SECTIONS } from "../utils";

interface UrgencyBarProps {
  items: AttentionItem[];
}

const sectionMeta = {
  overdue: {
    icon: AlertTriangle,
    href: "/binders",
    bgActive: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    dot: "bg-red-500",
    pulse: true,
  },
  unpaid: {
    icon: DollarSign,
    href: "/charges?status=issued",
    bgActive: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    dot: "bg-amber-500",
    pulse: false,
  },
  ready: {
    icon: Package,
    href: "/binders?status=ready_for_pickup",
    bgActive: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    dot: "bg-emerald-500",
    pulse: false,
  },
} as const;

export const UrgencyBar: React.FC<UrgencyBarProps> = ({ items }) => {
  const counts = SECTIONS.map((s) => ({
    ...s,
    count: items.filter((i) => s.types.includes(i.item_type)).length,
    meta: sectionMeta[s.key as keyof typeof sectionMeta],
  }));

  const total = items.length;
  const allClear = total === 0;

  if (allClear) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 animate-fade-in">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700">
          הכל תקין — אין פריטים דחופים כרגע
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {/* Label */}
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 ml-1">
        דורש טיפול
      </span>

      {counts.map(({ key, title, count, meta }) => {
        if (count === 0) return null;
        const Icon = meta.icon;

        return (
          <Link
            key={key}
            to={meta.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              meta.bgActive,
            )}
          >
            {meta.pulse ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            ) : (
              <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.dot)} />
            )}
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{title}</span>
            <span className="font-bold tabular-nums">{count}</span>
          </Link>
        );
      })}
    </div>
  );
};

UrgencyBar.displayName = "UrgencyBar";
