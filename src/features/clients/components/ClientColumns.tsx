import type { Column } from "../../../components/ui/DataTable";
import type { ClientResponse } from "../api";
import { formatDate } from "../../../utils/utils";
import { ClientRowActions } from "./ClientRowActions";

interface BuildClientColumnsParams {
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  onToggleAll?: (ids: number[]) => void;
  allIds?: number[];
}

export const buildClientColumns = ({
  selectedIds,
  onToggleSelect,
  onToggleAll,
  allIds = [],
}: BuildClientColumnsParams = {}): Column<ClientResponse>[] => {
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds?.has(id));
  const someSelected = !allSelected && allIds.some((id) => selectedIds?.has(id));

  const dataColumns: Column<ClientResponse>[] = [
    {
      key: "full_name",
      header: "שם",
      render: (client) => (
        <span className="text-sm font-semibold text-gray-900">{client.full_name}</span>
      ),
    },
    {
      key: "id_number",
      header: "ת.ז / ח.פ",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">{client.id_number}</span>
      ),
    },
    {
      key: "phone",
      header: "טלפון",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">{client.phone || "—"}</span>
      ),
    },
    {
      key: "created_at",
      header: "נוצר בתאריך",
      render: (client) => (
        <span className="text-sm text-gray-500 tabular-nums">{formatDate(client.created_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (client) => <ClientRowActions clientId={client.id} />,
    },
  ];

  if (!onToggleSelect) return dataColumns;

  const checkboxColumn: Column<ClientResponse> = {
    key: "select",
    header: "",
    headerClassName: "w-10",
    className: "w-10",
    headerRender: () => (
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => { if (el) el.indeterminate = someSelected; }}
        onChange={() => onToggleAll?.(allIds)}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        aria-label="בחר הכל"
      />
    ),
    render: (client) => (
      <input
        type="checkbox"
        checked={selectedIds?.has(client.id) ?? false}
        onChange={() => onToggleSelect(client.id)}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        aria-label={`בחר לקוח ${client.id}`}
      />
    ),
  };

  return [checkboxColumn, ...dataColumns];
};
