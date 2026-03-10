import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { annualReportsApi, type AnnualReportFull } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { DataTable } from "../../../components/ui/DataTable";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  getStatusLabel,
  getStatusVariant,
} from "../../../api/annualReports.extended.utils";
import { formatDate } from "../../../utils/utils";

interface Props {
  clientId: number;
  currentReportId: number;
  onSelect?: (reportId: number) => void;
}

const fmt = (n: number | null | undefined) =>
  n == null
    ? "—"
    : n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

export const ReportHistoryTable: React.FC<Props> = ({
  clientId,
  currentReportId,
  onSelect,
}) => {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: QK.tax.annualReportsForClient(clientId),
    queryFn: () => annualReportsApi.listClientReports(clientId),
    staleTime: 30_000,
  });

  const sorted = [...reports].sort((a, b) => b.tax_year - a.tax_year);

  return (
    <DataTable<AnnualReportFull>
      data={sorted}
      isLoading={isLoading}
      getRowKey={(r) => r.id}
      emptyMessage="אין היסטוריית דוחות"
      rowClassName={(r) =>
        r.id === currentReportId ? "bg-primary-50" : ""
      }
      columns={[
        {
          key: "tax_year",
          header: "שנה",
          render: (r) => (
            <span className="font-semibold text-gray-900">{r.tax_year}</span>
          ),
        },
        {
          key: "total_income",
          header: "הכנסות",
          render: (r) => (
            <span className="text-gray-700">{fmt(r.total_income)}</span>
          ),
        },
        {
          key: "total_expenses",
          header: "הוצאות",
          render: (r) => (
            <span className="text-gray-700">{fmt(r.total_expenses)}</span>
          ),
        },
        {
          key: "profit",
          header: "רווח נקי",
          render: (r) => (
            <span className={r.profit != null && r.profit >= 0 ? "text-green-600" : "text-red-600"}>
              {fmt(r.profit)}
            </span>
          ),
        },
        {
          key: "tax_due",
          header: "חבות מס",
          render: (r) => (
            <span className="text-red-600">{fmt(r.tax_due)}</span>
          ),
        },
        {
          key: "final_balance",
          header: "יתרה/החזר",
          render: (r) => {
            if (r.final_balance == null) return <span className="text-gray-400">—</span>;
            return (
              <span className={r.final_balance > 0 ? "text-red-600" : "text-green-600"}>
                {r.final_balance > 0 ? `${fmt(r.final_balance)} לתשלום` : `${fmt(Math.abs(r.final_balance))} החזר`}
              </span>
            );
          },
        },
        {
          key: "submitted_at",
          header: "תאריך הגשה",
          render: (r) => (
            <span className="text-gray-500 text-xs">{formatDate(r.submitted_at) ?? "—"}</span>
          ),
        },
        {
          key: "status",
          header: "סטטוס",
          render: (r) => (
            <Badge variant={getStatusVariant(r.status)}>{getStatusLabel(r.status)}</Badge>
          ),
        },
        {
          key: "actions",
          header: "",
          render: (r) => (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect?.(r.id)}
                className="h-7 w-7 p-0"
                title="צפה"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
};
