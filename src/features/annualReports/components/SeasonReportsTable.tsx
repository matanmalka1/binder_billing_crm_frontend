import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { Badge } from "../../../components/ui/Badge";
import type { AnnualReportFull } from "../../../api/annualReports.extended.api";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
} from "../../../api/annualReports.extended.utils";
import { formatDate } from "../../../utils/utils";
import { AlertTriangle } from "lucide-react";
import { cn } from "../../../utils/utils";

interface Props {
  reports: AnnualReportFull[];
  isLoading?: boolean;
  onSelect?: (report: AnnualReportFull) => void;
}

export const SeasonReportsTable: React.FC<Props> = ({ reports, isLoading, onSelect }) => {
  const now = new Date();

  const isOverdue = (report: AnnualReportFull) => {
    if (!report.filing_deadline) return false;
    const terminal = ["submitted", "accepted", "closed"];
    if (terminal.includes(report.status)) return false;
    return new Date(report.filing_deadline) < now;
  };

  const columns: Column<AnnualReportFull>[] = [
    {
      key: "client_id",
      header: "לקוח",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-gray-800">#{r.client_id}</span>
      ),
    },
    {
      key: "form_type",
      header: "טופס",
      render: (r) => (
        <Badge variant="neutral" className="font-mono">
          {r.form_type}
        </Badge>
      ),
    },
    {
      key: "client_type",
      header: "סוג לקוח",
      render: (r) => (
        <span className="text-sm text-gray-700">{getClientTypeLabel(r.client_type)}</span>
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
      key: "filing_deadline",
      header: "מועד הגשה",
      render: (r) => {
        const overdue = isOverdue(r);
        return (
          <div className={cn("flex items-center gap-1.5 text-sm", overdue && "text-red-600 font-semibold")}>
            {overdue && <AlertTriangle className="h-3.5 w-3.5" />}
            {formatDate(r.filing_deadline)}
          </div>
        );
      },
    },
    {
      key: "submitted_at",
      header: "הוגש",
      render: (r) => (
        <span className="text-sm text-gray-600">{formatDate(r.submitted_at)}</span>
      ),
    },
  ];

  return (
    <DataTable
      data={reports}
      columns={columns}
      getRowKey={(r) => r.id}
      isLoading={isLoading}
      onRowClick={onSelect}
      emptyMessage="אין דוחות לשנה זו"
      rowClassName={(r) =>
        cn(isOverdue(r) && "bg-red-50/40")
      }
    />
  );
};
