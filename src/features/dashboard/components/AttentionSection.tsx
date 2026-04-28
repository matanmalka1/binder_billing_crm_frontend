import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { AttentionItem } from "../api";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";
import type { SectionConfig } from "../utils";
import { DashboardBadge, DashboardEmptyState } from "./DashboardPrimitives";

interface AttentionSectionProps {
  section: SectionConfig & { types: readonly string[]; viewAllHref: string };
  items: AttentionItem[];
  sectionIndex: number;
}

const getBusinessHref = (item: AttentionItem, fallback: string): string => {
  if (item.client_id && item.business_id) {
    return `/clients/${item.client_id}/businesses/${item.business_id}`;
  }
  if (item.client_id) {
    return `/clients/${item.client_id}`;
  }
  return fallback;
};

const itemHrefMap: Record<string, (item: AttentionItem) => string> = {
  unpaid_charge: (item) => getBusinessHref(item, "/charges?status=issued"),
  unpaid_charges: (item) => getBusinessHref(item, "/charges?status=issued"),
  ready_for_pickup: (item) => getBusinessHref(item, "/binders?status=ready_for_pickup"),
};

const getItemHref = (item: AttentionItem): string => {
  const fn = itemHrefMap[item.item_type];
  return fn ? fn(item) : getBusinessHref(item, "/binders");
};

export const AttentionSection = ({ section, items, sectionIndex }: AttentionSectionProps) => {
  const hasItems = items.length > 0;
  const IconComponent = section.icon;
  const tone = section.severity === "success" ? "green" : section.severity === "critical" ? "red" : "amber";

  return (
    <section
      className="animate-fade-in overflow-hidden rounded-2xl border border-gray-200 bg-white [animation-delay:var(--enter-delay)]"
      style={staggerAnimationDelayVars(sectionIndex, 80)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              tone === "green" ? "bg-green-50 text-green-600" : tone === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600",
            )}
          >
            <IconComponent className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-bold text-gray-900">{section.title}</span>
        </div>
        <DashboardBadge tone={tone} strong={hasItems}>
          {items.length}
        </DashboardBadge>
      </div>

      <div className="max-h-[260px] flex-1 overflow-y-auto p-2">
        {hasItems ? (
          <div className="space-y-1">
            {items.map((item, i) => (
              <Link
                key={`${item.item_type}-${item.binder_id ?? i}-${item.business_id ?? item.client_id ?? i}`}
                to={getItemHref(item)}
                className="group flex min-h-14 items-start gap-3 rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-slate-50"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    tone === "green" ? "bg-green-500" : tone === "red" ? "bg-red-500" : "bg-amber-500",
                  )}
                />
                <span className="min-w-0 flex-1">
                  {item.client_name && (
                    <span className="block truncate text-xs font-bold leading-5 text-gray-900">
                      {item.client_name}
                    </span>
                  )}
                  <span className="block text-xs leading-5 text-gray-500">
                    {item.description}
                  </span>
                </span>
                <ArrowLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-500" />
              </Link>
            ))}
          </div>
        ) : (
          <DashboardEmptyState title="אין פריטים" className="py-8" />
        )}
      </div>

      {hasItems && (
        <div className="border-t border-gray-100 px-4 py-3">
          <Link
            to={section.viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600"
          >
            הצג הכל ←
          </Link>
        </div>
      )}
    </section>
  );
};

AttentionSection.displayName = "AttentionSection";
