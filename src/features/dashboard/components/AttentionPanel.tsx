import React from "react";
import { Card } from "../../../components/ui/Card";
import type { AttentionItem } from "../../../api/dashboard.api";

interface AttentionPanelProps {
  items: AttentionItem[];
}

const sections = [
  {
    key: "overdue",
    title: "תיקים באיחור",
    types: ["overdue", "overdue_binder", "idle_binder"],
  },
  {
    key: "unpaid",
    title: "חיובים שלא שולמו",
    types: ["unpaid_charge", "unpaid_charges"],
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    types: ["ready_for_pickup"],
  },
];

export const AttentionPanel: React.FC<AttentionPanelProps> = ({ items }) => {
  return (
    <Card title="לוח תשומת לב">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sections.map((section) => {
          const sectionItems = items.filter((item) => section.types.includes(item.item_type));
          return (
            <section key={section.key} className="rounded-md border border-gray-200 p-3">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">{section.title}</h4>
              {sectionItems.length > 0 ? (
                <ul className="space-y-2">
                  {sectionItems.map((item, index) => (
                    <li key={`${section.key}-${item.client_id}-${item.binder_id}-${index}`}>
                      <p className="text-sm text-gray-700">{item.description || "—"}</p>
                      <p className="text-xs text-gray-500">{item.client_name || "—"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">—</p>
              )}
            </section>
          );
        })}
      </div>
    </Card>
  );
};
