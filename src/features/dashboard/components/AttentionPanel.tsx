import { Bell, AlertTriangle, DollarSign, CheckCircle, Package } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { AttentionSection } from "./AttentionSection";
import { cn } from "../../../utils/utils";

interface AttentionPanelProps {
  items: AttentionItem[];
}

const sections = [
  {
    key: "overdue",
    title: "קלסרים באיחור",
    icon: AlertTriangle,
    types: ["overdue", "overdue_binder", "idle_binder"],
    severity: "critical" as const,
  },
  {
    key: "unpaid",
    title: "חיובים שלא שולמו",
    icon: DollarSign,
    types: ["unpaid_charge", "unpaid_charges"],
    severity: "warning" as const,
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    icon: Package,
    types: ["ready_for_pickup"],
    severity: "success" as const,
  },
] as const;

export const AttentionPanel = ({ items }: AttentionPanelProps) => {
  const totalItems = items.length;
  const hasUrgent = items.some((i) =>
    sections[0].types.includes(i.item_type as never)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "rounded-xl p-2",
            hasUrgent ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"
          )}>
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">לוח תשומת לב</h2>
            <p className="text-xs text-gray-400">
              {totalItems > 0
                ? `${totalItems} פריטים דורשים תשומת לב`
                : "אין פריטים — הכל תקין"}
            </p>
          </div>
        </div>

        {totalItems > 0 && (
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
            hasUrgent
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          )}>
            {totalItems}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
        {sections.map((section, sectionIndex) => {
          const sectionItems = items.filter((item) =>
            section.types.includes(item.item_type as never)
          );
          return (
            <AttentionSection
              key={section.key}
              section={section}
              items={sectionItems}
              sectionIndex={sectionIndex}
            />
          );
        })}
      </div>

      {/* All-clear state */}
      {totalItems === 0 && (
        <div className="flex items-center justify-center gap-3 border-t border-gray-100 py-8 text-center">
          <CheckCircle className="h-6 w-6 text-emerald-500" />
          <p className="text-sm font-medium text-gray-500">
            כל הפריטים תחת שליטה — אין דברים דחופים
          </p>
        </div>
      )}
    </div>
  );
};

AttentionPanel.displayName = "AttentionPanel";
