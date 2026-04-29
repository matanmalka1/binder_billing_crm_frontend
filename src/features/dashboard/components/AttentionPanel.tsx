import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, ShieldAlert } from "lucide-react";
import { cn } from "@/utils/utils";
import type { ActionCommand } from "@/lib/actions/types";
import type { PanelItem, PanelSection, AttentionTone } from "../attentionPanelSections";
import {
  DashboardEmptyState,
  DashboardPanel,
  DashboardSectionHeader,
} from "./DashboardPrimitives";

const COLLAPSED_PREVIEW = 5;

const toneTab: Record<AttentionTone, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
};

const toneIcon: Record<AttentionTone, string> = {
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
};

const toneAccent: Record<AttentionTone, string> = {
  amber: "border-r-amber-300",
  green: "border-r-green-300",
  red: "border-r-red-400",
  blue: "border-r-blue-300",
};

const tonePill: Record<AttentionTone, string> = {
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  green: "bg-green-50 text-green-700 ring-1 ring-green-200",
  red: "bg-red-50 text-red-700 ring-1 ring-red-200",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

const toneBtn: Record<AttentionTone, string> = {
  amber: "bg-amber-500 hover:bg-amber-600 text-white",
  green: "bg-green-600 hover:bg-green-700 text-white",
  red: "bg-red-600 hover:bg-red-700 text-white",
  blue: "bg-blue-600 hover:bg-blue-700 text-white",
};

interface RowCardProps {
  item: PanelItem;
  tone: AttentionTone;
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}

const RowCard = ({ item, tone, activeActionKey, onAction }: RowCardProps) => {
  const action = item.actions?.[0] ?? null;
  const { meta } = item;
  const badgeTone = meta?.badgeTone ?? tone;
  const tagTone = meta?.tagTone ?? tone;

  // In RTL context: first child renders on the RIGHT, last child on the LEFT
  // So: text block first (right), action/arrow last (left)
  const rowInner = (
    <>
      {/* RIGHT: text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-gray-900">{item.label}</p>
          {meta?.badge && (
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", tonePill[badgeTone])}>
              {meta.badge}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          {item.sublabel && (
            <span className="truncate text-xs text-gray-500">{item.sublabel}</span>
          )}
          {meta?.tag && (
            <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold", tonePill[tagTone])}>
              {meta.tag}
            </span>
          )}
        </div>
        {meta?.description && (
          <p className="mt-1 truncate text-xs font-medium text-gray-600">
            {meta.description}
          </p>
        )}
      </div>

      {/* LEFT: action button or arrow */}
      {action ? (
        (() => {
          const isLoading = activeActionKey === action.action.uiKey;
          const isDisabled = activeActionKey !== null && !isLoading;
          const btnTone =
            action.urgency === "overdue" ? "red" : action.urgency === "upcoming" ? "amber" : tone;
          return (
            <button
              disabled={isDisabled || isLoading}
              onClick={() => onAction(action.action)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                isLoading
                  ? "cursor-wait bg-gray-100 text-gray-400"
                  : isDisabled
                    ? "cursor-not-allowed bg-gray-100 text-gray-300"
                    : toneBtn[btnTone],
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  מבצע...
                </span>
              ) : (
                action.label
              )}
            </button>
          );
        })()
      ) : (
        <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
      )}
    </>
  );

  const baseClass = cn(
    "flex items-center gap-3 border-r-2 bg-white px-4 py-3 transition-colors",
    toneAccent[tone],
  );

  if (action) {
    return <div className={baseClass}>{rowInner}</div>;
  }

  return (
    <Link to={item.href} className={cn("group", baseClass, "hover:bg-slate-50/80")}>
      {rowInner}
    </Link>
  );
};

interface AttentionPanelProps {
  sections: PanelSection[];
  activeActionKey?: string | null;
  onAction?: (action: ActionCommand) => void;
}

export const AttentionPanel = ({
  sections,
  activeActionKey = null,
  onAction = () => {},
}: AttentionPanelProps) => {
  const filledSections = sections.filter((s) => s.items.length > 0);
  const totalItems = filledSections.reduce((n, s) => n + s.items.length, 0);

  const [activeTab, setActiveTab] = useState(() => filledSections[0]?.key ?? "");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const activeSection = filledSections.find((s) => s.key === activeTab);

  useEffect(() => {
    if (filledSections.length === 0) {
      setActiveTab("");
      return;
    }
    if (!filledSections.some((s) => s.key === activeTab)) {
      setActiveTab(filledSections[0].key);
    }
  }, [activeTab, filledSections]);

  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <DashboardPanel>
      <div className="border-b border-gray-100 px-5 py-4">
        <DashboardSectionHeader
          icon={ShieldAlert}
          title="לוח תשומת לב"
          subtitle={
            totalItems === 0
              ? "הכל תקין — אין דברים ממתינים"
              : `${totalItems} פריטים ממתינים לטיפול`
          }
          count={totalItems}
          tone={totalItems > 0 ? "amber" : "neutral"}
        />
      </div>

      {totalItems === 0 ? (
        <DashboardEmptyState
          icon={CheckCircle2}
          title="כל הפריטים תחת שליטה"
          description="אין דחיפויות כרגע"
          className="py-14"
        />
      ) : (
        <>
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
            {filledSections.map((section) => {
              const isActive = activeTab === section.key;
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveTab(section.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  <span className={cn("flex h-4 w-4 items-center justify-center rounded", toneIcon[section.tone])}>
                    <Icon className="h-2.5 w-2.5" />
                  </span>
                  {section.title}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isActive ? cn("border", toneTab[section.tone]) : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {section.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {activeSection &&
            (() => {
              const expanded = expandedGroups.has(activeSection.key);
              const visibleItems = expanded
                ? activeSection.items
                : activeSection.items.slice(0, COLLAPSED_PREVIEW);
              const hiddenCount = activeSection.items.length - COLLAPSED_PREVIEW;

              return (
                <>
                  <div key={activeSection.key} className="divide-y divide-gray-100">
                    {visibleItems.map((item) => (
                      <RowCard
                        key={item.id}
                        item={item}
                        tone={activeSection.tone}
                        activeActionKey={activeActionKey}
                        onAction={onAction}
                      />
                    ))}
                  </div>

                  {hiddenCount > 0 && (
                    <button
                      onClick={() => toggleGroup(activeSection.key)}
                      className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-2.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-slate-50 hover:text-gray-600"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          expanded && "rotate-180",
                        )}
                      />
                      {expanded ? "הצג פחות" : `${hiddenCount} פריטים נוספים`}
                    </button>
                  )}

                  <div className="border-t border-gray-100 px-4 py-2.5">
                    <Link
                      to={activeSection.viewAllHref}
                      className="text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600"
                    >
                      הצג הכל ←
                    </Link>
                  </div>
                </>
              );
            })()}
        </>
      )}
    </DashboardPanel>
  );
};

AttentionPanel.displayName = "AttentionPanel";
