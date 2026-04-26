import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { vatReportsApi, vatReportsQK } from "@/features/vatReports";
import { Card } from "../../../../components/ui/primitives/Card";
import { Badge } from "../../../../components/ui/primitives/Badge";

const fmt = (n: string | number | null | undefined) =>
  n != null ? `₪${Number(n).toLocaleString("he-IL", { maximumFractionDigits: 0 })}` : "—";

interface Props {
  clientId: number;
}

export const ClientVatOverviewCard: React.FC<Props> = ({ clientId }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const { data: summary, isLoading } = useQuery({
    queryKey: vatReportsQK.clientSummary(clientId),
    queryFn: () => vatReportsApi.getClientSummary(clientId),
    enabled: clientId > 0,
    staleTime: 60_000,
  });

  const yearData = summary?.annual?.find((a) => a.year === currentYear);

  if (isLoading || !yearData) return null;

  return (
    <Card title='סקירת מע"מ'>
      <div
        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => navigate(`/tax/vat?client_id=${clientId}`)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800">דוחות מע&quot;מ {currentYear}</p>
          <p className="text-xs text-gray-500">
            הוגשו: {yearData.filed_count}/{yearData.periods_count}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              <p className="text-xs text-gray-400">מע&quot;מ נטו</p>
              {yearData.filed_count === yearData.periods_count && yearData.periods_count > 0 && (
                <Badge variant="success" className="text-xs">מדווח</Badge>
              )}
              {yearData.filed_count < yearData.periods_count && yearData.periods_count > 0 && (
                <Badge variant="warning" className="text-xs">חסר דיווח</Badge>
              )}
            </div>
          </div>
          <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
        </div>
      </div>
    </Card>
  );
};
