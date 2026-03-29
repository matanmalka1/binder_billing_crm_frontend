import type { Column } from "../../../components/ui/table/DataTable";
import { buildSelectionColumn } from "../../../components/ui/table/tableSelection";
import type { ClientResponse } from "../api";
import { formatDate } from "../../../utils/utils";
import { ClientRowActions } from "./ClientRowActions";

interface BuildClientColumnsParams {
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  onToggleAll?: (ids: number[]) => void;
  allIds?: number[];
  onEditClient?: (client: ClientResponse) => void;
}

export const buildClientColumns = ({
  selectedIds,
  onToggleSelect,
  onToggleAll,
  allIds = [],
  onEditClient,
}: BuildClientColumnsParams = {}): Column<ClientResponse>[] => {
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
      key: "email",
      header: "אימייל",
      render: (client) => <span className="text-sm text-gray-500">{client.email || "—"}</span>,
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
      render: (client) => (
        <ClientRowActions
          clientId={client.id}
          onEditClient={onEditClient ? () => onEditClient(client) : undefined}
        />
      ),
    },
  ];

  if (!onToggleSelect) {
    return dataColumns;
  }

  return [
    buildSelectionColumn<ClientResponse>({
      allIds,
      selectedIds,
      onToggleSelect,
      onToggleAll,
      getId: (client) => client.id,
      getItemAriaLabel: (client) => `בחר לקוח ${client.id}`,
    }),
    ...dataColumns,
  ];
};
