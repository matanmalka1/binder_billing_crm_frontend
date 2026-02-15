import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { Column } from "../../../components/ui/DataTable";
import type { ClientResponse } from "../../../api/clients.api";
import { mapActions } from "../../../lib/actions/mapActions";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import type { ActionCommand } from "../../../lib/actions/types";

const getStatusBadge = (status: string) => {
  const variantMap = {
    active: "success" as const,
    frozen: "warning" as const,
    closed: "neutral" as const,
  };
  const variant = variantMap[status as keyof typeof variantMap] ?? "neutral";
  return <Badge variant={variant}>{getClientStatusLabel(status)}</Badge>;
};

interface BuildClientColumnsParams {
  activeActionKey: string | null;
  handleActionClick: (action: ActionCommand) => void;
}

export const buildClientColumns = ({
  activeActionKey,
  handleActionClick,
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
    render: (client) => getStatusBadge(client.status),
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
  {
    key: "actions",
    header: "פעולות",
    render: (client) => {
      const actions = mapActions(client.available_actions, {
        scopeKey: `client-${client.id}`,
      });

      if (actions.length === 0) {
        return <span className="text-gray-500">—</span>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {actions.map((action: ActionCommand) => (
            <Button
              key={action.uiKey}
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(action);
              }}
              isLoading={activeActionKey === action.uiKey}
              disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
            >
              {action.label || "—"}
            </Button>
          ))}
        </div>
      );
    },
  },
];
