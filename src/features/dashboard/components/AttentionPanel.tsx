import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, ShieldAlert, Zap } from "lucide-react";
import { cn } from "@/utils/utils";
import type { ActionCommand } from "@/lib/actions/types";
import type { PanelItem, PanelSection } from "../attentionPanelSections";
import type { AttentionTone } from "../attentionPanelSections";
import {
  DashboardEmptyState,
  DashboardPanel,
  DashboardSectionHeader,
} from "./DashboardPrimitives";

const COLLAPSED_PREVIEW = 3;

const toneBar: Record<AttentionTone, string> = {
  amber: "bg-amber-500",
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
};

const toneIcon: Record<AttentionTone, string> = {
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
};

const toneBadge: Record<AttentionTone, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
};

const urgencyBadge: Record<string, string> = {
  overdue: "bg-red-50 text-red-700 border border-red-200",
  upcoming: "bg-amber-50 text-amber-700 border border-amber-200",
};

interface ActionRowProps {
  item: PanelItem;
  tone: AttentionTone;
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}

const ActionRow = ({ item, tone, activeActionKey, onAction }: ActionRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const actions = item.actions ?? [];

  return (
    <div className="divide-y divide-gray-50">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-right transition-colors hover:bg-slate-50"
      >
        <span className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", toneBar[tone])} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900">{item.label}</p>
          {item.sublabel && (
            <p className="truncate text-xs text-gray-500">{item.sublabel}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform duration-200 group-hover:text-blue-400",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="space-y-1.5 bg-gray-50/80 px-4 py-3">
          {actions.map((item) => {
            const isLoading = activeActionKey === item.action.uiKey;
            const isDisabled = activeActionKey !== null && !isLoading;
            return (
              <div key={item.uiKey} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {item.dueLabel && (
                    <p className="truncate text-xs text-gray-500">{item.dueLabel}</p>
                  )}
                  {item.urgency && (
                    <span className={cn("mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold", urgencyBadge[item.urgency])}>
                      {item.urgency === "overdue" ? "באיחור" : "מתקרב"}
                    </span>
                  )}
                </div>
                <button
                  disabled={isDisabled || isLoading}
                  onClick={() => onAction(item.action)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    isLoading
                      ? "bg-blue-100 text-blue-400"
                      : isDisabled
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <Zap className="h-3 w-3" />
                  {isLoading ? "מבצע..." : item.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
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
  onAction,
}: AttentionPanelProps) => {
  const filledSections = sections.filter((s) => s.items.length > 0);
  const totalItems = filledSections.reduce((n, s) => n + s.items.length, 0);

  const [activeTab, setActiveTab] = useState(() => filledSections[0]?.key ?? "");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const activeSection = filledSections.find((s) => s.key === activeTab);

  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

  const handleAction = (action: ActionCommand) => {
    onAction?.(action);
  };

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
              const IconComponent = section.icon;
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
                    <IconComponent className="h-2.5 w-2.5" />
                  </span>
                  {section.title}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isActive ? toneBadge[section.tone] : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {section.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {activeSection && (
            <>
              <div className="divide-y divide-gray-50">
                {(() => {
                  const expanded = expandedGroups.has(activeSection.key);
                  const visibleItems = expanded
                    ? activeSection.items
                    : activeSection.items.slice(0, COLLAPSED_PREVIEW);
                  const hiddenCount = activeSection.items.length - COLLAPSED_PREVIEW;
                  const hasActions = activeSection.items.some((i) => (i.actions?.length ?? 0) > 0);

                  return (
                    <>
                      {visibleItems.map((item) =>
                        hasActions && (item.actions?.length ?? 0) > 0 ? (
                          <ActionRow
                            key={item.id}
                            item={item}
                            tone={activeSection.tone}
                            activeActionKey={activeActionKey}
                            onAction={handleAction}
                          />
                        ) : (
                          <Link
                            key={item.id}
                            to={item.href}
                            className="group flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                          >
                            <span className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", toneBar[activeSection.tone])} />
                            <div className="min-w-0 flex-1 text-right">
                              <p className="truncate text-sm font-bold text-gray-900">{item.label}</p>
                              {item.sublabel && (
                                <p className="truncate text-xs text-gray-500">{item.sublabel}</p>
                              )}
                            </div>
                            <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-400" />
                          </Link>
                        ),
                      )}
                      {hiddenCount > 0 && (
                        <button
                          onClick={() => toggleGroup(activeSection.key)}
                          className="flex w-full items-center justify-center gap-1.5 border-t border-gray-50 py-2.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-slate-50 hover:text-gray-600"
                        >
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", expanded && "rotate-180")} />
                          {expanded ? "הצג פחות" : `${hiddenCount} פריטים נוספים`}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  to={activeSection.viewAllHref}
                  className="text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600"
                >
                  הצג הכל ←
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </DashboardPanel>
  );
};

AttentionPanel.displayName = "AttentionPanel";
