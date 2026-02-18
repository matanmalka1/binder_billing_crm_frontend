import { DataTable, type Column } from "../../../components/ui/DataTable";
import { Badge } from "../../../components/ui/Badge";
import type { AnnualReportFull } from "../../../api/annualReports.extended.api";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
  getDeadlineTypeLabel,
} from "../../../api/annualReports.extended.utils";
import { formatDate } from "../../../utils/utils";
import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "../../../utils/utils";

interface Props {
  reports: AnnualReportFull[];
  isLoading?: boolean;
  onSelect?: (report: AnnualReportFull) => void;
}

const TERMINAL_STATUSES = new Set(["submitted", "accepted", "closed"]);

const daysUntil = (dateStr: string | null): number | null => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const DeadlineCell: React.FC<{ report: AnnualReportFull }> = ({ report }) => {
  const days = daysUntil(report.filing_deadline);
  const overdue = days !== null && days < 0 && !TERMINAL_STATUSES.has(report.status);
  const isTerminal = TERMINAL_STATUSES.has(report.status);

  return (
    <div className="flex flex-col gap-0.5">
      <span className={cn("text-sm", overdue && "font-semibold text-red-600")}>
        {formatDate(report.filing_deadline)}
      </span>
      {days !== null && !isTerminal && (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            days < 0 ? "text-red-500" : days <= 14 ? "text-orange-500" : "text-gray-400"
          )}
        >
          {days < 0 ? (
            <>
              <AlertTriangle className="h-3 w-3" />
              באיחור {Math.abs(days)} ימים
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              {days} ימים נותרו
            </>
          )}
        </span>
      )}
    </div>
  );
};

export const SeasonReportsTable: React.FC<Props> = ({ reports, isLoading, onSelect }) => {
  const columns: Column<AnnualReportFull>[] = [
    {
      key: "client_id",
      header: "לקוח",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-gray-700">#{r.client_id}</span>
      ),
    },
    {
      key: "form_type",
      header: "טופס",
      render: (r) => (
        <Badge variant="neutral" className="font-mono text-xs">
          {r.form_type}
        </Badge>
      ),
    },
    {
      key: "client_type",
      header: "סוג לקוח",
      render: (r) => (
        <span className="text-sm text-gray-600">{getClientTypeLabel(r.client_type)}</span>
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
      key: "deadline_type",
      header: "סוג מועד",
      render: (r) => (
        <span className="text-xs text-gray-500">{getDeadlineTypeLabel(r.deadline_type)}</span>
      ),
    },
    {
      key: "filing_deadline",
      header: "מועד הגשה",
      render: (r) => <DeadlineCell report={r} />,
    },
    {
      key: "submitted_at",
      header: "הוגש",
      render: (r) => (
        <span className="text-sm text-gray-500">{formatDate(r.submitted_at)}</span>
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
      rowClassName={(r) => {
        const days = daysUntil(r.filing_deadline);
        const overdue = days !== null && days < 0 && !TERMINAL_STATUSES.has(r.status);
        return cn(overdue && "bg-red-50/40");
      }}
    />
  );
};
