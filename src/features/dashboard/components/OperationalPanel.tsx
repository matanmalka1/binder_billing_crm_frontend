import { CheckCircle, Info, Zap, ArrowLeft } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { BackendAction, ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";

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

function groupByCategory(actions: ActionCommand[]): [string, ActionCommand[]][] {
  const map = new Map<string, ActionCommand[]>();
  for (const action of actions) {
    const cat = action.category ?? "clients";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(action);
  }
  return CATEGORY_ORDER
    .filter((cat) => map.has(cat))
    .map((cat) => [cat, map.get(cat)!]);
}

interface ActionButtonProps {
  action: ActionCommand;
  isLoading: boolean;
  isDisabled: boolean;
  index: number;
  onQuickAction: (action: ActionCommand) => void;
}

const ActionButton = ({ action, isLoading, isDisabled, index, onQuickAction }: ActionButtonProps) => {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "truncate text-sm font-semibold transition-colors",
          isLoading ? "text-violet-700" : "text-gray-800 group-hover:text-violet-700"
        )}>
          {action.label || "—"}
        </p>
        {action.clientName && (
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {action.clientName}
            {action.binderNumber && ` · ${action.binderNumber}`}
          </p>
        )}
        {action.dueLabel && (
          <p className="mt-0.5 truncate text-xs text-amber-600 font-medium">
            {action.dueLabel}
          </p>
        )}
        {!action.dueLabel && action.confirm && (
          <p className="mt-0.5 text-xs text-amber-600 font-medium">דורש אישור</p>
        )}
      </div>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
        isLoading ? "bg-violet-200" : "bg-gray-100 group-hover:bg-violet-100"
      )}>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        ) : (
          <ArrowLeft className={cn("h-4 w-4 transition-colors", "text-gray-400 group-hover:text-violet-600")} />
        )}
      </div>
      <div className="absolute bottom-0 right-0 h-0.5 w-0 rounded-full bg-gradient-to-l from-violet-500 to-primary-500 transition-all duration-300 group-hover:w-full" />
    </>
  );

  const baseClass = cn(
    "group relative flex items-center justify-between gap-3 rounded-xl border-2 p-4 text-right",
    "transition-all duration-200 focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
    "animate-fade-in",
    isLoading
      ? "border-violet-400 bg-violet-50 shadow-inner"
      : isDisabled
      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-40"
      : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-50"
  );

  return (
    <button
      key={action.uiKey}
      type="button"
      onClick={() => onQuickAction(action)}
      disabled={isDisabled}
      className={baseClass}
      style={{ animationDelay: staggerDelay(index, 50) }}
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
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-l from-violet-50/60 to-transparent px-6 py-4">
        <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
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
          <CheckCircle className="h-10 w-10 text-green-400" />
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
                  <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                    {catActions.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <span>פעולות המסומנות "דורש אישור" יציגו חלון אישור לפני הביצוע</span>
        </div>
      )}
    </div>
  );
};

OperationalPanel.displayName = "OperationalPanel";
