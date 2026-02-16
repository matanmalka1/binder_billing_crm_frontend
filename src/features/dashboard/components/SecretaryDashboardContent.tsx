import { Card } from "../../../components/ui/Card";
import type { AttentionItem, DashboardSummaryResponse } from "../../../api/dashboard.api";
import { AttentionPanel } from "./AttentionPanel";

interface SecretaryDashboardContentProps {
  data: DashboardSummaryResponse;
  attentionItems: AttentionItem[];
}

export const SecretaryDashboardContent: React.FC<SecretaryDashboardContentProps> = ({
  data,
  attentionItems,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="קלסרים במשרד">
          <div className="text-3xl font-bold text-blue-600">{data.binders_in_office}</div>
          <p className="mt-1 text-sm text-gray-600">כלל הקלסרים הפעילים במשרד</p>
        </Card>
        <Card title="מוכן לאיסוף">
          <div className="text-3xl font-bold text-green-600">
            {data.binders_ready_for_pickup}
          </div>
          <p className="mt-1 text-sm text-gray-600">קלסרים הממתינים לאיסוף לקוח</p>
        </Card>
        <Card title="קלסרים באיחור">
          <div className="text-3xl font-bold text-red-600">{data.binders_overdue}</div>
          <p className="mt-1 text-sm text-gray-600">קלסרים בחריגה ממועד החזרה</p>
        </Card>
      </div>

      <AttentionPanel items={attentionItems} />
    </div>
  );
};
