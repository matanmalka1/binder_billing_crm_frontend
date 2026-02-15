import { Card } from "../../../components/ui/Card";
import type { ChargeResponse } from "../../../api/charges.api";
import { ChargeRow } from "./ChargeRow";
import { DollarSign, Calendar } from "lucide-react";

export interface ChargesFilters {
  client_id: string;
  status: string;
  page: number;
  page_size: number;
}

interface ChargesTableCardProps {
  actionLoadingId: number | null;
  charges: ChargeResponse[];
  isAdvisor: boolean;
  onRunAction: (chargeId: number, action: "issue" | "markPaid" | "cancel") => Promise<void>;
}

export const ChargesTableCard: React.FC<ChargesTableCardProps> = ({
  actionLoadingId,
  charges,
  isAdvisor,
  onRunAction,
}) => (
  <Card variant="elevated" className="overflow-hidden">
    {charges.length === 0 ? (
      <p className="py-8 text-center text-gray-500">אין חיובים להצגה</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enhanced Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
            <tr className="text-right border-b-2 border-gray-200">
              <th className="pb-4 pr-6 pt-4 text-sm font-semibold text-gray-700">
                מזהה
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                לקוח
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סוג חיוב
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                סטטוס
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  סכום
                </div>
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  נוצר
                </div>
              </th>
              <th className="pb-4 pr-4 pt-4 text-sm font-semibold text-gray-700">
                פעולות
              </th>
            </tr>
          </thead>

          {/* Enhanced Body */}
          <tbody className="divide-y divide-gray-100">
            {charges.map((charge, index) => (
              <ChargeRow
                key={charge.id}
                charge={charge}
                index={index}
                actionLoadingId={actionLoadingId}
                isAdvisor={isAdvisor}
                onRunAction={onRunAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);
