import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { ExternalLink, DollarSign, Calendar, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "../../../utils/utils";
import { getChargeAmountText } from "../utils/chargeStatus";
import { canCancel, canIssue, canMarkPaid } from "../utils/chargeStatus";
import type { ChargeResponse } from "../../../api/charges.api";
import { cn } from "../../../utils/utils";

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

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "success" | "warning" | "error" | "info" | "neutral"; icon?: React.ReactNode }> = {
    draft: { variant: "neutral", icon: <Calendar className="h-3 w-3" /> },
    issued: { variant: "info", icon: <DollarSign className="h-3 w-3" /> },
    paid: { variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
    canceled: { variant: "error", icon: <XCircle className="h-3 w-3" /> },
  };

  const config = variants[status] || { variant: "neutral" as const };

  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      {config.icon}
      {status}
    </Badge>
  );
};

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
            {charges.map((charge, index) => {
              const loadingAction = actionLoadingId === charge.id;
              
              return (
                <tr 
                  key={charge.id} 
                  className={cn(
                    "group transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-transparent",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Charge ID */}
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-1 rounded-full bg-gradient-to-b from-accent-400 to-accent-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        #{charge.id}
                      </span>
                    </div>
                  </td>

                  {/* Client ID */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      לקוח #{charge.client_id}
                    </span>
                  </td>

                  {/* Charge Type */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {charge.charge_type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    {getStatusBadge(charge.status)}
                  </td>

                  {/* Amount */}
                  <td className="py-4 pr-4">
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {getChargeAmountText(charge)}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-600">
                      {formatDateTime(charge.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Details Link */}
                      <Link 
                        to={`/charges/${charge.id}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg",
                          "border border-gray-300 px-3 py-1.5 text-sm",
                          "text-gray-700 transition-all duration-200",
                          "hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900",
                          "hover:shadow-sm hover:-translate-y-0.5"
                        )}
                      >
                        פירוט
                        <ExternalLink className="h-3 w-3" />
                      </Link>

                      {/* Action Buttons (Advisor Only) */}
                      {isAdvisor && canIssue(charge.status) && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          isLoading={loadingAction} 
                          disabled={loadingAction} 
                          onClick={() => onRunAction(charge.id, "issue")}
                        >
                          הנפקה
                        </Button>
                      )}
                      {isAdvisor && canMarkPaid(charge.status) && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          isLoading={loadingAction} 
                          disabled={loadingAction} 
                          onClick={() => onRunAction(charge.id, "markPaid")}
                        >
                          סימון שולם
                        </Button>
                      )}
                      {isAdvisor && canCancel(charge.status) && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          isLoading={loadingAction} 
                          disabled={loadingAction} 
                          onClick={() => onRunAction(charge.id, "cancel")}
                        >
                          ביטול
                        </Button>
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