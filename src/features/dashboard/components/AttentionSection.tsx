import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Inbox } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { cn } from "../../../utils/utils";

/* ── Types ──────────────────────────────────────────────────────────────── */

type Severity = "critical" | "warning" | "success";

interface SectionConfig {
  key: string;
  title: string;
  icon: LucideIcon;
  types: readonly string[];
  severity: Severity;
  viewAllHref: string;
}

interface AttentionSectionProps {
  section: SectionConfig;
  items: AttentionItem[];
  sectionIndex: number;
}

/* ── Href resolver ──────────────────────────────────────────────────────── */

const itemHrefMap: Record<string, (item: AttentionItem) => string> = {
  overdue:           (item) => item.client_id ? `/clients/${item.client_id}` : "/binders",
  overdue_binder:    (item) => item.client_id ? `/clients/${item.client_id}` : "/binders",
  idle_binder:       (item) => item.client_id ? `/clients/${item.client_id}` : "/binders?work_state=waiting_for_work",
  unpaid_charge:     (item) => item.client_id ? `/clients/${item.client_id}` : "/charges?status=issued",
  unpaid_charges:    (item) => item.client_id ? `/clients/${item.client_id}` : "/charges?status=issued",
  ready_for_pickup:  (item) => item.client_id ? `/clients/${item.client_id}` : "/binders?status=ready_for_pickup",
};

const getItemHref = (item: AttentionItem): string => {
  const fn = itemHrefMap[item.item_type];
  return fn ? fn(item) : (item.client_id ? `/clients/${item.client_id}` : "/binders");
};

/* ── Variant maps ───────────────────────────────────────────────────────── */

const severityConfig: Record<Severity, {
  headerGradient: string;
  iconBg: string;
  iconText: string;
  badge: string;
  itemDot: string;
  itemHover: string;
  itemBorder: string;
  viewAll: string;
  emptyIcon: string;
  countPill: string;
}> = {
  critical: {
    headerGradient: "from-red-600 to-rose-500",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    badge: "bg-red-600 text-white",
    itemDot: "bg-red-400",
    itemHover: "hover:bg-red-50/70",
    itemBorder: "border-red-100",
    viewAll: "text-red-600 hover:text-red-800",
    emptyIcon: "text-red-200",
    countPill: "bg-white/20 text-white",
  },
  warning: {
    headerGradient: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    badge: "bg-amber-500 text-white",
    itemDot: "bg-amber-400",
    itemHover: "hover:bg-amber-50/70",
    itemBorder: "border-amber-100",
    viewAll: "text-amber-600 hover:text-amber-800",
    emptyIcon: "text-amber-200",
    countPill: "bg-white/20 text-white",
  },
  success: {
    headerGradient: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    badge: "bg-emerald-500 text-white",
    itemDot: "bg-emerald-400",
    itemHover: "hover:bg-emerald-50/70",
    itemBorder: "border-emerald-100",
    viewAll: "text-emerald-600 hover:text-emerald-800",
    emptyIcon: "text-emerald-200",
    countPill: "bg-white/20 text-white",
  },
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const AttentionSection = ({ section, items, sectionIndex }: AttentionSectionProps) => {
  const hasItems = items.length > 0;
  const IconComponent = section.icon;
  const cfg = severityConfig[section.severity];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevation-1 animate-fade-in"
      style={{ animationDelay: `${sectionIndex * 80}ms` }}
    >
      {/* ── Gradient header ─────────────────────────────────────────────── */}
      <div className={cn("flex items-center justify-between bg-gradient-to-l px-5 py-3.5", cfg.headerGradient)}>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-white/20 p-1.5">
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">{section.title}</span>
        </div>

        <span className={cn(
          "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
          cfg.countPill
        )}>
          {items.length}
        </span>
      </div>

      {/* ── Items list ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: "240px" }}>
        {hasItems ? (
          items.map((item, i) => (
            <Link
              key={`${item.item_type}-${item.binder_id ?? i}-${item.client_id ?? i}`}
              to={getItemHref(item)}
              className={cn(
                "group flex items-start gap-3 px-5 py-3 transition-colors duration-150",
                cfg.itemHover
              )}
            >
              {/* Dot indicator */}
              <div className="mt-1.5 shrink-0">
                <div className={cn("h-2 w-2 rounded-full", cfg.itemDot)} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                {item.client_name && (
                  <p className="truncate text-xs font-semibold text-gray-800 leading-snug">
                    {item.client_name}
                  </p>
                )}
                <p className="truncate text-xs text-gray-500 leading-snug mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className={cn("h-7 w-7", cfg.emptyIcon)} />
            <p className="text-xs text-gray-400">אין פריטים</p>
          </div>
        )}
      </div>

      {/* ── Footer / view all ───────────────────────────────────────────── */}
      {hasItems && (
        <div className={cn("border-t px-5 py-2.5", cfg.itemBorder)}>
          <Link
            to={section.viewAllHref}
            className={cn("text-xs font-semibold transition-colors", cfg.viewAll)}
          >
            הצג הכל ←
          </Link>
        </div>
      )}
    </div>
  );
};

AttentionSection.displayName = "AttentionSection";