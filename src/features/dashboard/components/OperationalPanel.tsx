import { CheckCircle, Info, Zap, ArrowLeft, CheckSquare } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { ActionMethod, BackendAction, ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";
import { staggerAnimationDelayVars } from "../../../utils/animation";

interface OperationalPanelProps {
  quickActions: BackendAction[];
  activeActionKey: string | null;
  onQuickAction: (action: ActionCommand) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  binders: "קלסרים",
  vat: 'מע"מ',
  annual_reports: 'דו"חות שנתיים',
  charges: "גבייה",
};

const CATEGORY_ORDER = ["binders", "vat", "annual_reports", "charges"];

const ACTION_EFFECT_LABELS: Record<ActionMethod, string> = {
  get: "פתיחת פריט",
  post: "שינוי סטטוס",
  patch: "שינוי סטטוס",
  put: "עדכון פריט",
  delete: "מחיקת פריט",
};

const ACTION_EFFECT_DESCRIPTIONS: Record<ActionMethod, string> = {
  get: "פותח את הפריט הרלוונטי ללא שינוי נתונים",
  post: "מבצע פעולה במערכת ועשוי לשנות סטטוס",
  patch: "מעדכן את הפריט ועשוי לשנות סטטוס",
  put: "מעדכן את הפריט ועשוי לשנות נתונים",
  delete: "מוחק או מבטל פריט לאחר אישור",
};

const groupByCategory = (actions: ActionCommand[]): [string, ActionCommand[]][] => {
  const map = new Map<string, ActionCommand[]>();
  for (const action of actions) {
    const cat = action.category ?? "clients";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(action);
  }
  return CATEGORY_ORDER
    .filter((cat) => map.has(cat))
    .map((cat) => [cat, map.get(cat)!]);
};

interface ActionButtonProps {
  action: ActionCommand;
  isLoading: boolean;
  isDisabled: boolean;
  index: number;
  onQuickAction: (action: ActionCommand) => void;
}

const ActionButton = ({ action, isLoading, isDisabled, index, onQuickAction }: ActionButtonProps) => {
  const categoryLabel = CATEGORY_LABELS[action.category ?? ""] ?? "כללי";
  const effectLabel = ACTION_EFFECT_LABELS[action.method] ?? "פעולה";
  const effectDescription = ACTION_EFFECT_DESCRIPTIONS[action.method] ?? "מבצע פעולה במערכת";
  const requiresConfirmation = Boolean(action.confirm);
  const isReadOnly = action.method === "get";
  const title = `${effectLabel}: ${effectDescription}`;

  const content = (
    <>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {categoryLabel}
          </span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              isReadOnly
                ? "bg-info-50 text-info-700"
                : "bg-warning-50 text-warning-700",
            )}
          >
            {effectLabel}
          </span>
        </div>
        <p className={cn(
          "truncate text-[13px] font-semibold transition-colors",
          isLoading ? "text-info-700" : "text-gray-800 group-hover:text-info-700"
        )}>
          {action.label || "—"}
        </p>
        {action.clientName && (
          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {action.clientName}
            {action.binderNumber && ` · ${action.binderNumber}`}
          </p>
        )}
        {action.dueLabel && (
          <p className="mt-0.5 truncate text-[11px] text-warning-600 font-medium">
            {action.dueLabel}
          </p>
        )}
        {!action.dueLabel && requiresConfirmation && (
          <p className="mt-0.5 text-[11px] text-warning-600 font-medium">דורש אישור</p>
        )}
        <p className="mt-0.5 truncate text-[11px] leading-snug text-gray-400">
          {effectDescription}
        </p>
        {isLoading && (
          <p className="mt-0.5 text-[11px] font-semibold text-info-700">מבצע פעולה...</p>
        )}
      </div>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
        isLoading ? "bg-info-200" : "bg-gray-100 group-hover:bg-info-100"
      )}>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-info-600 border-t-transparent" />
        ) : (
          isReadOnly ? (
            <ArrowLeft className="h-4 w-4 text-gray-400 transition-colors group-hover:text-info-600" />
          ) : (
            <CheckSquare className="h-4 w-4 text-gray-400 transition-colors group-hover:text-info-600" />
          )
        )}
      </div>
      <div className="absolute bottom-0 right-0 h-0.5 w-0 rounded-full bg-gradient-to-l from-info-500 to-primary-500 transition-all duration-300 group-hover:w-full" />
    </>
  );

  const baseClass = cn(
    "group relative flex items-center justify-between gap-2 rounded-xl border-2 p-2.5 text-right",
    "transition-all duration-200 focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-info-500 focus-visible:ring-offset-2",
    "animate-fade-in",
    isLoading
      ? "border-info-400 bg-info-50 shadow-inner"
      : isDisabled
      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40"
      : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-info-300 hover:shadow-lg hover:shadow-info-50"
  );

  return (
    <button
      key={action.uiKey}
      type="button"
      onClick={() => onQuickAction(action)}
      disabled={isDisabled}
      className={`${baseClass} [animation-delay:var(--enter-delay)]`}
      style={staggerAnimationDelayVars(index, 50)}
      title={title}
      aria-label={`${action.label}. ${title}${requiresConfirmation ? ". דורש אישור" : ""}`}
    >
      {content}
    </button>
  );
};

export const OperationalPanel = ({
  quickActions,
  activeActionKey,
  onQuickAction,
}: OperationalPanelProps) => {
  const actions = mapActions(quickActions);
  const grouped = groupByCategory(actions);
  const totalCount = actions.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-l from-info-50/60 to-transparent px-6 py-4">
        <div className="rounded-xl bg-info-100 p-2 text-info-600">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">פעולות מהירות</h2>
          <p className="text-xs text-gray-400">
            {totalCount > 0 ? `${totalCount} פעולות זמינות לביצוע מיידי` : "אין פעולות ממתינות"}
          </p>
        </div>
      </div>

      {totalCount === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <CheckCircle className="h-10 w-10 text-positive-400" />
          <p className="text-sm font-semibold text-gray-700">הכל מטופל!</p>
          <p className="text-xs text-gray-400">אין פעולות ממתינות כרגע</p>
        </div>
      ) : (
        /* Grouped sections */
        <div className="divide-y divide-gray-50 p-5 space-y-4">
          {(() => {
            let globalIndex = 0;
            return grouped.map(([category, catActions]) => (
              <div key={category}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {CATEGORY_LABELS[category] ?? category}
                  </span>
                  <span className="rounded-full bg-info-100 px-1.5 py-0.5 text-[10px] font-semibold text-info-600">
                    {catActions.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {catActions.map((action) => {
                    const isLoading = activeActionKey === action.uiKey;
                    const isDisabled = activeActionKey !== null && !isLoading;
                    return (
                      <ActionButton
                        key={action.uiKey}
                        action={action}
                        isLoading={isLoading}
                        isDisabled={isDisabled}
                        index={globalIndex++}
                        onQuickAction={onQuickAction}
                      />
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Footer hint */}
      {totalCount > 0 && (
        <div className="flex items-start gap-2 border-t border-gray-100 bg-primary-50/40 px-5 py-3 text-xs text-primary-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>תג "פתיחת פריט" רק מנווט לפריט. תגי שינוי/עדכון מבצעים פעולה במערכת, ופעולות המסומנות "דורש אישור" יציגו חלון אישור לפני הביצוע.</span>
        </div>
      )}
    </div>
  );
};

OperationalPanel.displayName = "OperationalPanel";
