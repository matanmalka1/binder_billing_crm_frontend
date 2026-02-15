import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { AttentionItem, DashboardOverviewResponse } from "../../../api/dashboard.api";
import type { BackendQuickAction, ActionCommand } from "../../../lib/actions/types";
import {
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
} from "../../../utils/enums";
import { AttentionPanel } from "./AttentionPanel";
import { OperationalPanel } from "./OperationalPanel";

interface DashboardContentProps {
  data: DashboardOverviewResponse;
  attentionItems: AttentionItem[];
  quickActions: BackendQuickAction[];
  activeQuickAction: string | null;
  onQuickAction: (action: ActionCommand) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  data,
  attentionItems,
  quickActions,
  activeQuickAction,
  onQuickAction,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="לקוחות">
          <div className="text-3xl font-bold text-blue-600">{data.total_clients}</div>
          <p className="mt-1 text-sm text-gray-600">סך הכל לקוחות במערכת</p>
        </Card>
        <Card title="תיקים פעילים">
          <div className="text-3xl font-bold text-green-600">{data.active_binders}</div>
          <p className="mt-1 text-sm text-gray-600">תיקים שטרם הוחזרו</p>
        </Card>
        <Card title="תיקים באיחור">
          <div className="text-3xl font-bold text-red-600">{data.overdue_binders}</div>
          <p className="mt-1 text-sm text-gray-600">חרגו מ-90 יום</p>
        </Card>
        <Card title="תיקים ליום זה">
          <div className="text-3xl font-bold text-orange-600">{data.binders_due_today}</div>
          <p className="mt-1 text-sm text-gray-600">מועד החזרה היום</p>
        </Card>
        <Card title="תיקים לשבוע זה">
          <div className="text-3xl font-bold text-purple-600">
            {data.binders_due_this_week}
          </div>
          <p className="mt-1 text-sm text-gray-600">מועד החזרה תוך 7 ימים</p>
        </Card>
      </div>

      <AttentionPanel items={attentionItems} />

      <Card title="מצב תפעולי">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">מצב עבודה</p>
            <p className="text-sm font-medium text-gray-900">
              {getWorkStateLabel(data.work_state ?? "")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">מצב SLA</p>
            <p className="text-sm font-medium text-gray-900">
              {getSlaStateLabel(data.sla_state ?? "")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">אותות</p>
            {Array.isArray(data.signals) && data.signals.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {data.signals.map((signal) => (
                  <Badge key={`dashboard-${signal}`} variant="neutral">
                    {getSignalLabel(signal)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-900">—</p>
            )}
          </div>
        </div>
      </Card>

      <OperationalPanel
        quickActions={quickActions}
        activeActionKey={activeQuickAction}
        onQuickAction={onQuickAction}
      />
    </div>
  );
};
