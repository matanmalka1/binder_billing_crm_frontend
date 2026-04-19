import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/primitives/Button";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import { clientsApi, clientsQK } from "../api";
import { BUSINESS_STATUS_LABELS } from "../constants";
import { CLIENT_ROUTES } from "../api/endpoints";
import { formatDate } from "@/utils/utils";

const BUSINESS_STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  frozen: "warning",
  closed: "neutral",
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
          {businesses.map((biz) => (
            <li key={biz.id}>
              <Link
                to={CLIENT_ROUTES.businessDetail(clientId, biz.id)}
                className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-1 transition-colors"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {biz.business_name ?? "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    נפתח בתאריך {formatDate(biz.opened_at)}
                  </p>
                </div>
                <StatusBadge
                  status={biz.status}
                  getLabel={(s) => BUSINESS_STATUS_LABELS[s as keyof typeof BUSINESS_STATUS_LABELS] ?? s}
                  variantMap={BUSINESS_STATUS_VARIANTS}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
