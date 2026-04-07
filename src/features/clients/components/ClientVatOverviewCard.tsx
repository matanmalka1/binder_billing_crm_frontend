import { useQuery, useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { clientsApi, clientsQK } from "../api";
import { vatReportsApi, vatReportsQK } from "@/features/vatReports/api";
import type { VatClientSummaryResponse } from "@/features/vatReports/api";
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";

const fmt = (n: string | number | null | undefined) =>
  n != null ? `₪${Number(n).toLocaleString("he-IL", { maximumFractionDigits: 0 })}` : "—";

interface Props {
  clientId: number;
}

export const ClientVatOverviewCard: React.FC<Props> = ({ clientId }) => {
  const navigate = useNavigate();

  const { data: businessesData, isLoading: loadingBiz } = useQuery({
    queryKey: clientsQK.businessesAll(clientId),
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId),
    enabled: clientId > 0,
    staleTime: 60_000,
  });

  const allActive = (businessesData?.items ?? []).filter((b) => b.status === "active");
  const businesses = allActive.filter((b) => b.business_type !== "employee");
  const hasEmployeeExcluded = allActive.some((b) => b.business_type === "employee");

  const summaryResults = useQueries({
    queries: businesses.map((biz) => ({
      queryKey: vatReportsQK.clientSummary(biz.id),
      queryFn: () => vatReportsApi.getBusinessSummary(biz.id),
      staleTime: 60_000,
    })),
  });

  if (loadingBiz) return null;
  if (businesses.length <= 1) return null;

  const currentYear = new Date().getFullYear();

  return (
    <Card title='סקירת מע"מ — כל העסקים'>
      <div className="space-y-2">
        {businesses.map((biz, idx) => {
          const summary = summaryResults[idx]?.data as VatClientSummaryResponse | undefined;
          const yearData = summary?.annual?.find((a) => a.year === currentYear);
          const isLoading = summaryResults[idx]?.isLoading;

          return (
            <div
              key={biz.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => navigate(`/clients/${clientId}/businesses/${biz.id}/vat`)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {biz.business_name ?? `עסק #${biz.id}`}
                </p>
                {yearData && (
                  <p className="text-xs text-gray-500">
                    דוחות שהוגשו: {yearData.filed_count}/{yearData.periods_count}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {yearData && (
                  <div className="text-left">
                    <p
                      dir="ltr"
                      className={`text-sm font-semibold tabular-nums ${
                        Number(yearData.net_vat) >= 0 ? "text-negative-600" : "text-positive-700"
                      }`}
                    >
                      {fmt(yearData.net_vat)}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <p className="text-[10px] text-gray-400">מע"מ נטו {currentYear}</p>
                      {yearData.filed_count === yearData.periods_count && yearData.periods_count > 0 && (
                        <Badge variant="success" className="text-[10px]">מדווח</Badge>
                      )}
                      {yearData.filed_count < yearData.periods_count && yearData.periods_count > 0 && (
                        <Badge variant="warning" className="text-[10px]">חסר דיווח</Badge>
                      )}
                    </div>
                  </div>
                )}
                {!isLoading && !yearData && (
                  <span className="text-xs text-gray-400">טרם הוגשו דוחות</span>
                )}
                <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
              </div>
            </div>
          );
        })}
        {hasEmployeeExcluded && (
          <p className="pt-1 text-xs text-gray-400">עסקים מסוג שכיר אינם מחויבים בדיווחי מע&quot;מ ואינם מוצגים כאן</p>
        )}
      </div>
    </Card>
  );
};
