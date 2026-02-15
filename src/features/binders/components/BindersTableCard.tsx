import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ChevronLeft, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import { getStatusBadge } from "./bindersTable.utils";
import type { BindersTableCardProps } from "../types";
import { cn } from "../../../utils/utils";

export const BindersTableCard: React.FC<BindersTableCardProps> = ({
  binders,
  activeActionKey,
  onActionClick,
}) => {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enhanced Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr className="text-right border-b-2 border-gray-200">
              <th className="pb-4 pr-6 pt-4 text-sm font-semibold text-gray-700">
                מספר תיק
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סטטוס
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-500" />
                  קבלה
                </div>
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-500" />
                  החזרה צפויה
                </div>
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                ימים במשרד
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מצב עבודה
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                מצב SLA
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                אותות
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                פעולות
              </th>
            </tr>
          </thead>

          {/* Enhanced Body */}
          <tbody className="divide-y divide-gray-100">
            {binders.map((binder, index) => {
              const actions = mapActions(binder.available_actions, { 
                scopeKey: `binder-${binder.id}` 
              });

              return (
                <tr 
                  key={binder.id} 
                  className={cn(
                    "group transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Binder Number */}
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {binder.binder_number}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    {getStatusBadge(binder.status)}
                  </td>

                  {/* Received Date */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(binder.received_at)}
                    </span>
                  </td>

                  {/* Expected Return */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(binder.expected_return_at)}
                    </span>
                  </td>

                  {/* Days in Office - with visual indicator */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {binder.days_in_office}
                      </span>
                      {(binder.days_in_office ?? 0) > 60 && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      {(binder.days_in_office ?? 0) <= 30 && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </td>

                  {/* Work State */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {getWorkStateLabel(binder.work_state ?? "")}
                    </span>
                  </td>

                  {/* SLA State */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {getSlaStateLabel(binder.sla_state ?? "")}
                    </span>
                  </td>

                  {/* Signals - enhanced badges */}
                  <td className="py-4 pr-4">
                    {Array.isArray(binder.signals) && binder.signals.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {binder.signals.map((signal) => (
                          <Badge 
                            key={`${binder.id}-${signal}`} 
                            variant="neutral"
                            className="text-xs"
                          >
                            {getSignalLabel(signal)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions - enhanced buttons */}
                  <td className="py-4 pr-4">
                    {actions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => (
                          <Button
                            key={action.uiKey}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onActionClick(action)}
                            isLoading={activeActionKey === action.uiKey}
                            disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
                            rightIcon={<ChevronLeft className="h-3 w-3" />}
                          >
                            {action.label || "—"}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
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