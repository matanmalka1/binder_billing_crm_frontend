import React from "react";
import { Card } from "../../../components/ui/Card";
import type { ResolvedBackendAction } from "../../../lib/actions/types";
import type { Binder } from "../types";
import { BindersTableRow } from "./BindersTableRow";

interface BindersTableCardProps {
  binders: Binder[];
  activeActionKey: string | null;
  onActionClick: (action: ResolvedBackendAction) => void;
}

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
            {binders.map((binder) => (
              <BindersTableRow
                key={binder.id}
                binder={binder}
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
