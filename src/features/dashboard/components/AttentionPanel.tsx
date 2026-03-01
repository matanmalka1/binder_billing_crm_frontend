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

  const hasUrgent = items.some((i) => SECTIONS[0].types.includes(i.item_type));
  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: items.filter((i) => s.types.includes(i.item_type)).length,
  }));
  const orderedSections = order.map((key) => SECTIONS.find((s) => s.key === key)!);
  const totalItems = items.length;
  const allClear = totalItems === 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-l from-slate-700 to-slate-900 px-6 py-4">
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Glow orb */}
        {hasUrgent && (
          <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-red-600 opacity-20 blur-2xl" />
        )}

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-sm",
              hasUrgent ? "bg-red-500/25" : "bg-white/10"
            )}>
              <ShieldAlert className={cn(
                "h-4.5 w-4.5",
                hasUrgent ? "text-red-300" : "text-white/60"
              )} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide text-white">לוח תשומת לב</h2>
              <p className="mt-0.5 text-xs text-white/50">
                {allClear ? "הכל תקין — אין דברים ממתינים" : `${totalItems} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          {/* Section count pills */}
          <div className="flex items-center gap-1.5">
            {sectionCounts.map((s) => {
              const pillColor = s.severity === "critical"
                ? "bg-red-500/80 text-white"
                : s.severity === "warning"
                ? "bg-amber-400/80 text-white"
                : "bg-emerald-400/80 text-white";

              return (
                <div
                  key={s.key}
                  className={cn(
                    "flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-[11px] font-bold tabular-nums",
                    s.count > 0 ? pillColor : "bg-white/10 text-white/30"
                  )}
                  title={s.title}
                >
                  {s.count}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {allClear ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
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