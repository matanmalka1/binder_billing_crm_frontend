import type { KeyboardEventHandler } from "react";
import { Badge } from "../../../components/ui/Badge";
import { ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SearchResult } from "../../../api/search.api";
import { toQueryParams } from "../../../api/queryParams";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import { getResultColor, getResultIcon, getResultLabel } from "./searchResultMeta";
import { getSignalLabel, getWorkStateLabel } from "../../../utils/enums";

interface SearchRowProps {
  result: SearchResult;
  index: number;
}

type BadgeVariant = "error" | "warning" | "info" | "neutral";

const SIGNAL_VARIANTS: Record<string, BadgeVariant> = {
  missing_permanent_documents: "warning",
  unpaid_charges:              "warning",
  ready_for_pickup:            "info",
  idle_binder:                 "neutral",
};

const WORK_STATE_STYLES: Record<string, string> = {
  waiting_for_work: "text-gray-500",
  in_progress:      "text-blue-700",
  completed:        "text-green-700",
};

const buildDetailUrl = (result: SearchResult): string | null => {
  if (result.result_type === "client") return `/clients/${result.client_id}`;
  if (result.result_type === "binder" && result.binder_id) {
    const params = toQueryParams({ binder_id: result.binder_id, client_id: result.client_id });
    return `/binders?${params.toString()}`;
  }
  return null;
};

export const SearchRow: React.FC<SearchRowProps> = ({ result, index }) => {
  const navigate = useNavigate();
  const detailUrl = buildDetailUrl(result);

  const handleRowClick = () => {
    if (detailUrl) navigate(detailUrl);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTableRowElement> = (event) => {
    if ((event.key === "Enter" || event.key === " ") && detailUrl) {
      event.preventDefault();
      navigate(detailUrl);
    }
  };

  return (
    <tr
      className={cn(
        "group transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
        "animate-fade-in",
        detailUrl && "cursor-pointer",
      )}
      onClick={detailUrl ? handleRowClick : undefined}
      onKeyDown={detailUrl ? handleKeyDown : undefined}
      tabIndex={detailUrl ? 0 : -1}
      style={{ animationDelay: staggerDelay(index) }}
    >
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

      <td className="py-3.5 pr-4">
        <p className="text-sm font-semibold text-gray-900">{result.client_name ?? "—"}</p>
        <p className="font-mono text-xs text-gray-400">#{result.client_id}</p>
      </td>

      <td className="py-3.5 pr-4">
        {result.binder_number ? (
          <span className="font-mono text-sm font-semibold text-gray-800">{result.binder_number}</span>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>

      <td className="py-3.5 pr-4">
        <span className={cn("text-sm", WORK_STATE_STYLES[result.work_state ?? ""] ?? "text-gray-500")}>
          {getWorkStateLabel(result.work_state ?? "")}
        </span>
      </td>

      <td className="py-3.5 pr-4">
        {Array.isArray(result.signals) && result.signals.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {result.signals.map((signal) => (
              <Badge
                key={`${index}-${signal}`}
                variant={SIGNAL_VARIANTS[signal] ?? "neutral"}
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