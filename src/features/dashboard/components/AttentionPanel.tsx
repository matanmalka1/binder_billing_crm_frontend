import { Card } from "../../../components/ui/Card";
import { Bell, AlertTriangle, DollarSign, CheckCircle } from "lucide-react";
import type { AttentionItem } from "../../../api/dashboard.api";
import { AttentionSection } from "./AttentionSection";

interface AttentionPanelProps {
  items: AttentionItem[];
}

const sections = [
  {
    key: "overdue",
    title: "תיקים באיחור",
    icon: AlertTriangle,
    types: ["overdue", "overdue_binder", "idle_binder"],
    variant: "error" as const,
    color: "red",
  },
  {
    key: "unpaid",
    title: "חיובים שלא שולמו",
    icon: DollarSign,
    types: ["unpaid_charge", "unpaid_charges"],
    variant: "warning" as const,
    color: "orange",
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    icon: CheckCircle,
    types: ["ready_for_pickup"],
    variant: "success" as const,
    color: "green",
  },
];

export const AttentionPanel: React.FC<AttentionPanelProps> = ({ items }) => {
  const totalItems = items.length;

  return (
    <Card 
      variant="elevated" 
      className="overflow-hidden"
      title="לוח תשומת לב"
      subtitle={`${totalItems} פריטים הדורשים תשומת לב`}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sections.map((section, sectionIndex) => {
          const sectionItems = items.filter((item) => section.types.includes(item.item_type));
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

      {/* Overall Summary */}
      {totalItems > 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50 p-4 animate-fade-in">
          <Bell className="h-5 w-5 text-primary-600 animate-pulse" />
          <p className="text-sm font-medium text-gray-900">
            סך הכל <span className="text-primary-600">{totalItems}</span> פריטים דורשים תשומת לב
          </p>
        </div>
      )}
    </Card>
  );
};
