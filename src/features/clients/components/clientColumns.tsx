import { type RefObject } from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Column } from "../../../components/ui/DataTable";
import type { ClientResponse } from "../../../api/clients.api";
import { buildActionsColumn } from "../../../components/ui/columnHelpers";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";

const clientStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  frozen: "warning",
  closed: "neutral",
};

interface BuildClientColumnsParams {
  activeActionKeyRef: RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

export const buildClientColumns = ({
  activeActionKeyRef,
  onAction,
}: BuildClientColumnsParams): Column<ClientResponse>[] => [
  {
    key: "full_name",
    header: "שם",
    render: (client) => (
      <span className="font-medium text-gray-900">{client.full_name}</span>
    ),
  },
  {
    key: "id_number",
    header: "ת.ז / ח.פ",
    render: (client) => (
      <span className="font-mono text-sm text-gray-600">{client.id_number}</span>
    ),
  },
  {
    key: "client_type",
    header: "סוג",
    render: (client) => (
      <span className="text-gray-600">{getClientTypeLabel(client.client_type)}</span>
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
      <span className="font-mono text-sm text-gray-600">{client.phone || "—"}</span>
    ),
  },
  {
    key: "opened_at",
    header: "תאריך פתיחה",
    render: (client) => (
      <span className="text-gray-600">{formatDate(client.opened_at)}</span>
    ),
  },
  {
    key: "timeline",
    header: "ציר זמן",
    render: (client) => (
      <Link
        to={`/clients/${client.id}/timeline`}
        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        צפייה
      </Link>
    ),
  },
  buildActionsColumn<ClientResponse>({
    header: "פעולות",
    activeActionKeyRef,
    onAction,
    getActions: (client) => client.available_actions as BackendAction[] | null | undefined,
  }),
  ];
