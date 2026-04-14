import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/primitives/Button";
import { clientsApi, clientsQK } from "../api";
import { BUSINESS_STATUS_LABELS, getBusinessTypeLabel } from "../constants";
import { CLIENT_ROUTES } from "../api/endpoints";
import { formatDate } from "@/utils/utils";

const STATUS_BADGE = {
  active: { label: BUSINESS_STATUS_LABELS.active, className: "bg-positive-100 text-positive-800" },
  frozen: { label: BUSINESS_STATUS_LABELS.frozen, className: "bg-warning-100 text-warning-800" },
  closed: { label: BUSINESS_STATUS_LABELS.closed, className: "bg-gray-100 text-gray-600" },
};

interface Props {
  clientId: number;
  canEdit: boolean;
  onAddBusiness: () => void;
}

export const ClientBusinessesCard: React.FC<Props> = ({ clientId, canEdit, onAddBusiness }) => {
  const { data, isLoading } = useQuery({
    queryKey: clientsQK.businessesAll(clientId),
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId),
    enabled: clientId > 0,
  });

  const businesses = data?.items ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">עסקים</h3>
        {canEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAddBusiness}
            className="text-xs text-primary-600 hover:bg-primary-50 px-2 py-1"
          >
            <Plus className="h-3.5 w-3.5" />
            הוסף עסק
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-xs text-gray-400">טוען...</p>
      ) : businesses.length === 0 ? (
        <p className="text-xs text-gray-400">אין עסקים רשומים</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {businesses.map((biz) => {
            const badge = STATUS_BADGE[biz.status];
            return (
              <li key={biz.id}>
                <Link
                  to={CLIENT_ROUTES.businessDetail(clientId, biz.id)}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-1 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {getBusinessTypeLabel(biz.business_type)}
                      {biz.business_name ? ` ${biz.business_name}` : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      נפתח בתאריך {formatDate(biz.opened_at)}
                    </p>
                  </div>
                  <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
