import { Card } from "../../../components/ui/Card";
import { Clock } from "lucide-react";
import type { BindersTableCardProps } from "../types";
import { BindersTableRowFancy } from "./BindersTableRowFancy";

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
            {binders.map((binder, index) => (
              <BindersTableRowFancy
                key={binder.id}
                binder={binder}
                index={index}
                activeActionKey={activeActionKey}
                onActionClick={onActionClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
