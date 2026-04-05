import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { clientsApi, clientsQK } from "../api";
import { formatDate } from "../../../utils/utils";
import type { BusinessStatus } from "../api/contracts";

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company: 'חברה בע"מ',
  employee: "שכיר",
};

const STATUS_BADGE: Record<BusinessStatus, { label: string; className: string }> = {
  active: { label: "פעיל", className: "bg-green-100 text-green-800" },
  frozen: { label: "מוקפא", className: "bg-yellow-100 text-yellow-800" },
  closed: { label: "סגור", className: "bg-gray-100 text-gray-600" },
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
  });

  const businesses = data?.items ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">עסקים</h3>
        {canEdit && (
          <button
            type="button"
            onClick={onAddBusiness}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            הוסף עסק
          </button>
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
                  to={`/clients/${clientId}/businesses/${biz.id}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-1 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {BUSINESS_TYPE_LABELS[biz.business_type] ?? biz.business_type}
                      {biz.business_name ? ` — ${biz.business_name}` : ""}
                    </p>
                    <p className="text-xs text-gray-500">נפתח: {formatDate(biz.opened_at)}</p>
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
