import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { ActionButton } from "../../actions/components/ActionButton";
import { resolveEntityActions } from "../../actions/resolveActions";
import type { ResolvedBackendAction } from "../../actions/types";
import {
  getSignalLabel,
  getSlaStateLabel,
  getStatusLabel,
  getWorkStateLabel,
} from "../../../utils/enums";
import type { Binder } from "../types";

interface BindersTableCardProps {
  binders: Binder[];
  activeActionKey: string | null;
  onActionClick: (action: ResolvedBackendAction) => void;
}

const getStatusBadge = (status: string) => {
  const label = getStatusLabel(status);
  switch (status) {
    case "in_office":
      return <Badge variant="info">{label}</Badge>;
    case "ready_for_pickup":
      return <Badge variant="success">{label}</Badge>;
    case "returned":
      return <Badge variant="neutral">{label}</Badge>;
    case "overdue":
      return <Badge variant="error">{label}</Badge>;
    default:
      return <Badge variant="neutral">{label}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("he-IL");
};

export const BindersTableCard: React.FC<BindersTableCardProps> = ({
  binders,
  activeActionKey,
  onActionClick,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-right">
              <th className="pb-3 pr-4 font-semibold text-gray-700">מספר תיק</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סטטוס</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך קבלה</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך החזרה צפוי</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">ימים במשרד</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">מצב עבודה</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">מצב SLA</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">אותות</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {binders.map((binder) => {
              const actions = resolveEntityActions(
                binder.available_actions,
                "/binders",
                binder.id,
                `binder-${binder.id}`,
              );
              return (
                <tr key={binder.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{binder.binder_number}</td>
                  <td className="py-3 pr-4">{getStatusBadge(binder.status)}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(binder.received_at)}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(binder.expected_return_at)}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{binder.days_in_office}</td>
                  <td className="py-3 pr-4 text-gray-600">{getWorkStateLabel(binder.work_state ?? "")}</td>
                  <td className="py-3 pr-4 text-gray-600">{getSlaStateLabel(binder.sla_state ?? "")}</td>
                  <td className="py-3 pr-4">
                    {Array.isArray(binder.signals) && binder.signals.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {binder.signals.map((signal) => (
                          <Badge key={`${binder.id}-${signal}`} variant="neutral">
                            {getSignalLabel(signal)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {actions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => {
                          return (
                            <ActionButton
                              key={action.uiKey}
                              type="button"
                              variant="outline"
                              label={action.label}
                              onClick={() => onActionClick(action)}
                              isLoading={activeActionKey === action.uiKey}
                              disabled={!action.endpoint || (activeActionKey !== null && activeActionKey !== action.uiKey)}
                            />
                          );
                        })}
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
