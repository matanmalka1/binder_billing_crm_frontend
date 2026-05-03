import { GroupSection } from "../../../components/ui/primitives/GroupSection";
import { Badge } from "../../../components/ui/primitives/Badge";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import type { AnnualReportClientEntry, AnnualReportStatusGroup } from "../api";
import {
  getStatusLabel,
  getStatusVariant,
} from "@/features/annualReports";
import { formatDate } from "../../../utils/utils";

interface Props {
  statuses: AnnualReportStatusGroup[];
}

const clientColumns: Column<AnnualReportClientEntry>[] = [
  {
    key: "client_name",
    header: "לקוח",
    render: (r) => (
      <span className="text-sm font-medium text-gray-900">{r.client_name}</span>
    ),
  },
  {
    key: "form_type",
    header: "טופס",
    render: (r) => (
      <span className="text-sm text-gray-500">{r.form_type ?? "—"}</span>
    ),
  },
  {
    key: "filing_deadline",
    header: "מועד הגשה",
    render: (r) => (
      <span className="text-sm text-gray-500">
        {r.filing_deadline ? formatDate(r.filing_deadline) : "—"}
      </span>
    ),
  },
  {
    key: "days_until_deadline",
    header: "ימים לסיום",
    render: (r) => {
      if (r.days_until_deadline === null)
        return <span className="text-sm text-gray-400">—</span>;
      const d = r.days_until_deadline;
      const cls =
        d < 0
          ? "text-negative-600 font-semibold"
          : d <= 14
            ? "text-warning-600 font-semibold"
            : "text-gray-600";
      return (
        <span className={`text-sm ${cls}`}>
          {d < 0 ? `באיחור ${Math.abs(d)} ימים` : `${d} ימים`}
        </span>
      );
    },
  },
];

export const AnnualReportStatusTable: React.FC<Props> = ({ statuses }) => (
  <div className="space-y-4">
    {statuses.map((group) => (
      <GroupSection
        key={group.status}
        label={<Badge variant={getStatusVariant(group.status)}>{getStatusLabel(group.status)}</Badge>}
        count={group.count}
        countLabel="לקוחות"
      >
        <DataTable
          data={group.clients}
          columns={clientColumns}
          getRowKey={(r) => r.client_record_id}
          emptyMessage="אין לקוחות בסטטוס זה"
        />
      </GroupSection>
    ))}
  </div>
);
