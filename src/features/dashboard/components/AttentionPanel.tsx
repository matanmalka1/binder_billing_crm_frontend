import { useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AttentionItem } from "../../../api/dashboard.api";
import { AttentionSection } from "./AttentionSection";
import { SECTIONS, type SectionKey } from "../utils";
import { cn } from "../../../utils/utils";

interface AttentionPanelProps {
  items: AttentionItem[];
}

const SortableCard = ({ id, children }: { id: SectionKey; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export const AttentionPanel = ({ items }: AttentionPanelProps) => {
  const [order, setOrder] = useState<SectionKey[]>(SECTIONS.map((s) => s.key));
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setOrder((prev) => arrayMove(prev, prev.indexOf(active.id as SectionKey), prev.indexOf(over.id as SectionKey)));
    }
  };

  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: items.filter((i) => s.types.includes(i.item_type)).length,
  }));
  const orderedSections = order.map((key) => SECTIONS.find((s) => s.key === key)!);
  const totalItems = items.length;
  const allClear = totalItems === 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
              <ShieldAlert className="h-3.5 w-3.5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wide text-gray-700">לוח תשומת לב</h2>
              <p className="text-[11px] text-gray-400">
                {allClear ? "הכל תקין — אין דברים ממתינים" : `${totalItems} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {sectionCounts.map((s) => (
              <div
                key={s.key}
                className={cn(
                  "flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-[11px] font-bold tabular-nums",
                  s.count > 0 ? "bg-gray-100 text-gray-600" : "bg-gray-50 text-gray-300"
                )}
                title={s.title}
              >
                {s.count}
              </div>
            ))}
          </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {allClear ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">כל הפריטים תחת שליטה</p>
            <p className="mt-0.5 text-xs text-gray-400">אין דחיפויות כרגע</p>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-1 gap-3 bg-gray-50/50 p-4 md:grid-cols-3">
              {orderedSections.map((section, sectionIndex) => {
                const sectionItems = items.filter((item) => section.types.includes(item.item_type));
                return (
                  <SortableCard key={section.key} id={section.key}>
                    <AttentionSection
                      section={section}
                      items={sectionItems}
                      sectionIndex={sectionIndex}
                    />
                  </SortableCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

AttentionPanel.displayName = "AttentionPanel";