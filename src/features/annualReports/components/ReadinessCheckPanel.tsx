import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { annualReportTaxApi } from "../../../api/annualReportTax.api";
import { QK } from "../../../lib/queryKeys";
import { cn } from "../../../utils/utils";

interface ReadinessCheckPanelProps {
  reportId: number;
}

export const ReadinessCheckPanel: React.FC<ReadinessCheckPanelProps> = ({ reportId }) => {
  const { data, isLoading } = useQuery({
    queryKey: QK.tax.annualReportReadiness(reportId),
    queryFn: () => annualReportTaxApi.getReadiness(reportId),
  });

  if (isLoading) return <p className="text-sm text-gray-400 py-2">בודק מוכנות...</p>;
  if (!data) return null;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          data.is_ready ? "text-green-700" : "text-red-600"
        )}
      >
        {data.is_ready ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>הדוח מוכן להגשה</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 shrink-0" />
            <span>הדוח אינו מוכן להגשה ({data.issues.length} בעיות)</span>
          </>
        )}
      </div>

      {data.issues.length > 0 && (
        <ul className="space-y-1">
          {data.issues.map((issue, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-sm text-red-700">
              <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-red-400" />
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
