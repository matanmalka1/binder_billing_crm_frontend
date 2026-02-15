import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { ActionButton } from "../../actions/components/ActionButton";
import { resolveEntityActions } from "../../../lib/actions";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import type { ClientsTableCardProps } from "../types";

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("he-IL");

const getStatusBadge = (status: string) => {
  const label = getClientStatusLabel(status);
  switch (status) {
    case "active":
      return <Badge variant="success">{label}</Badge>;
    case "frozen":
      return <Badge variant="warning">{label}</Badge>;
    case "closed":
      return <Badge variant="neutral">{label}</Badge>;
    default:
      return <Badge variant="neutral">{label}</Badge>;
  }
};

export const ClientsTableCard: React.FC<ClientsTableCardProps> = ({
  clients,
  activeActionKey,
  onActionClick,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-right">
              <th className="pb-3 pr-4 font-semibold text-gray-700">שם</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">ת.ז / ח.פ</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סוג</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סטטוס</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">טלפון</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך פתיחה</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">ציר זמן</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => {
              const actions = resolveEntityActions(
                client.available_actions,
                "/clients",
                client.id,
                `client-${client.id}`,
              );
              return (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{client.full_name}</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-600">{client.id_number}</td>
                  <td className="py-3 pr-4 text-gray-600">{getClientTypeLabel(client.client_type)}</td>
                  <td className="py-3 pr-4">{getStatusBadge(client.status)}</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-600">{client.phone || "—"}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(client.opened_at)}</td>
                  <td className="py-3 pr-4">
                    <Link
                      to={`/clients/${client.id}/timeline`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      צפייה
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    {actions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => (
                          <ActionButton
                            key={action.uiKey}
                            type="button"
                            variant="outline"
                            label={action.label}
                            onClick={() => onActionClick(action)}
                            isLoading={activeActionKey === action.uiKey}
                            disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
