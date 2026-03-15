import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ClientResponse } from "../../../api/clients.api";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { ClientRowActions } from "./ClientRowActions";

const clientStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  frozen: "warning",
  closed: "neutral",
};

export const buildClientColumns = (): Column<ClientResponse>[] => [
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
    key: "client_type",
    header: "סוג",
    render: (client) => (
      <span className="text-sm text-gray-600">{getClientTypeLabel(client.client_type)}</span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (client) => (
      <StatusBadge
        status={client.status}
        getLabel={getClientStatusLabel}
        variantMap={clientStatusVariants}
      />
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
    key: "opened_at",
    header: "תאריך פתיחה",
    render: (client) => (
      <span className="text-sm text-gray-500 tabular-nums">{formatDate(client.opened_at)}</span>
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
