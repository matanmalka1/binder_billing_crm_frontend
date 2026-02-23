import { useState } from "react";
import { AlertTriangle, DollarSign, Package, CheckCircle2, Sparkles } from "lucide-react";
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
import { cn } from "../../../utils/utils";

/* ── Props ──────────────────────────────────────────────────────────────── */

interface AttentionPanelProps {
  items: AttentionItem[];
}

/* ── Section registry ───────────────────────────────────────────────────── */

const SECTIONS = [
  {
    key: "overdue",
    title: "קלסרים באיחור",
    icon: AlertTriangle,
    types: ["overdue", "overdue_binder", "idle_binder"] as const,
    severity: "critical" as const,
    viewAllHref: "/binders",
  },
  {
    key: "unpaid",
    title: "חיובים שלא שולמו",
    icon: DollarSign,
    types: ["unpaid_charge", "unpaid_charges"] as const,
    severity: "warning" as const,
    viewAllHref: "/charges?status=issued",
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    icon: Package,
    types: ["ready_for_pickup"] as const,
    severity: "success" as const,
    viewAllHref: "/binders?status=ready_for_pickup",
  },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

/* ── Sortable wrapper ───────────────────────────────────────────────────── */

interface SortableCardProps {
  id: SectionKey;
  children: React.ReactNode;
}

const SortableCard = ({ id, children }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

/* ── Component ──────────────────────────────────────────────────────────── */

export const AttentionPanel = ({ items }: AttentionPanelProps) => {
  const [order, setOrder] = useState<SectionKey[]>(SECTIONS.map((s) => s.key));

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as SectionKey);
        const newIndex = prev.indexOf(over.id as SectionKey);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const totalItems = items.length;
  const hasUrgent = items.some((i) =>
    (SECTIONS[0].types as readonly string[]).includes(i.item_type)
  );
  const allClear = totalItems === 0;

  const sectionCounts = SECTIONS.map((s) => ({
    ...s,
    count: items.filter((i) => (s.types as readonly string[]).includes(i.item_type)).length,
  }));

  const orderedSections = order.map((key) => SECTIONS.find((s) => s.key === key)!);

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-elevation-2">

      {/* ── Panel header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-l from-slate-800 to-slate-900 px-6 py-5">
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              hasUrgent ? "bg-red-500/20" : "bg-white/10"
            )}>
              <Sparkles className={cn(
                "h-5 w-5",
                hasUrgent ? "text-red-300" : "text-white/70"
              )} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">לוח תשומת לב</h2>
              <p className="text-xs text-white/50 mt-0.5">
                {allClear ? "הכל תקין — אין דברים ממתינים" : `${totalItems} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          {/* Summary pills */}
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

      {/* ── All-clear state ──────────────────────────────────────────────── */}
      {allClear ? (
        <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white to-emerald-50/40 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">כל הפריטים תחת שליטה</p>
            <p className="mt-0.5 text-xs text-gray-400">אין דחיפויות כרגע</p>
          </div>
        </div>
      ) : (
        /* ── Draggable three-column sections grid ─────────────────────── */
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 bg-gray-50/70 p-4 md:grid-cols-3">
              {orderedSections.map((section, sectionIndex) => {
                const sectionItems = items.filter((item) =>
                  (section.types as readonly string[]).includes(item.item_type)
                );
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
