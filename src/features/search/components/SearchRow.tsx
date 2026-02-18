import { Badge } from "../../../components/ui/Badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { SearchResult } from "../../../api/search.api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import { getResultColor, getResultIcon, getResultLabel } from "./searchResultMeta";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";

interface SearchRowProps {
  result: SearchResult;
  index: number;
}

type BadgeVariant = "error" | "warning" | "info" | "neutral";

const signalVariants: Record<string, BadgeVariant> = {
  overdue:                     "error",
  near_sla:                    "warning",
  missing_permanent_documents: "warning",
  unpaid_charges:              "warning",
  ready_for_pickup:            "info",
  idle_binder:                 "neutral",
};

const slaStateStyles: Record<string, string> = {
  on_track:   "text-green-700",
  approaching: "text-orange-600 font-semibold",
  overdue:    "text-red-600 font-semibold",
};

const workStateStyles: Record<string, string> = {
  waiting_for_work: "text-gray-500",
  in_progress:      "text-blue-700",
  completed:        "text-green-700",
};

export const SearchRow: React.FC<SearchRowProps> = ({ result, index }) => {
  const resultKey = `${result.result_type}-${result.client_id}-${result.binder_id}-${index}`;
  const isClient = result.result_type === "client";
  const isBinder = result.result_type === "binder";
  const detailUrl =
    isBinder && result.binder_id
      ? `/binders/${result.binder_id}`
      : isClient
        ? `/clients/${result.client_id}/timeline`
        : null;

  return (
    <tr
      key={resultKey}
      className={cn(
        "group transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
        "animate-fade-in",
      )}
      style={{ animationDelay: staggerDelay(index) }}
    >
      {/* Type */}
      <td className="py-3.5 pr-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className={cn("rounded-lg p-1.5", getResultColor(result.result_type))}>
            {getResultIcon(result.result_type)}
          </div>
          <span className="text-xs font-medium text-gray-600">
            {getResultLabel(result.result_type)}
          </span>
        </div>
      </td>

      {/* Client */}
      <td className="py-3.5 pr-4">
        <p className="text-sm font-semibold text-gray-900">{result.client_name ?? "—"}</p>
        <p className="font-mono text-xs text-gray-400">#{result.client_id}</p>
      </td>

      {/* Binder number */}
      <td className="py-3.5 pr-4">
        {result.binder_number ? (
          <span className="font-mono text-sm font-semibold text-gray-800">{result.binder_number}</span>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>

      {/* Work state */}
      <td className="py-3.5 pr-4">
        <span className={cn("text-sm", workStateStyles[result.work_state ?? ""] ?? "text-gray-500")}>
          {getWorkStateLabel(result.work_state ?? "")}
        </span>
      </td>

      {/* SLA state */}
      <td className="py-3.5 pr-4">
        <span className={cn("text-sm", slaStateStyles[result.sla_state ?? ""] ?? "text-gray-500")}>
          {getSlaStateLabel(result.sla_state ?? "")}
        </span>
      </td>

      {/* Signals */}
      <td className="py-3.5 pr-4">
        {Array.isArray(result.signals) && result.signals.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {result.signals.map((signal) => (
              <Badge
                key={`${index}-${signal}`}
                variant={signalVariants[signal] ?? "neutral"}
                className="text-xs"
              >
                {getSignalLabel(signal)}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>

      {/* Action */}
      <td className="py-3.5 pr-4">
        {detailUrl ? (
          <Link
            to={detailUrl}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg",
              "border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium",
              "text-gray-600 shadow-sm transition-all duration-200",
              "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-800 hover:shadow-md",
            )}
          >
            <ExternalLink className="h-3 w-3" />
            פירוט
          </Link>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>
    </tr>
  );
};
