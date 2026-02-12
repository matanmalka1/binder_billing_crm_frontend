import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { formatDateTime } from "../../../utils/datetime";
import { getChargeAmountText } from "../utils/chargeAmount";
import { canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import type { ChargeResponse } from "../../../api/charges.api";

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
  <Card>
    {charges.length === 0 ? (
      <p className="py-8 text-center text-gray-500">אין חיובים להצגה</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-right">
              <th className="pb-3 pr-4 font-semibold text-gray-700">מזהה</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">לקוח</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סוג</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סטטוס</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">סכום</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">נוצר</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {charges.map((charge) => {
              const loadingAction = actionLoadingId === charge.id;
              return (
                <tr key={charge.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">#{charge.id}</td>
                  <td className="py-3 pr-4 text-gray-700">{charge.client_id}</td>
                  <td className="py-3 pr-4 text-gray-700">{charge.charge_type}</td>
                  <td className="py-3 pr-4 text-gray-700">{charge.status}</td>
                  <td className="py-3 pr-4 text-gray-700">{getChargeAmountText(charge)}</td>
                  <td className="py-3 pr-4 text-gray-700">{formatDateTime(charge.created_at)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Link className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50" to={`/charges/${charge.id}`}>פירוט</Link>
                      {isAdvisor && canIssue(charge.status) && (
                        <Button type="button" variant="outline" isLoading={loadingAction} disabled={loadingAction} onClick={() => onRunAction(charge.id, "issue")}>הנפקה</Button>
                      )}
                      {isAdvisor && canMarkPaid(charge.status) && (
                        <Button type="button" variant="outline" isLoading={loadingAction} disabled={loadingAction} onClick={() => onRunAction(charge.id, "markPaid")}>סימון שולם</Button>
                      )}
                      {isAdvisor && canCancel(charge.status) && (
                        <Button type="button" variant="outline" isLoading={loadingAction} disabled={loadingAction} onClick={() => onRunAction(charge.id, "cancel")}>ביטול</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);
