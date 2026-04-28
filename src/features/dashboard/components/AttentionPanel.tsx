import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { AttentionItem } from "../api";
import { AttentionSection } from "./AttentionSection";
import { getVisibleAttentionSections } from "../utils";
import {
  DashboardEmptyState,
  DashboardPanel,
  DashboardSectionHeader,
} from "./DashboardPrimitives";

interface AttentionPanelProps {
  items: AttentionItem[];
}

export const AttentionPanel = ({ items }: AttentionPanelProps) => {
  const { sections, totalItems } = getVisibleAttentionSections(items);
  const allClear = totalItems === 0;

  return (
    <DashboardPanel>
      <div className="border-b border-gray-100 px-5 py-4">
        <DashboardSectionHeader
          icon={ShieldAlert}
          title="לוח תשומת לב"
          subtitle={allClear ? "הכל תקין — אין דברים ממתינים" : `${totalItems} פריטים ממתינים לטיפול`}
          count={totalItems}
          tone={totalItems > 0 ? "amber" : "neutral"}
        />
      </div>

      {allClear ? (
        <DashboardEmptyState
          icon={CheckCircle2}
          title="כל הפריטים תחת שליטה"
          description="אין דחיפויות כרגע"
          className="py-14"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-4 xl:grid-cols-2">
          {sections.map(({ section, items: sectionItems }, sectionIndex) => (
            <AttentionSection
              key={section.key}
              section={section}
              items={sectionItems}
              sectionIndex={sectionIndex}
            />
          ))}
        </div>
      )}
    </DashboardPanel>
  );
};

AttentionPanel.displayName = "AttentionPanel";
