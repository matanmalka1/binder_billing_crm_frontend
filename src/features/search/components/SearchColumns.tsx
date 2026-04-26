import {
  actionsColumn,
  monoColumn,
  textColumn,
  type Column,
} from "../../../components/ui/table";
import type { SearchResult } from "../api";
import { getResultColor, getResultIcon, getResultLabel } from "./SearchResultMeta";
import { SearchRowActions } from "./SearchRowActions";
import { cn, formatBinderNumber, formatClientOfficeId } from "@/utils/utils";

export const searchColumns: Column<SearchResult>[] = [
  monoColumn({
    key: "office_client_number",
    header: "מס' לקוח",
    valueClassName: "text-xs text-gray-400",
    getValue: (result) => formatClientOfficeId(result.office_client_number),
  }),
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
  textColumn({
    key: "client",
    header: "לקוח",
    valueClassName: "font-semibold text-gray-900",
    getValue: (result) => result.client_name,
  }),
  monoColumn({
    key: "id_number",
    header: "מספר ת.ז. / ח.פ",
    valueClassName: "text-gray-700",
    emptyValue: <span className="text-gray-300">—</span>,
    getValue: (result) => result.id_number,
  }),
  monoColumn({
    key: "binder_number",
    header: "מספר קלסר",
    valueClassName: "font-semibold text-gray-800",
    emptyValue: <span className="text-gray-300">—</span>,
    getValue: (result) => result.binder_number ? formatBinderNumber(result.binder_number) : null,
  }),
  actionsColumn({
    header: "",
    render: (result) => <SearchRowActions result={result} />,
  }),
];
