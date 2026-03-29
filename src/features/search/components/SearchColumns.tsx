import { Badge } from "../../../components/ui/primitives/Badge";
import type { Column } from "../../../components/ui/table/DataTable";
import type { SearchResult } from "../api";
import { cn } from "../../../utils/utils";
import { getSignalLabel, getWorkStateLabel } from "../../../utils/enums";
import { getResultColor, getResultIcon, getResultLabel } from "./SearchResultMeta";
import { SearchRowActions } from "./SearchRowActions";

type BadgeVariant = "error" | "warning" | "info" | "neutral";

const SIGNAL_VARIANTS: Record<string, BadgeVariant> = {
  missing_permanent_documents: "warning",
  unpaid_charges: "warning",
  ready_for_pickup: "info",
  idle_binder: "neutral",
};

const WORK_STATE_STYLES: Record<string, string> = {
  waiting_for_work: "text-gray-500",
  in_progress: "text-primary-700",
  completed: "text-green-700",
};

export const searchColumns: Column<SearchResult>[] = [
  {
    key: "type",
    header: "סוג",
    headerClassName: "w-28",
    render: (result) => (
      <div className="flex items-center gap-2">
        <div className={cn("rounded-lg p-1.5", getResultColor(result.result_type))}>
          {getResultIcon(result.result_type)}
        </div>
        <span className="text-xs font-medium text-gray-600">{getResultLabel(result.result_type)}</span>
      </div>
    ),
  },
  {
    key: "client",
    header: "לקוח",
    render: (result) => (
      <div>
        <p className="text-sm font-semibold text-gray-900">{result.client_name ?? "—"}</p>
        <p className="font-mono text-xs text-gray-400">#{result.client_id}</p>
      </div>
    ),
  },
  {
    key: "id_number",
    header: "מספר ת.ז. / ח.פ",
    render: (result) =>
      result.id_number ? (
        <span className="font-mono text-sm text-gray-700">{result.id_number}</span>
      ) : (
        <span className="text-sm text-gray-300">—</span>
      ),
  },
  {
    key: "binder_number",
    header: "מספר קלסר",
    render: (result) =>
      result.binder_number ? (
        <span className="font-mono text-sm font-semibold text-gray-800">{result.binder_number}</span>
      ) : (
        <span className="text-sm text-gray-300">—</span>
      ),
  },
  {
    key: "work_state",
    header: "מצב עבודה",
    render: (result) => (
      <span className={cn("text-sm", WORK_STATE_STYLES[result.work_state ?? ""] ?? "text-gray-500")}>
        {getWorkStateLabel(result.work_state ?? "")}
      </span>
    ),
  },
  {
    key: "signals",
    header: "אותות",
    render: (result) =>
      Array.isArray(result.signals) && result.signals.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {result.signals.map((signal) => (
            <Badge key={signal} variant={SIGNAL_VARIANTS[signal] ?? "neutral"} className="text-xs">
              {getSignalLabel(signal)}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-sm text-gray-300">—</span>
      ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    render: (result) => <SearchRowActions result={result} />,
  },
];
