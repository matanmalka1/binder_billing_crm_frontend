import type { Column } from "../../../components/ui/table/DataTable";
import type { SearchResult } from "../api";
import { getResultColor, getResultIcon, getResultLabel } from "./SearchResultMeta";
import { SearchRowActions } from "./SearchRowActions";
import { cn, formatBinderNumber, formatClientOfficeId } from "@/utils/utils";

export const searchColumns: Column<SearchResult>[] = [
  {
    key: "office_client_number",
    header: "מס' לקוח",
    render: (result) => (
      <span className="font-mono text-xs text-gray-400">{formatClientOfficeId(result.office_client_number)}</span>
    ),
  },
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
      <p className="text-sm font-semibold text-gray-900">{result.client_name ?? "—"}</p>
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
        <span className="font-mono text-sm font-semibold text-gray-800">{formatBinderNumber(result.binder_number)}</span>
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
